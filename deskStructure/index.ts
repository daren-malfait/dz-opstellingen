import S from '@sanity/desk-tool/structure-builder';
import DocumentsPane from 'sanity-plugin-documents-pane';

import events from './events';
import players from './players';
import teams from './teams';

// Hide document types that we already have a specific structure definition for
const hiddenDocTypes = (listItem: any) =>
  !['events', 'players', 'teams'].includes(listItem.getId());

function deskStructure(): any {
  return S.list()
    .id('__root__')
    .title('Content')
    .items([
      events,
      players,
      teams,
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);
}

export default deskStructure;

export function getDefaultDocumentNode({ schemaType }: any): any {
  if (schemaType === 'teams' || schemaType === 'players') {
    return S.document().views([
      S.view.form(),
      S.view
        .component(DocumentsPane)
        .options({
          query: `*[!(_id in path("drafts.**")) && references($id)] | order(date asc)`,
          params: { id: `_id` },
          useDraft: false,
          debug: true,
        })
        .title('Ontmoetingen'),
    ]);
  }

  return S.document().views([S.view.form()]);
}
