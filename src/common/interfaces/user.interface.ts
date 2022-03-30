export interface User {
  anonymous: boolean;
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  superuser: boolean;
  newlyCreated: boolean;
  rolesInOrganizations: { [key: string]: string[] };
  organizationsInRole: object;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  username: string;
  authorities: Array<object>;
  hasToken: boolean;
  tokenRole: string;
  containerUri: string;
}

export const anonymousUser: User = {
  anonymous: true,
  email: '',
  firstName: '',
  lastName: '',
  id: '',
  superuser: false,
  newlyCreated: false,
  rolesInOrganizations: {},
  organizationsInRole: {},
  enabled: true,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  username: '',
  authorities: [],
  hasToken: false,
  tokenRole: '',
  containerUri: '',
};

export type UserProps = {
  user: User;
  cookies: { [key: string]: string } | null;
};
