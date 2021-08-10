import { GiShuttlecock } from 'react-icons/gi';
import Tabs from 'sanity-plugin-tabs';

import { Document } from '~types/schemaTypes';

const players: Document = {
  name: 'players',
  title: 'Players',
  icon: GiShuttlecock,
  type: 'document',
  inputComponent: Tabs,
  fieldsets: [
    { name: 'main', title: 'Main' },
    { name: 'index', title: 'index' },
  ],
  fields: [
    {
      fieldset: 'main',
      title: 'Name',
      name: 'firstName',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      fieldset: 'main',
      title: 'Last Name',
      name: 'lastName',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      fieldset: 'main',
      title: 'Type player',
      name: 'type',
      type: 'string',
      options: {
        layout: 'radio',
        list: ['Competitiespeler', 'Recreant', 'Jeugd'],
      },
      validation: Rule => Rule.required(),
    },
    {
      fieldset: 'main',
      title: 'Gender',
      name: 'gender',
      type: 'string',
      options: {
        layout: 'radio',
        list: ['M', 'V'],
      },
      validation: Rule => Rule.required(),
    },
    {
      fieldset: 'main',
      title: 'Lidnummer',
      name: 'memberNumber',
      type: 'string',
    },
    {
      fieldset: 'main',
      title: 'Ranking enkel',
      description: 'Huidige ranking',
      name: 'rankingSingles',
      type: 'number',
      validation: Rule => Rule.max(12).min(1),
    },
    {
      fieldset: 'main',
      title: 'Ranking dubbel',
      description: 'Huidige ranking',
      name: 'rankingDoubles',
      type: 'number',
      validation: Rule => Rule.max(12).min(1),
    },
    {
      fieldset: 'main',
      title: 'Ranking mix',
      description: 'Huidige ranking',
      name: 'rankingMix',
      type: 'number',
      validation: Rule => Rule.max(12).min(1),
    },
    {
      fieldset: 'index',
      name: 'indexNote',
      type: 'note',
      options: {
        headline: 'Belangrijk',
        message:
          'Deze indexen zijn gebasseerd op de rankings van mei vorig seizoen. Pas deze enkel aan als je weet wat je doet.',
        tone: 'critical',
      },
    },
    {
      fieldset: 'index',
      title: 'Discpline index singles',
      description: 'Mei vorig seizoen',
      name: 'discIndexSingles',
      type: 'number',
      validation: Rule => Rule.max(12).min(1),
    },
    {
      fieldset: 'index',
      title: 'Discpline index doubles',
      description: 'Mei vorig seizoen',
      name: 'discIndexDoubles',
      type: 'number',
      validation: Rule => Rule.max(12).min(1),
    },
    {
      fieldset: 'index',
      title: 'Discpline index mix',
      description: 'Mei vorig seizoen',
      name: 'discIndexMix',
      type: 'number',
      validation: Rule => Rule.max(12).min(1),
    },
    {
      fieldset: 'index',
      title: 'Somindex mix',
      description: 'Mei vorig seizoen',
      name: 'indexMix',
      type: 'number',
      validation: Rule => Rule.max(36).min(1),
    },
    {
      fieldset: 'index',
      title: 'Highest index mix',
      description: 'Mei vorig seizoen',
      name: 'highestIndexMix',
      type: 'number',
      validation: Rule => Rule.max(12).min(1),
    },
    {
      fieldset: 'index',
      title: 'Somindex heren/dames',
      description: 'Mei vorig seizoen',
      name: 'indexGender',
      type: 'number',
      validation: Rule => Rule.max(24).min(1),
    },
    {
      fieldset: 'index',
      title: 'Highest index heren/dames',
      description: 'Mei vorig seizoen',
      name: 'highestIndexGender',
      type: 'number',
      hidden: () => true,
      validation: Rule => Rule.max(12).min(1),
    },
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      rankingSingles: 'rankingSingles',
      rankingDoubles: 'rankingDoubles',
      rankingMix: 'rankingMix',
    },
    prepare({
      firstName,
      lastName,
      rankingSingles,
      rankingDoubles,
      rankingMix,
    }) {
      const title = `${firstName} ${lastName}`;
      return {
        title,
        subtitle: `E: ${rankingSingles} - D: ${rankingDoubles} - G: ${rankingMix}`,
      };
    },
  },
};

export default players;
