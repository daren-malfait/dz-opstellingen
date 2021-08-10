import S from '@sanity/desk-tool/structure-builder';
import { GiShuttlecock } from 'react-icons/gi';

export default S.listItem()
  .title('Players')
  .schemaType('players')
  .child(
    S.documentList()
      .id('players')
      .title('Players')
      .schemaType('players')
      .filter('_type == $type')
      .params({
        type: 'players',
      })
      .menuItems([...S.documentTypeList('players').getMenuItems()])
      .defaultOrdering([{ field: 'firstName', direction: 'asc' }]),
  )
  .icon(GiShuttlecock);
