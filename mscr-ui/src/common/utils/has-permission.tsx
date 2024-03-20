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
  owner?: string[];
  
}

export interface checkPermissionProps {
  user: User;
  actions: Actions[];
  targetOrganizations?: string[];
  owner?: string[];
}

export default function HasPermission({
  actions,
  targetOrganization,
  owner,
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
    if (owner && owner.length) {
      //Editing Step as already has owner
      console.log(owner.length);
      console.log("checking edit permission");
      return checkEditPermission({
        user,
        actions: Array.isArray(actions) ? actions : [actions],
        owner,
      });
    }
  
    return checkPermission({
      user,
      actions: Array.isArray(actions) ? actions : [actions],
    });
  }


  //If there is target organization

  if (owner && owner.length) {
    //Editing Step as already has owner
    return checkEditPermission({
      user,
      actions: Array.isArray(actions) ? actions : [actions],
      targetOrganizations: [targetOrganization],
      owner,
    });
  }

  return checkPermission({ //Content Creation
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

  // Return true if target organization is undefined and user has admin role
  if (rolesInOrganizations.includes('ADMIN') && !targetOrganizations) {
    console.log('ONly admin');
    return true;
  }

  // Return true if user has data model editor role in target organization
  if (
    rolesInOrganizations.includes('DATA_MODEL_EDITOR') ||
    rolesInTargetOrganizations?.includes('DATA_MODEL_EDITOR')
  ) {
    console.log('Role is datamodel editor');
    return true;
  }

  // Return true if user has admin role in target organization
  if (
    rolesInOrganizations.includes('') &&
    rolesInTargetOrganizations?.includes('ADMIN')
  ) {
    return true;
  }

  return false;
}

export function checkEditPermission({
  user,
  actions,
  targetOrganizations,
  owner
}: checkPermissionProps) {

  //Check for personal Contents
  if (owner?.includes(user.id)) {
    //user is the owner
    return true;
  }

  const rolesInOrganizations = Object.keys(user.organizationsInRole);
  if (rolesInOrganizations.includes('ADMIN')) {
    console.log('ONly admin');
    console.log(user.organizationsInRole.filter());
    return true;
  }

  
  return false;
}
