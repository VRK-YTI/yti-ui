import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import Matomo, { MatomoTracking } from '.';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('matomo', () => {
  it('should not render in test when used smart version', () => {
    mockedUseRouter.mockReturnValue({
      asPath: '/',
      events: {
        on: jest.fn(),
        off: jest.fn(),
      }
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    render(
      <Matomo />
    );

    expect(window._paq).toBeUndefined();
  });

  it('should render when used dummy version', () => {
    mockedUseRouter.mockReturnValue({
      asPath: '/',
      events: {
        on: jest.fn(),
        off: jest.fn(),
      }
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    render(
      <MatomoTracking url="matamo-test-url" siteId="1234" />
    );

    expect(window._paq).toBeDefined();
  });

  it('should use cookieless tracking', () => {
    mockedUseRouter.mockReturnValue({
      asPath: '/',
      events: {
        on: jest.fn(),
        off: jest.fn(),
      }
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    render(
      <MatomoTracking url="matamo-test-url" siteId="1234" />
    );

    expect(window._paq[0]).toStrictEqual(['disableCookies']);
  });
});
