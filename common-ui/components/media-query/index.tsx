import { useContext, useSyncExternalStore } from 'react';
import { CommonContext } from '../common-context-provider';

export const mediaQueries = {
  s: '(max-width:767px)',
  m: '(min-width:768px) and (max-width:1199px)',
  l: '(min-width:1200px)',
};

/*
  For more breakpoints:

  xs: '(max-width:575px)',
  s: '(min-width:576) and (max-width:767px)',
  m: '(min-width:768px) and (max-width:991px)',
  l: '(min-width:992px) and (max-width:1199px)',
  xl: '(min-width:1200px)'
*/

export type Breakpoint = 'small' | 'medium' | 'large';

export interface UseBreakpointsResult {
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  breakpoint: Breakpoint;
}

function useMediaQuery(query: string, serverSnapshot = false): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () => window.matchMedia(query).matches,
    () => serverSnapshot
  );
}

export function useBreakpoints(): UseBreakpointsResult {
  const { isSSRMobile } = useContext(CommonContext);

  const isSmall = useMediaQuery(mediaQueries.s, isSSRMobile);
  const isMedium = useMediaQuery(mediaQueries.m, false);
  const isLarge = useMediaQuery(mediaQueries.l, !isSSRMobile);

  const breakpoint = isSmall ? 'small' : isMedium ? 'medium' : 'large';

  return { isSmall, isMedium, isLarge, breakpoint };
}
