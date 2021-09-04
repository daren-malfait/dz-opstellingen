import { parseISO, format } from 'date-fns';
import client from 'part:@sanity/base/client';
import { BiListCheck, BiListUl, BiListPlus } from 'react-icons/bi';
import { MdEvent } from 'react-icons/md';

import ExportPDFButton from '../../components/ExportPDFButton';

import {
  checkGenderBasedValid,
  checkMixedValid,
  getPlayerInfos,
} from '../../utils/lineup';

import { Document } from '~types/schemaTypes';

const events: Document = {
  name: 'events',
  title: 'Events',
  icon: MdEvent,
  type: 'document',
  initialValue: {
    away: false,
  },
  fields: [
    {
      title: 'Team',
      name: 'team',
      type: 'reference',
      to: [{ type: 'teams' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'opponent',
      title: 'Opponent',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'away',
      title: 'Away match',
      type: 'boolean',
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: Rule => Rule.required(),
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
    },
    {
      title: 'Kapitein',
      name: 'captain',
      type: 'reference',
      to: [{ type: 'players' }],
    },
    {
      name: 'matches',
      title: 'Matches',
      type: 'array',
      of: [{ type: 'match' }],
      validation: Rule =>
        Rule.custom(async (matches, { parent }) => {
          if (!matches || matches.length < 8) {
            return true;
          }

          const { team } = parent;

          if (!team) {
            return 'Er moet een team geselecteerd worden.';
          }

          const { type } = await client.fetch(`*[_id == $id][0]`, {
            id: team._ref,
          });

          const players = await getPlayerInfos(matches);

          if (type === 'gemengd') {
            return checkMixedValid(matches, players);
          }

          if (type === 'heren' || type === 'dames') {
            return checkGenderBasedValid(matches, players);
          }

          return true;
        }).max(8),
    },
    {
      name: 'export',
      title: 'Export',
      type: 'boolean',
      inputComponent: ExportPDFButton,
    },
  ],
  preview: {
    select: {
      opponent: 'opponent',
      away: 'away',
      team: 'team.name',
      date: 'date',
      matches: 'matches',
    },
    prepare({ opponent, away, team, date, matches }) {
      function title() {
        const teamName = `DZ99 ${team}`;
        if (away) {
          return `${opponent} - ${teamName}`;
        }

        return `${teamName} - ${opponent}`;
      }

      const Datum = format(new Date(parseISO(date)), 'dd-MM-yyyy');
      const Time = format(new Date(parseISO(date)), 'HH:mm');

      return {
        title: title(),
        subtitle: `${Datum} - ${Time}`,
        media: (function () {
          if (!matches) {
            return BiListPlus;
          }

          return matches.length === 8 ? BiListCheck : BiListUl;
        })(),
      };
    },
  },
};

export default events;
