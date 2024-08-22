import { createRequest, createResponse } from 'node-mocks-http';
import fakeLogin from '@app/pages/api/auth/fake-login';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { ApiRequest, ApiResponse, getHeader } from './test-utils';

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

    const req = createRequest<ApiRequest>({
      method: 'GET',
      query: {
        target: targetPath,
      },
    });
    const res = createResponse<ApiResponse>();

    mock
      .onGet(
        'http://terminology-api.invalid/terminology-api/v2/user?fake.login.mail=admin%40localhost'
      )
      .reply(200, fakeUser, { 'set-cookie': ['JSESSIONID=foo'] });

    await fakeLogin(req, res);

    // if successful, the api route will set some cookies for the browser
    expect(res.hasHeader('Set-Cookie')).toBeTruthy();
    // eslint-disable-next-line jest/no-conditional-in-test
    const setCookies = getHeader(res.getHeader('Set-Cookie'));
    expect(setCookies).toHaveLength(2);

    // JSESSIONID from spring API
    const jsessionid = setCookies?.find((x: string) =>
      x.startsWith('JSESSIONID=')
    );
    expect(jsessionid).toBeDefined();
    expect(jsessionid).toBe('JSESSIONID=foo');

    // session cookie from next-iron-session
    const session = setCookies?.find((x: string) =>
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

    mock
      .onGet(
        'http://terminology-api.invalid/terminology-api/v2/user?fake.login.mail=admin%40localhost'
      )
      .reply(500, { error: 'An error occurred' });

    const req = createRequest<ApiRequest>({
      method: 'GET',
      query: {
        target: targetPath,
      },
    });
    const res = createResponse<ApiResponse>();

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
