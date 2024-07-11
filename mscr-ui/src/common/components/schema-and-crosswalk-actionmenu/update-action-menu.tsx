import {
  resetMenuList,
  setIsCrosswalk,
  setMenuList,
} from '@app/common/components/actionmenu/actionmenu.slice';
import { State } from '@app/common/interfaces/state.interface';
import { SchemaWithVersionInfo } from '@app/common/interfaces/schema.interface';
import { CrosswalkWithVersionInfo } from '@app/common/interfaces/crosswalk.interface';
import { Type } from '@app/common/interfaces/search.interface';
import { useStoreDispatch } from '@app/store';

export function updateActionMenu(
  dispatch: ReturnType<typeof useStoreDispatch>,
  contentType: Type,
  contentData: SchemaWithVersionInfo | CrosswalkWithVersionInfo | undefined,
  hasEditPermission: boolean,
  isMscrCopyAvailable?: boolean
) {
  dispatch(resetMenuList());
  if (!contentData || contentData.state === State.Removed) {
    return;
  }
  dispatch(setIsCrosswalk(contentType === Type.Crosswalk));
  if (isMscrCopyAvailable) {
    dispatch(setMenuList(['mscrCopy']));
  }
  if (!hasEditPermission) return;
  dispatch(setMenuList(['editMetadata']));
  switch (contentData.state) {
    case State.Draft:
      dispatch(setMenuList(['deleteDraft', 'publish']));
      // Todo: this doesn't need to be conditional when schema editing is implemented
      if (contentType === Type.Crosswalk) {
        dispatch(setMenuList(['editContent']));
      }
      break;
    case State.Published:
      dispatch(setMenuList(['deprecate', 'invalidate']));
      break;
    default:
      dispatch(setMenuList(['remove']));
  }
  const revisions = contentData.revisions;
  if (revisions.length > 0) {
    const latestVersion = revisions[revisions.length - 1].pid;
    if (contentData.pid === latestVersion) {
      dispatch(setMenuList(['version']));
    }
  }
}
