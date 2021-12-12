import S from '@sanity/desk-tool/structure-builder';
import { add } from 'date-fns';
import { FaBook } from 'react-icons/fa';

export default S.listItem()
  .title('Ontmoetingen')
  .schemaType('events')
  .child(
    S.documentTypeList('events')
      .title('Events')
      .filter('_type == $type && date > $yesterday')
      .params({
        type: 'events',
        yesterday: add(new Date(), { days: -1 }),
      })
      .menuItems([...S.documentTypeList('events').getMenuItems()])
      .defaultOrdering([{ field: 'date', direction: 'desc' }]),
  )
  .icon(FaBook);
