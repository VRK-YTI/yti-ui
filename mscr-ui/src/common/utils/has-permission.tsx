import { useStoreDispatch } from '@app/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  selectLogin,
  setLogin,
  useGetAuthenticatedUserQuery,
} from '../components/login/login.slice';
import { User } from 'yti-common-ui/interfaces/user.interface';

// Need to specify the acctions permitted for each type of user
const actions = [
  'ADMIN_DATA_MODEL',
  'CREATE_DATA_MODEL',
  'EDIT_DATA_MODEL',
  'DELETE_DATA_MODEL',
  'ADMIN_CLASS',
  'CREATE_CLASS',
  'DELETE_CLASS',
  'EDIT_CLASS',
  'ADMIN_ASSOCIATION',
  'CREATE_ASSOCIATION',
  'EDIT_ASSOCIATION',
  'DELETE_ASSOCIATION',
  'ADMIN_ATTRIBUTE',
  'CREATE_ATTRIBUTE',
  'EDIT_ATTRIBUTE',
  'DELETE_ATTRIBUTE',
  'CREATE_SCHEMA',
  'EDIT_SCHEMA',
  'EDIT_SCHEMA_METADATA',
  'EDIT_SCHEMA_FILES',
  'DELETE_SCHEMA',
  'CREATE_CROSSWALK',
  'EDIT_CROSSWALK_MAPPINGS',
  'EDIT_CROSSWALK_METADATA',
  'EDIT_CROSSWALK_FILES',
  'DELETE_CROSSWALK',
] as const;

export type Actions = typeof actions[number];

export interface hasPermissionProps {
  actions: Actions | Actions[];
  targetOrganization?: string;
}

export interface checkPermissionProps {
  user: User;
  actions: Actions[];
  targetOrganizations?: string[];
}

export default function HasPermission({
  actions,
  targetOrganization,
}: hasPermissionProps) {
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
  if(user)
  console.log(user.organizationsInRole);

  if (!targetOrganization) {
    return checkPermission({
      user,
      actions: Array.isArray(actions) ? actions : [actions],
    });
  }

  return checkPermission({
    user,
    actions: Array.isArray(actions) ? actions : [actions],
    targetOrganizations: [targetOrganization],
  });
}

export function checkPermission({
  user,
  actions,
  targetOrganizations,
}: checkPermissionProps) {
  const rolesInOrganizations = Object.keys(user.organizationsInRole);
  
  const rolesInTargetOrganizations =
    targetOrganizations &&
    targetOrganizations
      ?.flatMap((org) => user.rolesInOrganizations[org])
      .filter((t) => t);

  // Return true if user is superuser
  if (user.superuser) {
    return true;
  }

  if (targetOrganizations) {
    console.log(targetOrganizations);
  }

  // Return true if target organization is undefined and user has admin role
  if (rolesInOrganizations.includes('ADMIN') && !targetOrganizations) {
    return true;
  }

  // Return true if user has admin role in target organization
  if (
    rolesInOrganizations.includes('DATA_MODEL_EDITOR') &&
    rolesInTargetOrganizations?.includes('DATA_MODEL_EDITOR')
  ) {
    return true;
  }

   // Return true if user has datamodel editor role in target organization
   if (
    rolesInOrganizations.includes('') &&
    rolesInTargetOrganizations?.includes('ADMIN')
  ) {
    return true;
  }

  return false;
}
