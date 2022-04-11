import { User } from '@app/common/interfaces/user.interface';

const actions = [
  'ADMIN_TERMINOLOGY',
  'CREATE_TERMINOLOGY',
  'EDIT_TERMINOLOGY',
  'DELETE_TERMINOLOGY',
  'ADMIN_CONCEPT',
  'CREATE_CONCEPT',
  'DELETE_CONEPT',
  'EDIT_CONCEPT',
  'ADMIN_COLLECTION',
  'CREATE_COLLECTION',
  'EDIT_COLLECTION',
  'DELETE_COLLECTION'
] as const;

type Actions = typeof actions[number];

export interface hasPermissionProps {
  user: User;
  actions: Actions | Actions[];
  targetOrganization?: string;
};

export default function hasPermission({user, actions, targetOrganization}: hasPermissionProps) {
  if (!targetOrganization) {
    if (Object.keys(user.organizationsInRole).includes('ADMIN')) {
      return true;
    } else if (
      Object.keys(user.organizationsInRole).includes('TERMINOLOGY_EDITOR')
      &&
      (Array.isArray(actions) ? !actions.some(action => action.includes('ADMIN')) : !actions.includes('ADMIN'))
    ) {
      return true;
    }
  } else {
    if (!Object.keys(user.rolesInOrganizations).includes(targetOrganization)) {
      return false;
    }

    const rolesInTargetOrganization = user.rolesInOrganizations[targetOrganization];

    if (rolesInTargetOrganization.includes('ADMIN')) {
      return true;
    } else if (
      rolesInTargetOrganization.includes('TERMINOLOGY_EDITOR')
      &&
      (Array.isArray(actions) ? !actions.some(action => action.includes('ADMIN')) : !actions.includes('ADMIN'))
    ) {
      return true;
    }
  }

  return false;
}
