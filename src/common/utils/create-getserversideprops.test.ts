import { GetServerSidePropsContext } from 'next';
import { applySession } from 'next-iron-session';
import httpMocks from 'node-mocks-http';
import { anonymousUser } from '../interfaces/user-interface';
import { createCommonGetServerSideProps, LocalHandlerParams } from './create-getserversideprops';
import { userCookieOptions } from './user-cookie-options';

describe('createCommonGetServersideProps', () => {
  test('should wrap defaults', async () => {

    const ctx: GetServerSidePropsContext = {
      req: httpMocks.createRequest({ headers: { 'foo': 'bar' } }),
      res: httpMocks.createResponse(),
      query: { },
      resolvedUrl: '',
      locale: 'en'
    };

    const getServerSideProps = createCommonGetServerSideProps<{ props: { local_test_prop: string } }>(
      async ({ req, res, locale }: LocalHandlerParams) => {
        return {
          props: {
            'local_test_prop': 'local_test_value'
          }
        };
      });

    const results = await getServerSideProps(ctx);

    expect(results.props).toBeDefined();

    // serverSideTranslations() should have added this
    expect(results.props._nextI18Next).toBeDefined();
    expect(results.props._nextI18Next).toBeTruthy();

    // withSession combined with common code should add user info from session
    expect(results.props.user).toBeDefined();
    expect(results.props.user.anonymous).toBeTruthy();

    // locally provided function should be able to add props
    expect(results.props.local_test_prop).toBeDefined();
    expect(results.props.local_test_prop).toBe('local_test_value');
  });

  test('should wrap authenticated user', async () => {
    const ctx: GetServerSidePropsContext = {
      req: httpMocks.createRequest({ headers: { 'foo': 'bar' } }),
      res: httpMocks.createResponse(),
      query: { },
      resolvedUrl: '',
      locale: 'en'
    };

    const getServerSideProps = createCommonGetServerSideProps(
      async ({ req, res, locale }: LocalHandlerParams) => {

        await applySession(req, res, userCookieOptions);
        req.session.set('user', {
          ...anonymousUser,
          anonymous: false,
          email: 'unittest@invalid'
        });
        req.session.set('cookies', { 'foo': 'bar' });
        await req.session.save();

        return { props: { } };
      });

    const results = await getServerSideProps(ctx);

    expect(results.props).toBeDefined();

    // serverSideTranslations() should have added this
    expect(results.props._nextI18Next).toBeDefined();
    expect(results.props._nextI18Next).toBeTruthy();

    // withSession combined with common code should add user info from session
    expect(results.props.user).toBeDefined();
    expect(results.props.user.anonymous).toBeFalsy();
    expect(results.props.user.email).toBe('unittest@invalid');
  });
});
