import { useStoreDispatch } from '@app/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  selectLogin,
  setLogin,
  useGetAuthenticatedUserQuery,
} from '../components/login/login.slice';
import { User } from 'yti-common-ui/interfaces/user.interface';

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
  'VIEW',
] as const;

export type Actions = (typeof actions)[number];

export interface hasPermissionProps {
  actions: Actions | Actions[];
  targetOrganization?: string[];
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

  if (!targetOrganization) {
    return checkPermission({
      user,
      actions: Array.isArray(actions) ? actions : [actions],
    });
  }

  return checkPermission({
    user,
    actions: Array.isArray(actions) ? actions : [actions],
    targetOrganizations: Array.isArray(targetOrganization)
      ? targetOrganization
      : [targetOrganization],
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

  // Return true if user has admin role in target organization
  if (
    rolesInOrganizations.includes('ADMIN') &&
    rolesInTargetOrganizations?.includes('ADMIN')
  ) {
    return true;
  }

  // View access for members
  if (
    rolesInTargetOrganizations?.includes('MEMBER') &&
    actions.includes('VIEW')
  ) {
    return true;
  }

  // Actions not related to any organization
  if (
    (!targetOrganizations || targetOrganizations.length === 0) &&
    rolesInOrganizations.some((role) =>
      ['DATA_MODEL_EDITOR', 'ADMIN'].includes(role)
    ) &&
    actions.includes('CREATE_DATA_MODEL')
  ) {
    return true;
  }

  if (
    rolesInTargetOrganizations?.includes('DATA_MODEL_EDITOR') &&
    !actions.some((action) => action.includes('ADMIN'))
  ) {
    return true;
  }

  return false;
}
