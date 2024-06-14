import { useStoreDispatch } from '@app/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  selectLogin,
  setLogin,
  useGetAuthenticatedUserQuery,
} from '../components/login/login.slice';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { Roles } from '../interfaces/format.interface';

// Need to specify the actions permitted for each type of user
const actions = [
  // 'CREATE_SCHEMA',
  // 'EDIT_SCHEMA',
  // 'EDIT_SCHEMA_METADATA',
  // 'EDIT_SCHEMA_FILES',
  // 'DELETE_SCHEMA',
  // 'CREATE_CROSSWALK',
  // 'EDIT_CROSSWALK_MAPPINGS',
  // 'EDIT_CROSSWALK_METADATA',
  // 'EDIT_CROSSWALK_FILES',
  // 'DELETE_CROSSWALK',
  'EDIT_CONTENT',
  'MAKE_MSCR_COPY',
] as const;

export type Action = typeof actions[number];

export interface hasPermissionProps {
  action: Action;
  owner?: string[];
}

export interface checkPermissionProps {
  user: User;
  action: Action;
  owner?: string[];
}

export default function HasPermission({ action, owner }: hasPermissionProps) {
  const { data: authenticatedUser } = useGetAuthenticatedUserQuery();
  const dispatch = useStoreDispatch();
  const user = useSelector(selectLogin());

  useEffect(() => {
    if (
      authenticatedUser &&
      (authenticatedUser.anonymous !== user.anonymous ||
        authenticatedUser.username !== user.username)
    ) {
      dispatch(setLogin(authenticatedUser));
    }
  }, [authenticatedUser, dispatch, user]);

  if (
    !user ||
    user.anonymous ||
    !authenticatedUser ||
    authenticatedUser.anonymous
  ) {
    return false;
  }

  if (!owner || owner.length == 0) {
    return checkPermission({
      user,
      action,
    });
  }

  return checkPermission({
    user,
    action,
    owner,
  });
}

export function checkPermission({ user, action, owner }: checkPermissionProps) {
  if (action == 'MAKE_MSCR_COPY') {
    return true;
  } else if (action == 'EDIT_CONTENT') {
    if (owner?.includes(user.id)) {
      //user is the owner, Check for personal Contents
      return true;
    } else {
      //Group Content
      if (
        owner &&
        user.organizationsInRole[Roles.admin] &&
        user.organizationsInRole[Roles.admin].includes(owner[0])
      ) {
        // User has admin right for this group
        return true;
      }

      if (
        owner &&
        user.organizationsInRole[Roles.dataModelEditor] &&
        user.organizationsInRole[Roles.dataModelEditor].includes(owner[0])
      ) {
        // User has data model editor right for this group
        return true;
      }
    }
  }

  return false;
}
