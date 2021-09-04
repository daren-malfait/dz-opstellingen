import { parseISO, format } from 'date-fns';
import { saveAs } from 'file-saver';
import client from 'part:@sanity/base/client';
import { withDocument, withValuePath } from 'part:@sanity/form-builder';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as React from 'react';

import { Button } from './Button/button.styles';

import { Discipline } from '../types/badminton';

const query = `
  *[_id == $id][0] {
    date,
    away,
    opponent,
    team {
      ...@->
    },
    captain->,
    matches[] {
      discipline,
      player1 {
        player->
      },
      player2 {
        player->
      },
    }
  }
`;

function ExportPDFButton({ document, getValuePath }) {
  const getContext = React.useCallback(
    (level = 1) => {
      const valuePath = getValuePath();
      const removeItems = -Math.abs(level);
      return valuePath.length + removeItems <= 0
        ? document
        : valuePath.slice(0, removeItems).reduce((context, current) => {
            if (typeof current === 'string') {
              return context[current] || {};
            }

            if (
              typeof current === 'object' &&
              Array.isArray(context) &&
              current._key
            ) {
              return (
                context.filter(
                  item => item._key && item._key === current._key,
                )[0] || {}
              );
            }
          }, document);
    },
    [document, getValuePath],
  );

  async function getForm() {
    const result = await fetch('/static/blanco-ploegopstellingsformulier.pdf');
    const form = await result.arrayBuffer();
    const pdfDoc = await PDFDocument.load(form);
    const pages = pdfDoc.getPages();
    const pdf = pages[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    return { pdf, font, pdfDoc };
  }

  function getUniquePlayers(matches) {
    let uniquePlayers = [];

    matches.forEach(({ player1, player2 }) => {
      let player = player1.player;

      if (
        !uniquePlayers
          .map(({ memberNumber }) => memberNumber)
          .includes(player.memberNumber)
      ) {
        uniquePlayers = [...uniquePlayers, player];
      }

      if (player2 && player2.player) {
        player = player2.player;

        if (
          !uniquePlayers
            .map(({ memberNumber }) => memberNumber)
            .includes(player.memberNumber)
        ) {
          uniquePlayers = [...uniquePlayers, player];
        }
      }
    });

    return uniquePlayers;
  }

  const onClick = React.useCallback(async () => {
    const { _id: id } = getContext();

    const event = await client.fetch(query, {
      id,
    });

    const { pdf, font, pdfDoc } = await getForm();

    const { matches, team, away, opponent, date, captain } = event;

    let index = 'indexGender';
    let highestIndex = 'highestIndexGender';

    if (team.type === 'gemengd') {
      index = 'indexMix';
      highestIndex = 'highestIndexMix';
    }

    let uniquePlayers = getUniquePlayers(matches);

    const titularis = [...uniquePlayers]
      .sort((a, b) => {
        return a[index] > b[index] ? 1 : -1;
      })
      .slice(0, 4);

    const titularisIndex = titularis.reduce((a, b) => a + (b[index] || 0), 0);

    const Datum = format(new Date(parseISO(date)), 'dd-MM-yyyy');
    const Time = format(new Date(parseISO(date)), 'HH:mm');

    if (captain) {
      pdf.drawText(captain.firstName, {
        x: 215,
        y: 357,
        size: 12,
        font,
      });

      pdf.drawText(captain.lastName, {
        x: 215 + 130,
        y: 357,
        size: 12,
        font,
      });
    }

    pdf.drawText(Datum, {
      x: 550,
      y: 460,
      size: 12,
      font,
    });

    pdf.drawText(titularisIndex.toString(), {
      x: 755,
      y: 460,
      size: 12,
      font,
    });

    pdf.drawText(Time, {
      x: 550,
      y: 460 - 14,
      size: 12,
      font,
    });

    const dz = `DZ99 ${team.name}`;
    const homeTeam = away ? opponent : dz;
    const awayTeam = away ? dz : opponent;

    pdf.drawText('x', {
      x: away ? 460 - 20 : 215 - 20,
      y: 425,
      size: 12,
      font,
    });

    pdf.drawText(homeTeam, {
      x: 215,
      y: 425,
      size: 12,
      font,
    });

    pdf.drawText(awayTeam, {
      x: 460,
      y: 425,
      size: 12,
      font,
    });

    function createLine(player, x, y, klas, sumIndex, highestIndex) {
      pdf.drawText(player.lastName, {
        x,
        y,
        size: 12,
        font,
      });

      pdf.drawText(player.firstName, {
        x: x + 130,
        y,
        size: 12,
        font,
      });

      pdf.drawText(klas.toString(), {
        x: x + 245,
        y,
        size: 12,
        font,
      });

      if (
        uniquePlayers
          .map(({ memberNumber }) => memberNumber)
          .includes(player.memberNumber)
      ) {
        pdf.drawText(player.memberNumber, {
          x: x + 315,
          y,
          size: 12,
          font,
        });

        pdf.drawText(sumIndex.toString(), {
          x: x + 380,
          y,
          size: 12,
          font,
        });

        pdf.drawText(highestIndex.toString(), {
          x: x + 435,
          y,
          size: 12,
          font,
        });

        if (
          titularis
            .map(({ memberNumber }) => memberNumber)
            .includes(player.memberNumber)
        ) {
          pdf.drawText('x', {
            x: x + 500,
            y,
            size: 12,
            font,
          });
        }

        uniquePlayers = uniquePlayers.filter(
          ({ memberNumber }) => memberNumber !== player.memberNumber,
        );
      }
    }

    let sorting = [
      Discipline.MensDoubles,
      Discipline.WomensDoubles,
      Discipline.MensSingles,
      Discipline.WomensSingles,
    ];

    if (team.type === 'gemengd') {
      sorting = [
        Discipline.MensDoubles,
        Discipline.WomensDoubles,
        Discipline.MixedDoubles,
        Discipline.MensSingles,
        Discipline.WomensSingles,
      ];
    }

    const sortedMatches = matches.sort((a, b) => {
      return sorting.indexOf(a.discipline) - sorting.indexOf(b.discipline);
    });

    sortedMatches.forEach(({ player1, player2 }, i) => {
      const startXPos = 215;
      let startYPos = 339;
      let rowHeight = 14;
      let klassement = 'rankingDoubles';

      if (team.type === 'gemengd') {
        if (i >= 2) {
          klassement = 'rankingMix';
        }
      }

      if (i >= 4) {
        startYPos = 277;
        rowHeight = rowHeight / 2;
        klassement = 'rankingSingles';
      }

      createLine(
        player1.player,
        startXPos,
        startYPos - i * rowHeight * 2,
        player1.player[klassement],
        player1.player[index],
        player1.player[highestIndex],
      );

      if (player2 && player2.player && i < 4) {
        createLine(
          player2.player,
          startXPos,
          startYPos - rowHeight - i * rowHeight * 2,
          player2.player[klassement],
          player2.player[index],
          player2.player[highestIndex],
        );
      }
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    // const blobUrl = URL.createObjectURL(blob);

    saveAs(
      blob,
      `${format(
        new Date(parseISO(date)),
        'yyyy-MM-dd',
      )}_dz99-${team.name.toLowerCase()}_opstellingsformulier`,
    );
  }, [getContext]);

  return (
    <div>
      <Button onClick={onClick}>Genereer wedstrijdformulier</Button>
    </div>
  );
}

export default React.memo(withValuePath(withDocument(ExportPDFButton)));
