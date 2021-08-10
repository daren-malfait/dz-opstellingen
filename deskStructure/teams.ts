import S from '@sanity/desk-tool/structure-builder';
import { GiShuttlecock } from 'react-icons/gi';

export default S.listItem()
  .title('Teams')
  .schemaType('teams')
  .child(
    S.documentList()
      .id('teams')
      .title('Teams')
      .schemaType('teams')
      .filter('_type == $type')
      .params({
        type: 'teams',
      })
      .menuItems([...S.documentTypeList('teams').getMenuItems()])
      .defaultOrdering([{ field: 'name', direction: 'asc' }]),
  )
  .icon(GiShuttlecock);
