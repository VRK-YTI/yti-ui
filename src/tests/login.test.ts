import { createMocks } from 'node-mocks-http';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import login from '../pages/api/auth/login';
import callback from '../pages/api/auth/callback';

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

describe('api endpoint - login', () => {
  const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });

  function setupMock() {
    mock.reset();
  }

  /*
   * login endpoint should simply redirect to SSO
   */
  it('redirect to SSO', async () => {
    setupMock();
    const targetPath = '/testable-target-path';

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        target: targetPath,
      },
    });

    await login(req, res);

    // api route should redirect in the end
    expect(res._getStatusCode()).toBe(302);

    let redirectPath = '/api/auth/callback?target=' + targetPath;
    redirectPath = `/Shibboleth.sso/Login?target=${encodeURIComponent(
      redirectPath
    )}`;
    expect(res._getRedirectUrl()).toBe(redirectPath);
  });

  it('callback on success', async () => {
    setupMock();
    const targetPath = '/testable-target-path';

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        target: targetPath,
      },
      headers: {
        Host: 'terminology-ui.invalid',
        'X-Forwarded-For': '127.0.0.42',
      },
      cookies: {
        _shibsession_123: 'foo',
      },
    });

    mock
      .onGet(
        'http://auth-proxy.invalid/terminology-api/api/v1/frontend/authenticated-user'
      )
      .reply(200, fakeUser, { 'set-cookie': ['JSESSIONID=foo'] });

    await callback(req, res);

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
});
