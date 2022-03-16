import { createMocks } from 'node-mocks-http';
import fakeLogin from '../pages/api/auth/fake-login';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const fakeUser = {
  anonymous: false,
  email: 'admin@test.invalid',
  firstName: 'testAdminFirstName',
  lastName: 'testAdminLastname',
  id: 'test-id',
  superuser: true,
  newlyCreated: false,
  rolesInOrganizations: { 'test-organization-id': ['ADMIN'] },
  organizationsInRole: { ADMIN: ['test-organization-id'] },
  enabled: true,
  username: 'admin@test.invalid',
  authorities: [{ authority: 'ROLE_ADMIN' }, { authority: 'ROLE_USER' }],
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
};

describe('api endpoint - fake login', () => {
  const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });

  afterEach(() => {
    mock.reset();
  });

  /*
   * Simulate successful call to fake-login, returning the proper cookies to
   * the browser
   */
  it('successful login', async () => {
    const targetPath = '/testable-target-path';

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        target: targetPath,
      },
    });

    mock
      .onGet(
        'http://terminology-api.invalid/terminology-api/api/v1/frontend/authenticated-user?fake.login.mail=admin%40localhost'
      )
      .reply(200, fakeUser, { 'set-cookie': ['JSESSIONID=foo'] });
    /*
    mock
      .onGet('http://test.invalid/api/v1/frontend/authenticated-user')
      .reply(200, fakeUser);
    */

    await fakeLogin(req, res);

    // if successful, the api route will set some cookies for the browser
    expect(res.hasHeader('Set-Cookie')).toBeTruthy();
    const setCookies = res.getHeader('Set-Cookie');
    expect(setCookies).toHaveLength(2);

    // JSESSIONID from spring API
    const jsessionid = setCookies.find((x: string) =>
      x.startsWith('JSESSIONID=')
    );
    expect(jsessionid).toBeDefined();
    expect(jsessionid).toBe('JSESSIONID=foo');

    // session cookie from next-iron-session
    const session = setCookies.find((x: string) =>
      x.startsWith('user-session-cookie=')
    );
    expect(session).toBeDefined();

    // api route should redirect in the end
    expect(res._getStatusCode()).toBe(302);
    expect(res._getRedirectUrl()).toBe(targetPath);
  });

  /*
   * Simulate server failing - should still return back to the browser
   */
  it('server failure', async () => {
    const targetPath = '/testable-target-path';

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        target: targetPath,
      },
    });

    mock
      .onGet(
        'http://terminology-api.invalid/terminology-api/api/v1/frontend/authenticated-user?fake.login.mail=admin%40localhost'
      )
      .reply(500, { error: 'An error occurred' });

    await fakeLogin(req, res);

    // if successful, the api route will set some cookies for the browser
    expect(res.hasHeader('Set-Cookie')).toBeFalsy();

    // api route should redirect in the end
    expect(res._getStatusCode()).toBe(302);
    expect(res._getRedirectUrl()).toBe(targetPath);
  });

  /*
   * Simulate login failure due to insufficient access
   */
  it.todo('no access');
});
