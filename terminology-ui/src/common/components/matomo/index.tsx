import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { CommonContext } from '../common-context-provider';

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
    matomo('enableJSErrorTracking');
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

const WithEnv = () => {
  const { isMatomoEnabled, matomoUrl, matomoSiteId } =
    useContext(CommonContext);

  // disable if any of required variables are missing
  if (!isMatomoEnabled || !matomoUrl || !matomoSiteId) {
    return null;
  }

  return <MatomoTracking url={matomoUrl} siteId={matomoSiteId} />;
};

export default WithEnv;
