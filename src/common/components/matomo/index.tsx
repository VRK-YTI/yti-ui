import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

declare global {
  interface Window {
    _paq?: string[][];
  }
}

/**
 * Matomo's "push" function. It takes action and optional params and pushes
 * them to matomo's queue.
 *
 * @param args
 */
function matomo(...args: string[]): void {
  if (!window._paq) {
    window._paq = [];
  }

  window._paq.push(args);
}

export interface MatomoProps {
  url: string;
  siteId: string;
}

export function MatomoTracking({ url, siteId }: MatomoProps) {
  const router = useRouter();
  const [previousPath, setPreviousPath] = useState(router.asPath.split('?')[0]);

  useEffect(() => {
    matomo('disableCookies');
    matomo('trackPageView');
    matomo('enableLinkTracking');
    matomo('setTrackerUrl', `${url}/matomo.php`);
    matomo('setSiteId', siteId);
  }, [siteId, url]);

  useEffect(() => {
    const onRouteChangeStart = (path: string) => {
      const pathname = path.split('?')[0];

      if (previousPath !== pathname) {
        if (previousPath) {
          matomo('setReferrerUrl', previousPath);
        }
        matomo('setCustomUrl', pathname);
      }
    };

    router.events.on('routeChangeStart', onRouteChangeStart);
    return () => router.events.off('routeChangeStart', onRouteChangeStart);
  }, [router.events, previousPath]);

  useEffect(() => {
    const onRouteChangeComplete = (path: string) => {
      const pathname = path.split('?')[0];

      if (previousPath !== pathname) {
        setPreviousPath(pathname);
        setTimeout(() => {
          matomo('setDocumentTitle', document.title);
          matomo('trackPageView');
        }, 0);
      }
    };

    router.events.on('routeChangeComplete', onRouteChangeComplete);
    return () =>
      router.events.off('routeChangeComplete', onRouteChangeComplete);
  }, [router.events, previousPath]);

  return <Script src={`${url}/matomo.js`} />;
}

const withEnv = () => {
  // disable this check if you want to use this in development
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  // default values are pointing to development environment
  return (
    <MatomoTracking
      url={process.env.MATOMO_URL ?? 'https://suomi.matomo.cloud'}
      siteId={process.env.MATOMO_SITE_ID ?? '25'}
    />
  );
};

export default withEnv;
