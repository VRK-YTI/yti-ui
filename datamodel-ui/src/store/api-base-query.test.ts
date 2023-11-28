import { GetServerSidePropsContext } from 'next';
import httpMocks from 'node-mocks-http';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import {
  getServiceCategories,
  getRunningQueriesThunk,
} from '@app/common/components/service-categories/service-categories.slice';

describe('axios base query', () => {
  const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });

  afterEach(() => {
    mock.reset();
  });

  // this test simulates a SSR situation and checks that if a JSESSIONID was
  // stored in session, it is passed onto API calls or authorization purposes
  it('should pass JSESSIONID in cookie', async () => {
    const jsessionidValue = 'foo';

    const ctx: GetServerSidePropsContext = {
      req: httpMocks.createRequest({ headers: { foo: 'bar' } }),
      res: httpMocks.createResponse(),
      query: {},
      resolvedUrl: '/',
      locale: 'en',
    };

    // any API call would be fine here
    mock.onGet(/\/v2\/frontend\/service-categories/).reply((config) => {
      return [
        200,
        'JSESSIONID exists in headers: ' +
          // eslint-disable-next-line jest/no-conditional-in-test
          (config.headers?.['Cookie'] === `JSESSIONID=${jsessionidValue}`
            ? 'yes'
            : 'no'),
      ];
    });

    const getServerSideProps = createCommonGetServerSideProps<{
      props: { data: string };
    }>(async ({ store, req }: LocalHandlerParams) => {
      // store JSESSIONID in session so we can check later it's propagated to
      // the API request as a cookie
      const cookies: { [key: string]: string } = { JSESSIONID: 'foo' };
      req.session.cookies = cookies;
      req.session.save();

      // initiate API call
      store.dispatch(getServiceCategories.initiate('fi'));
      await Promise.all(store.dispatch(getRunningQueriesThunk()));

      // get the result from the API call
      const data = store.getState().serviceCategoriesApi.queries[
        'getServiceCategories("fi")'
      ]?.data as string;

      return {
        props: {
          data: data,
        },
      };
    });

    const results = await getServerSideProps(ctx);

    // if the API call was made with the proper cookie, it should return this:
    expect(results.props.data).toBe('JSESSIONID exists in headers: yes');
  });
});
