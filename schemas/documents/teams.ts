import { GiShuttlecock } from 'react-icons/gi';

import { Document } from '~types/schemaTypes';

const teams: Document = {
  name: 'teams',
  title: 'Teams',
  icon: GiShuttlecock,
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'type',
      name: 'type',
      type: 'string',
      options: {
        layout: 'radio',
        list: ['heren', 'dames', 'gemengd'],
      },
    },
    {
      title: 'Basisspelers',
      name: 'basis',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'players' }] }],
      validation: Rule => Rule.max(4),
    },
  ],
  preview: {
    select: {
      title: 'name',
    },
    prepare({ title }) {
      return {
        title,
      };
    },
  },
};

export default teams;
