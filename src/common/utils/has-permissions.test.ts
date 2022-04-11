import { User } from '@app/common/interfaces/user.interface';
import hasPermission from './has-permission';

const createMockUser = (
  rolesInOrganizations: {
    [key: string]: string[];
  },
  organizationsInRole: {
    [key: string]: string[];
  }
): User => ({
  anonymous: false,
  email: 'admin@admin.fi',
  firstName: 'Admin',
  lastName: 'Admin',
  id: '',
  superuser: true,
  newlyCreated: false,
  rolesInOrganizations: rolesInOrganizations,
  organizationsInRole: organizationsInRole,
  enabled: true,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  username: 'Admin',
  authorities: [],
  hasToken: false,
  tokenRole: '',
  containerUri: '',
});

describe('has-permission', () => {
  it('should have admin rights with no target organization defined', () => {
    const user = createMockUser(
      { foo: ['ADMIN'] },
      { ADMIN: ['foo'] }
    );

    const rights = hasPermission({user: user, actions: 'CREATE_TERMINOLOGY'});
    expect(rights).toBe(true);
  });

  it('should have rights with no target organization defined', () => {
    const user = createMockUser(
      { foo: ['TERMINOLOGY_EDITOR', 'SOME_OTHER_ROLES'] },
      { TERMINOLOGY_EDITOR: ['foo'], SOME_OTHER_ROLES: ['foo'] }
    );

    const rights = hasPermission({user: user, actions: 'CREATE_TERMINOLOGY'});
    expect(rights).toBe(true);
  });

  it('should not have rights with no target organization defined', () => {
    const user = createMockUser(
      { foo: ['SOME_OTHER_ROLES'] },
      { SOME_OTHER_ROLES: ['foo'] }
    );

    const rights = hasPermission({user: user, actions: 'CREATE_TERMINOLOGY'});
    expect(rights).toBe(false);
  });

  it('should have admin rights with target organization defined', () => {
    const user = createMockUser(
      { foo: ['ADMIN'] },
      { ADMIN: ['foo'] }
    );

    const rights = hasPermission({user: user, actions: 'CREATE_TERMINOLOGY', targetOrganization: 'foo'});
    expect(rights).toBe(true);
  });

  it('should have rights with target organization defined', () => {
    const user = createMockUser(
      { foo: ['TERMINOLOGY_EDITOR', 'SOME_OTHER_ROLES'] },
      { TERMINOLOGY_EDITOR: ['foo'], SOME_OTHER_ROLES: ['foo'] }
    );

    const rights = hasPermission({user: user, actions: 'CREATE_TERMINOLOGY', targetOrganization: 'foo'});
    expect(rights).toBe(true);
  });

  it('should not have rights with target organization defined', () => {
    const user = createMockUser(
      { foo: ['SOME_OTHER_ROLES'], x: ['TERMINOLOGY_EDITOR', 'ADMIN'] },
      { ADMIN: ['x'], SOME_OTHER_ROLES: ['foo'], TERMINOLOGY_EDITOR: ['x'] }
    );

    const rights = hasPermission({user: user, actions: 'CREATE_TERMINOLOGY', targetOrganization: 'foo'});
    expect(rights).toBe(false);
  });

  it('should have rights with multiple actions defined', () => {
    const user = createMockUser(
      { foo: ['TERMINOLOGY_EDITOR', 'SOME_OTHER_ROLES'] },
      { TERMINOLOGY_EDITOR: ['foo'], SOME_OTHER_ROLES: ['foo'] }
    );

    const rights = hasPermission({user: user, actions: ['CREATE_TERMINOLOGY', 'EDIT_TERMINOLOGY'], targetOrganization: 'foo'});
    expect(rights).toBe(true);
  });

  it('should not have rights with multiple actions defined', () => {
    const user = createMockUser(
      { foo: ['SOME_OTHER_ROLES'], x: ['TERMINOLOGY_EDITOR', 'ADMIN'] },
      { ADMIN: ['x'], SOME_OTHER_ROLES: ['foo'], TERMINOLOGY_EDITOR: ['x'] }
    );

    const rights = hasPermission({user: user, actions: ['CREATE_TERMINOLOGY', 'EDIT_TERMINOLOGY'], targetOrganization: 'foo'});
    expect(rights).toBe(false);
  });

});
