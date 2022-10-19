import { AppState } from '@app/store';
import { getStoreData } from '../components/page-head/utils';

export function ssrIsAuthenticated(storeState: AppState) {
  const user = getStoreData({
    state: storeState,
    reduxKey: 'loginApi',
    functionKey: 'getAuthenticatedUser',
  });

  return !user?.anonymous ?? false;
}
