import { setLogin } from './login-slice';
import { makeStore } from '../../../store';

describe('login-slice', () => {
  it('setLogin sets login with a given value', () => {
    const store = makeStore();
    const originalState = store.getState().login;

    const login = {
      anonymous: false,
      email: 'admin@admin.fi',
      firstName: 'Admin',
      lastName: 'Admin',
      id: '',
      superuser: true,
      newlyCreated: false,
      rolesInOrganizations: {},
      organizationsInRole: {},
      enabled: true,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      username: 'Adming',
      authorities: [],
      hasToken: false,
      tokenRole: '',
      containerUri: '',
    };

    store.dispatch(setLogin(login));

    expect(store.getState().login).not.toStrictEqual(originalState);
    expect(store.getState().login).toStrictEqual(login);
  });
});
