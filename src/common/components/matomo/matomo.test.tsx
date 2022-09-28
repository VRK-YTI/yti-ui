import React from 'react';
import { render, act } from '@testing-library/react';
import Matomo, { MatomoTracking } from '.';
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';

jest.useFakeTimers();
jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('matomo', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/');
    delete window._paq;
  });

  it('should not render in test when used smart version', () => {
    render(<Matomo />);

    expect(window._paq).toBeUndefined();
  });

  it('should render when used dummy version', () => {
    render(<MatomoTracking url="matamo-test-url" siteId="1234" />);

    expect(window._paq).toBeDefined();
  });

  it('should use cookieless tracking', () => {
    render(<MatomoTracking url="matamo-test-url" siteId="1234" />);

    expect(window._paq?.[0]).toStrictEqual(['disableCookies']);
  });

  it('should use correct url', () => {
    render(<MatomoTracking url="matamo-test-url" siteId="1234" />);

    expect(window._paq?.[3]).toStrictEqual([
      'setTrackerUrl',
      'matamo-test-url/matomo.php',
    ]);
  });

  it('should use correct siteId', () => {
    render(<MatomoTracking url="matamo-test-url" siteId="1234" />);

    expect(window._paq?.[4]).toStrictEqual(['setSiteId', '1234']);
  });

  it('should track initial page view', () => {
    render(<MatomoTracking url="matamo-test-url" siteId="1234" />);

    expect(window._paq?.[1]).toStrictEqual(['trackPageView']);
  });

  it('should track page changes', () => {
    render(<MatomoTracking url="matamo-test-url" siteId="1234" />);
    act(() => {
      singletonRouter.push('/another-page');
      document.title = 'Another Page';
    });

    jest.runAllTimers();

    expect(window._paq?.[7]).toStrictEqual(['setCustomUrl', '/another-page']);
    expect(window._paq?.[9]).toStrictEqual(['trackPageView']);
  });

  it('should log referrer url when page changes', () => {
    render(<MatomoTracking url="matamo-test-url" siteId="1234" />);
    act(() => {
      singletonRouter.push('/another-page');
      document.title = 'Another Page';
    });

    jest.runAllTimers();

    expect(window._paq?.[6]).toStrictEqual(['setReferrerUrl', '/']);
  });

  it('should log new page title when page changes', () => {
    render(<MatomoTracking url="matamo-test-url" siteId="1234" />);
    act(() => {
      singletonRouter.push('/another-page');
      document.title = 'Another Page';
    });

    jest.runAllTimers();

    expect(window._paq?.[8]).toStrictEqual([
      'setDocumentTitle',
      'Another Page',
    ]);
  });

  it('should ignore changes in query parameters', () => {
    render(<MatomoTracking url="matamo-test-url" siteId="1234" />);
    act(() => {
      singletonRouter.push('/?q=qwerty');
    });

    jest.runAllTimers();

    expect(window._paq).toHaveLength(6);
  });
});
