import { useStoreDispatch } from '@app/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAdminControls } from '../components/admin-controls/admin-controls.slice';
import {
  selectLogin,
  setLogin,
  useGetAuthenticatedUserQuery,
} from '../components/login/login.slice';
import { Organization } from '../interfaces/organization.interface';
import { User } from 'yti-common-ui/interfaces/user.interface';

const actions = [
  'ADMIN_TERMINOLOGY',
  'CREATE_TERMINOLOGY',
  'EDIT_TERMINOLOGY',
  'DELETE_TERMINOLOGY',
  'ADMIN_CONCEPT',
  'CREATE_CONCEPT',
  'DELETE_CONCEPT',
  'EDIT_CONCEPT',
  'ADMIN_COLLECTION',
  'CREATE_COLLECTION',
  'EDIT_COLLECTION',
  'DELETE_COLLECTION',
] as const;

export type Actions = typeof actions[number];

export interface hasPermissionProps {
  actions: Actions | Actions[];
  targetOrganization?: string | Organization[];
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
  const isAdminControlsDisabled = useSelector(selectAdminControls());

  useEffect(() => {
    if (
      authenticatedUser &&
      (authenticatedUser.anonymous !== user.anonymous ||
        authenticatedUser.username !== user.username)
    ) {
      dispatch(setLogin(authenticatedUser));
    }
  }, [authenticatedUser, dispatch, user]);

  if (isAdminControlsDisabled) {
    return false;
  }

  if (
    !user ||
    user.anonymous ||
    !authenticatedUser ||
    authenticatedUser.anonymous
  ) {
    return false;
  }

  if (!targetOrganization) {
    return checkPermission({
      user,
      actions: Array.isArray(actions) ? actions : [actions],
    });
  }

  return checkPermission({
    user,
    actions: Array.isArray(actions) ? actions : [actions],
    targetOrganizations:
      typeof targetOrganization === 'string'
        ? [targetOrganization]
        : targetOrganization.map((org) => org.id),
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

  // Return true if target organization is undefined and user has admin role
  if (rolesInOrganizations.includes('ADMIN') && !targetOrganizations) {
    return true;
  }

  // Return true if user has admin role in target organization
  if (
    rolesInOrganizations.includes('ADMIN') &&
    rolesInTargetOrganizations?.includes('ADMIN')
  ) {
    return true;
  }

  // Return true if user has terminology editor role and actions
  // don't include admin actions
  if (
    !targetOrganizations &&
    rolesInOrganizations.includes('TERMINOLOGY_EDITOR') &&
    !actions.some((action) => action.includes('ADMIN'))
  ) {
    return true;
  }

  // Return true if user has terminology editor role for target
  // organization and actions don't include admin actions
  if (
    rolesInTargetOrganizations?.includes('TERMINOLOGY_EDITOR') &&
    !actions.some((action) => action.includes('ADMIN'))
  ) {
    return true;
  }

  return false;
}
