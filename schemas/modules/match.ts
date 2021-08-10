import { Discipline } from '../../types/badminton';
import { getCombinedRanking, getHighestRanking } from '../../utils/rankings';

import { ObjectField } from '~types/schemaTypes';

const twoPlayerDisciplines = [
  Discipline.MensDoubles,
  Discipline.WomensDoubles,
  Discipline.MixedDoubles,
];

const match: ObjectField = {
  title: 'Match',
  name: 'match',
  type: 'object',
  fields: [
    {
      title: 'Discipline',
      name: 'discipline',
      type: 'string',
      options: {
        list: [
          { title: 'Heren dubbel', value: Discipline.MensDoubles },
          { title: 'Dames dubbel', value: Discipline.WomensDoubles },
          { title: 'Dames enkel', value: Discipline.WomensSingles },
          { title: 'Heren enkel', value: Discipline.MensSingles },
          { title: 'Gemengd dubbel', value: Discipline.MixedDoubles },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      title: 'Player',
      name: 'player1',
      type: 'object',
      fields: [
        {
          title: 'Player',
          name: 'player',
          type: 'reference',
          to: [{ type: 'players' }],
          validation: Rule => Rule.required(),
        },
      ],
      hidden: ({ parent }: any): boolean => {
        return !parent || !parent.discipline;
      },
    },
    {
      title: 'Player 2',
      name: 'player2',
      type: 'object',
      fields: [
        {
          title: 'Player 2',
          name: 'player',
          type: 'reference',
          to: [{ type: 'players' }],
        },
      ],
      hidden: ({ parent }: any): boolean => {
        return (
          !parent ||
          !twoPlayerDisciplines.includes(parent.discipline) ||
          !parent.discipline
        );
      },
    },
  ],
  preview: {
    select: {
      discipline: 'discipline',
      player1FirstName: 'player1.player.firstName',
      player1LastName: 'player1.player.lastName',
      player1RankingDoubles: 'player1.player.rankingDoubles',
      player1RankingSingles: 'player1.player.rankingSingles',
      player1RankingMix: 'player1.player.rankingMix',
      player2FirstName: 'player2.player.firstName',
      player2LastName: 'player2.player.lastName',
      player2RankingDoubles: 'player2.player.rankingDoubles',
      player2RankingSingles: 'player2.player.rankingSingles',
      player2RankingMix: 'player2.player.rankingMix',
    },
    prepare({
      discipline,
      player1FirstName,
      player1LastName,
      player1RankingDoubles,
      player1RankingSingles,
      player1RankingMix,
      player2FirstName,
      player2LastName,
      player2RankingDoubles,
      player2RankingSingles,
      player2RankingMix,
    }) {
      const player1 = {
        firstName: player1FirstName,
        lastName: player1LastName,
        rankingDoubles: player1RankingDoubles,
        rankingSingles: player1RankingSingles,
        rankingMix: player1RankingMix,
      };

      const player2 = {
        firstName: player2FirstName,
        lastName: player2LastName,
        rankingDoubles: player2RankingDoubles,
        rankingSingles: player2RankingSingles,
        rankingMix: player2RankingMix,
      };

      let title = `${discipline}: ${player1FirstName} ${player1LastName}`;

      if (twoPlayerDisciplines.includes(discipline)) {
        title += ` + ${player2FirstName} ${player2LastName}`;
      }

      return {
        title,
        subtitle: `ranking: ${getCombinedRanking(
          discipline,
          player1,
          player2,
        )} - highest: ${getHighestRanking(discipline, player1, player2)}`,
      };
    },
  },
};

export default match;
