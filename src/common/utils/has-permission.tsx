import { useSelector } from 'react-redux';
import { selectAdminControls } from '../components/admin-controls/admin-controls.slice';
import { selectLogin } from '../components/login/login.slice';
import { User } from '../interfaces/user.interface';

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

type Actions = typeof actions[number];

export interface hasPermissionProps {
  actions: Actions | Actions[];
  targetOrganization?: string;
}

export interface checkPermissionProps {
  user: User;
  actions: Actions[];
  targetOrganization?: string;
}

export default function HasPermission({
  actions,
  targetOrganization,
}: hasPermissionProps) {
  const user = useSelector(selectLogin());
  const isAdminControlsDisabled = useSelector(selectAdminControls());

  if (isAdminControlsDisabled) {
    return false;
  }

  if (!user || user.anonymous) {
    return false;
  }

  return checkPermission({
    user,
    actions: Array.isArray(actions) ? actions : [actions],
    targetOrganization,
  });
}

export function checkPermission({
  user,
  actions,
  targetOrganization,
}: checkPermissionProps) {
  const organizationsInRole = Object.keys(user.organizationsInRole);
  const rolesInTargetOrganization =
    targetOrganization && user.rolesInOrganizations[targetOrganization];

  // Return true if user is superuser
  if (user.superuser) {
    return true;
  }

  // Return true if target organization is undefined and user has admin role
  if (organizationsInRole.includes('ADMIN') && !targetOrganization) {
    return true;
  }

  // Return true if user has admin role in target organization
  if (
    organizationsInRole.includes('ADMIN') &&
    rolesInTargetOrganization?.includes('ADMIN')
  ) {
    return true;
  }

  // Return true if user has terminology editor role and actions
  // don't include admin actions
  if (
    !targetOrganization &&
    organizationsInRole.includes('TERMINOLOGY_EDITOR') &&
    !actions.some((action) => action.includes('ADMIN'))
  ) {
    return true;
  }

  // Return true if user has terminology editor role for target
  // organization and actions don't include admin actions
  if (
    rolesInTargetOrganization?.includes('TERMINOLOGY_EDITOR') &&
    !actions.some((action) => action.includes('ADMIN'))
  ) {
    return true;
  }

  return false;
}
