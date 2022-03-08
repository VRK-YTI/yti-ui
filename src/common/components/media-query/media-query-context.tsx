import React, { useContext } from 'react';
import { useMediaQuery } from '@material-ui/core';

const MediaQueryContext = React.createContext({ isSSRMobile: false });

export const MediaQueryContextProvider = MediaQueryContext.Provider;

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

export function useBreakpoints(): UseBreakpointsResult {
  const { isSSRMobile } = useContext(MediaQueryContext);
  const matchSmall = useMediaQuery(mediaQueries.s);
  const matchMedium = useMediaQuery(mediaQueries.m);
  const matchLarge = useMediaQuery(mediaQueries.l);

  const isSmall = !!global.matchMedia ? matchSmall : isSSRMobile;
  const isMedium = !!global.matchMedia ? matchMedium : false;
  const isLarge = !!global.matchMedia ? matchLarge : !isSSRMobile;

  const breakpoint = isSmall ? 'small' : isMedium ? 'medium' : 'large';

  return {
    isSmall,
    isMedium,
    isLarge,
    breakpoint,
  };
}
