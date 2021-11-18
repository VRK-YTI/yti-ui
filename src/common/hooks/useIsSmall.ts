import { useMediaQuery } from '@material-ui/core';

/**
 * Check whether it is in mobile or desktop view.
 *
 * In client: return the result of media query.
 * In SSR: return the given isSSRMobile as media query doesn't work.
 */
export default function useIsSmall(
  isSSRMobile: boolean,
  mediaQuery: string = '(max-width:945px)'
): boolean {
  const isSmall = useMediaQuery(mediaQuery);
  return typeof window !== 'undefined' ? isSmall : isSSRMobile;
}
