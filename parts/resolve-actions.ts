import defaultResolve, {
  PublishAction,
  DiscardChangesAction,
} from 'part:@sanity/base/document-actions';

const singletons: string[] = [];

export default function resolveDocumentActions(
  props: any,
): Record<string, unknown>[] {
  const isSingle = singletons.indexOf(props.type) > -1;

  if (isSingle) {
    return [PublishAction, DiscardChangesAction];
  }

  return [...defaultResolve(props)];
}
