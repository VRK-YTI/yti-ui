import { GetServerSidePropsContext } from 'next';
import httpMocks from 'node-mocks-http';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { getServerSideProps as terminologyIdGetServerSideProps } from '@app/pages/terminology/[terminologyId]';

describe('terminologyId page', () => {
  let mock: MockAdapter;

  it('should create redux state with requests', async () => {
    const terminologyId = '1234';

    mock = new MockAdapter(axios, { onNoMatch: 'throwException' });
    mock
      .onGet(/\/v1\/frontend\/vocabulary\?graphId=\d+/)
      .reply((config) => [200, 'response from vocabulary']);
    mock
      .onGet(/.*\/v1\/frontend\/collections\?graphId=\d+/)
      .reply((config) => [200, 'response from collections']);
    mock
      .onPost(/.*\/v1\/frontend\/searchConcept$/, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        asymmetricMatch: (actual: any) => {
          // these checks ensure that the API request was made with the
          // expected query parameters
          if (actual.query !== 'test') {
            return false;
          }
          if (JSON.stringify(actual.status) !== JSON.stringify(['DRAFT'])) {
            return false;
          }
          return true;
        },
      })
      .reply((config) => [200, 'response from searchConcept']);

    const ctx: GetServerSidePropsContext = {
      req: httpMocks.createRequest(),
      res: httpMocks.createResponse(),
      query: { q: 'test', status: ['draft'] },
      params: { terminologyId: terminologyId },
      resolvedUrl: '',
      locale: 'en',
    };

    const results = await terminologyIdGetServerSideProps(ctx);

    expect(results.props).toBeDefined();
    expect((results.props as any).initialState).toBeDefined(); // eslint-disable-line @typescript-eslint/no-explicit-any
    const initialState = (results.props as any).initialState; // eslint-disable-line @typescript-eslint/no-explicit-any

    // check that each of the mock responses are found
    const data = Object.keys(initialState.vocabularyAPI.queries).map(
      (x) => initialState.vocabularyAPI.queries[x].data
    );
    expect(data).toHaveLength(3);
    expect(data).toContain('response from vocabulary');
    expect(data).toContain('response from collections');
    expect(data).toContain('response from searchConcept');

    // check that all requests finished successfully
    const statuses = Object.keys(initialState.vocabularyAPI.queries)
      .map((x) => initialState.vocabularyAPI.queries[x].status)
      .filter((x) => x === 'fulfilled');
    expect(statuses).toHaveLength(3);
  });
});
