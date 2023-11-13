import { renderHook, act } from '@testing-library/react';
import useUrlState, { initialUrlState, isInitial } from './index';
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('useUrlState', () => {
  it('no query parameters is same as initial state', () => {
    mockRouter.setCurrentUrl('/');

    const { result } = renderHook(() => useUrlState());

    expect(result.current.urlState).toStrictEqual(initialUrlState);
  });

  it('isInitial return true for initialState', () => {
    mockRouter.setCurrentUrl({
      pathname: '/',
      query: {
        q: '',
        domain: [],
        organization: '',
        status: [],
        type: 'concept',
        types: [],
        page: '1',
        lang: '',
      },
    });

    const { result } = renderHook(() => useUrlState());

    expect(isInitial(result.current.urlState, 'q')).toBeTruthy();
    expect(isInitial(result.current.urlState, 'domain')).toBeTruthy();
    expect(isInitial(result.current.urlState, 'organization')).toBeTruthy();
    expect(isInitial(result.current.urlState, 'status')).toBeTruthy();
    expect(isInitial(result.current.urlState, 'type')).toBeTruthy();
    expect(isInitial(result.current.urlState, 'page')).toBeTruthy();
    expect(isInitial(result.current.urlState, 'lang')).toBeTruthy();
  });

  it('query parameters are mapped to url state', () => {
    mockRouter.setCurrentUrl({
      pathname: '/',
      query: {
        q: 'q-query-param',
        domain: ['domain-query-param'],
        organization: 'organization-query-param',
        status: ['status-query-param'],
        type: 'type-query-param',
        types: [],
        page: '10',
        lang: 'q-lang-param',
      },
    });

    const { result } = renderHook(() => useUrlState());

    expect(result.current.urlState).toStrictEqual({
      q: 'q-query-param',
      domain: ['domain-query-param'],
      organization: 'organization-query-param',
      status: ['status-query-param'],
      type: 'type-query-param',
      types: [],
      page: 10,
      lang: 'q-lang-param',
    });
  });

  it('in case of non-numerical page, default page number is is used instead', () => {
    mockRouter.setCurrentUrl('/?page=invalid-number');

    const { result } = renderHook(() => useUrlState());

    expect(isInitial(result.current.urlState, 'page')).toBeTruthy();
  });

  it('resetUrlState clears query parameters', async () => {
    mockRouter.setCurrentUrl({
      pathname: '/',
      query: {
        q: 'q-query-param',
        domain: ['domain-query-param'],
        organization: 'organization-query-param',
        status: ['status-query-param'],
        type: 'type-query-param',
        types: [],
        page: '10',
        lang: 'q-lang-param',
      },
    });

    const { result } = renderHook(() => useUrlState());
    act(() => result.current.resetUrlState());

    expect(singletonRouter).toStrictEqual(
      expect.objectContaining({
        query: {
          type: 'type-query-param',
        },
      })
    );
  });

  it('updateUrlState updates given query parameters', () => {
    mockRouter.setCurrentUrl({
      pathname: '/',
      query: {
        q: 'q-query-param',
        domain: ['domain-query-param'],
        organization: 'organization-query-param',
        status: ['status-query-param'],
        type: 'type-query-param',
        types: [],
        page: '10',
        lang: 'q-lang-param',
      },
    });

    const { result } = renderHook(() => useUrlState());
    act(() =>
      result.current.updateUrlState({
        q: 'new-q-query-param',
        domain: ['new-domain-query-param'],
        organization: 'new-organization-query-param',
        status: ['new-status-query-param'],
        type: 'new-type-query-param',
        types: [],
        page: 11,
        lang: 'new-q-lang-param',
      })
    );

    expect(singletonRouter).toStrictEqual(
      expect.objectContaining({
        query: {
          q: 'new-q-query-param',
          domain: ['new-domain-query-param'],
          organization: 'new-organization-query-param',
          status: ['new-status-query-param'],
          type: 'new-type-query-param',
          page: 11,
          lang: 'new-q-lang-param',
        },
      })
    );
  });

  it('patchUrlState updates given query parameters', () => {
    mockRouter.setCurrentUrl({
      pathname: '/',
      query: {
        q: 'q-query-param',
        domain: ['domain-query-param'],
        organization: 'organization-query-param',
        status: ['status-query-param'],
        type: 'type-query-param',
        page: '10',
        lang: 'q-lang-param',
      },
    });

    const { result } = renderHook(() => useUrlState());
    act(() =>
      result.current.patchUrlState({
        q: 'new-q-query-param',
      })
    );

    expect(singletonRouter).toStrictEqual(
      expect.objectContaining({
        query: expect.objectContaining({
          q: 'new-q-query-param',
        }),
      })
    );
  });

  it('patchUrlState does not update other query parameters', () => {
    mockRouter.setCurrentUrl({
      pathname: '/',
      query: {
        q: 'q-query-param',
        domain: ['domain-query-param'],
        organization: 'organization-query-param',
        status: ['status-query-param'],
        type: 'type-query-param',
        page: '10',
        lang: 'q-lang-param',
      },
    });

    const { result } = renderHook(() => useUrlState());
    act(() =>
      result.current.patchUrlState({
        q: 'new-q-query-param',
      })
    );

    expect(singletonRouter).toStrictEqual(
      expect.objectContaining({
        query: expect.objectContaining({
          domain: ['domain-query-param'],
          organization: 'organization-query-param',
          status: ['status-query-param'],
          type: 'type-query-param',
          page: 10,
          lang: 'q-lang-param',
        }),
      })
    );
  });
});
