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

  //No Target Organization
  if (!targetOrganization) {
    if (owner && owner.length) {
      //Editing Step as already has owner
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
  return checkPermission({
    //Content Creation
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
  console.log(targetOrganizations);

  console.log("check content creation permission");
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

  console.log(rolesInTargetOrganizations);
  // Return true if user has data model editor role in target organization
  if (
    rolesInTargetOrganizations?.includes('DATA_MODEL_EDITOR')||rolesInTargetOrganizations?.includes('ADMIN')
  ) {
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
  owner
}: checkPermissionProps) { 
  console.log("Checking editing permisison");
  if (owner?.includes(user.id)) {
    //user is the owner, Check for personal Contents
    return true;
  } else {
    //Gruop Content
    const rolesInOrganizations = Object.keys(user.organizationsInRole);
    console.log(rolesInOrganizations);
    const adminProp = 'ADMIN';
    if (owner && user.organizationsInRole[adminProp].includes(owner[0])) {
      // User has admin right for this group
      console.log('user has admin right');
      return true;
    }
    const datamodeleditorProp = 'DATA_MODEL_EDITOR';
    if (
      owner &&
      user.organizationsInRole[datamodeleditorProp].includes(owner[0])
    ) {
      console.log('user has datamodel editor right');
      return true;
    }
  }
  

  return false;
}
