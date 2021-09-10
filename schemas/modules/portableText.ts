import { BsFileRichtext } from 'react-icons/bs';

import { ArrayField } from '~types/schemaTypes';

const portableText: ArrayField = {
  title: 'Portable Text',
  name: 'portableText',
  type: 'array',
  icon: BsFileRichtext,
  of: [
    {
      title: 'Block',
      type: 'block',
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
      },
    },
  ],
};

export default portableText;
