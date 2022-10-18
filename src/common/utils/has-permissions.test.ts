import { User } from '@app/common/interfaces/user.interface';
import { checkPermission } from './has-permission';

const createMockUser = (
  rolesInOrganizations: {
    [key: string]: string[];
  },
  organizationsInRole: {
    [key: string]: string[];
  },
  superuser?: boolean
): User => ({
  anonymous: false,
  email: 'admin@admin.fi',
  firstName: 'Admin',
  lastName: 'Admin',
  id: '',
  superuser: superuser ? true : false,
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
    const user = createMockUser({ foo: ['ADMIN'] }, { ADMIN: ['foo'] });

    const rights = checkPermission({
      user: user,
      actions: ['CREATE_TERMINOLOGY'],
    });
    expect(rights).toBe(true);
  });

  it('should have rights with no target organization defined', () => {
    const user = createMockUser(
      { foo: ['TERMINOLOGY_EDITOR', 'SOME_OTHER_ROLES'] },
      { TERMINOLOGY_EDITOR: ['foo'], SOME_OTHER_ROLES: ['foo'] }
    );

    const rights = checkPermission({
      user: user,
      actions: ['CREATE_TERMINOLOGY'],
    });
    expect(rights).toBe(true);
  });

  it('should not have rights with no target organization defined', () => {
    const user = createMockUser(
      { foo: ['SOME_OTHER_ROLES'] },
      { SOME_OTHER_ROLES: ['foo'] }
    );

    const rights = checkPermission({
      user: user,
      actions: ['CREATE_TERMINOLOGY'],
    });
    expect(rights).toBe(false);
  });

  it('should have admin rights with target organization defined', () => {
    const user = createMockUser({ foo: ['ADMIN'] }, { ADMIN: ['foo'] });

    const rights = checkPermission({
      user: user,
      actions: ['CREATE_TERMINOLOGY'],
      targetOrganizations: ['foo'],
    });
    expect(rights).toBe(true);
  });

  it('should have rights with target organization defined', () => {
    const user = createMockUser(
      { foo: ['TERMINOLOGY_EDITOR', 'SOME_OTHER_ROLES'] },
      { TERMINOLOGY_EDITOR: ['foo'], SOME_OTHER_ROLES: ['foo'] }
    );

    const rights = checkPermission({
      user: user,
      actions: ['CREATE_TERMINOLOGY'],
      targetOrganizations: ['foo'],
    });
    expect(rights).toBe(true);
  });

  it('should not have rights with target organization defined', () => {
    const user = createMockUser(
      { foo: ['SOME_OTHER_ROLES'], x: ['TERMINOLOGY_EDITOR', 'ADMIN'] },
      { ADMIN: ['x'], SOME_OTHER_ROLES: ['foo'], TERMINOLOGY_EDITOR: ['x'] }
    );

    const rights = checkPermission({
      user: user,
      actions: ['CREATE_TERMINOLOGY'],
      targetOrganizations: ['foo'],
    });
    expect(rights).toBe(false);
  });

  it('should have rights with multiple actions defined', () => {
    const user = createMockUser(
      { foo: ['TERMINOLOGY_EDITOR', 'SOME_OTHER_ROLES'] },
      { TERMINOLOGY_EDITOR: ['foo'], SOME_OTHER_ROLES: ['foo'] }
    );

    const rights = checkPermission({
      user: user,
      actions: ['CREATE_TERMINOLOGY', 'EDIT_TERMINOLOGY'],
      targetOrganizations: ['foo'],
    });
    expect(rights).toBe(true);
  });

  it('should not have rights with multiple actions defined', () => {
    const user = createMockUser(
      { foo: ['SOME_OTHER_ROLES'], x: ['TERMINOLOGY_EDITOR', 'ADMIN'] },
      { ADMIN: ['x'], SOME_OTHER_ROLES: ['foo'], TERMINOLOGY_EDITOR: ['x'] }
    );

    const rights = checkPermission({
      user: user,
      actions: ['CREATE_TERMINOLOGY', 'EDIT_TERMINOLOGY'],
      targetOrganizations: ['foo'],
    });
    expect(rights).toBe(false);
  });

  it('should not have rights when rolesInOrganizations and organizationsInRole are undefined', () => {
    const user = createMockUser({}, {});

    const rights = checkPermission({
      user: user,
      actions: ['CREATE_TERMINOLOGY'],
    });

    expect(rights).toBe(false);
  });

  it('should have superuser rights', () => {
    const user = createMockUser({}, {}, true);

    const rights = checkPermission({
      user: user,
      actions: ['CREATE_TERMINOLOGY', 'EDIT_TERMINOLOGY', 'DELETE_TERMINOLOGY'],
      targetOrganizations: ['foo'],
    });

    expect(rights).toBe(true);
  });

  it('should have rights to edit concept', () => {
    const user = createMockUser(
      { foo: ['TERMINOLOGY_EDITOR'] },
      { TERMINOLOGY_EDITOR: ['foo'] }
    );

    const rights = checkPermission({
      user: user,
      actions: ['EDIT_CONCEPT'],
      targetOrganizations: ['foo'],
    });

    expect(rights).toBe(true);
  });

  it('should have rights to edit collection', () => {
    const user = createMockUser(
      { foo: ['TERMINOLOGY_EDITOR'] },
      { TERMINOLOGY_EDITOR: ['foo'] }
    );

    const rights = checkPermission({
      user: user,
      actions: ['EDIT_COLLECTION'],
      targetOrganizations: ['foo'],
    });

    expect(rights).toBe(true);
  });

  it('should have rights with multiple target organizations defined', () => {
    const editorUser = createMockUser(
      { foo: ['TERMINOLOGY_EDITOR'], temp: ['SOME_OTHER_ROLES'] },
      { TERMINOLOGY_EDITOR: ['foo'], SOME_OTHER_ROLES: ['temp'] }
    );

    const adminUser = createMockUser(
      { foo: ['TERMINOLOGY_EDITOR'], temp: ['ADMIN'] },
      { TERMINOLOGY_EDITOR: ['foo'], ADMIN: ['temp'] }
    );

    const editorRights = checkPermission({
      user: editorUser,
      actions: ['EDIT_COLLECTION'],
      targetOrganizations: ['foo', 'temp'],
    });

    const adminRights = checkPermission({
      user: adminUser,
      actions: ['EDIT_COLLECTION'],
      targetOrganizations: ['foo', 'temp'],
    });

    expect(editorRights).toBe(true);
    expect(adminRights).toBe(true);
  });

  it('should not have rights with multiple target organizations defined', () => {
    const user = createMockUser(
      { foo: ['RANDOM_ROLE'], temp: ['SOME_OTHER_ROLES'] },
      { RANDOM_ROLE: ['foo'], SOME_OTHER_ROLES: ['temp'] }
    );

    const rights = checkPermission({
      user: user,
      actions: ['EDIT_COLLECTION'],
      targetOrganizations: ['foo', 'temp'],
    });

    expect(rights).toBe(false);
  });

  it('should not have rights to delete a concept from a different organization', () => {
    const user = createMockUser(
      { foo: ['TERMINOLOGY_EDITOR'] },
      { TERMINOLOGY_EDITOR: ['temp'] }
    );

    const rights = checkPermission({
      user: user,
      actions: ['DELETE_CONCEPT'],
      targetOrganizations: ['temp'],
    });

    expect(rights).toBe(false);
  });
});
