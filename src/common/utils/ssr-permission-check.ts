import { AppState } from '@app/store';
import { getStoreData } from '../components/page-head/utils';
import { Actions, checkPermission } from './has-permission';

export function ssrHasPermission(storeState: AppState, actions: Actions[]) {
  const vocabulary = getStoreData({
    state: storeState,
    reduxKey: 'vocabularyAPI',
    functionKey: 'getVocabulary',
  });

  const user = getStoreData({
    state: storeState,
    reduxKey: 'loginApi',
    functionKey: 'getAuthenticatedUser',
  });

  return checkPermission({
    user: user,
    actions: actions,
    targetOrganizations: vocabulary.references
      ? vocabulary.references.contributor
      : undefined,
  });
}
