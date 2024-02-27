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
          // eslint-disable-next-line jest/no-conditional-in-test
          if (actual.query !== 'test') {
            return false;
          }
          // eslint-disable-next-line jest/no-conditional-in-test
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
      resolvedUrl: `/terminology/${terminologyId}?q=test&status=draft`,
      locale: 'en',
    };

    const results = await terminologyIdGetServerSideProps(ctx);

    expect((results as any).props).toBeDefined(); // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(mock.history.get).toHaveLength(5);

    const polledUrls = [
      '/vocabulary?graphId=1234',
      '/conceptCounts?graphId=1234',
      '/statusCounts?graphId=1234',
      '/authenticated-user',
      '/fakeableUsers',
    ];

    const foundUrls = polledUrls.filter((url) =>
      mock.history.get.some((x) => x.url?.endsWith(url))
    );

    expect(foundUrls).toHaveLength(5);

    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0]?.data).toStrictEqual(
      JSON.stringify({
        highlight: true,
        pageFrom: 0,
        pageSize: 50,
        query: 'test',
        sortDirection: 'ASC',
        sortLanguage: 'en',
        status: ['DRAFT'],
        terminologyId: ['1234'],
      })
    );
  });
});
