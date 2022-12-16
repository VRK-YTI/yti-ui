import { useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
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

export function useBreakpoints(): UseBreakpointsResult {
  const { isSSRMobile } = useContext(CommonContext);
  const [matchSmall, setMatchSmall] = useState<boolean>(false);
  const [matchMedium, setMatchMedium] = useState<boolean>(false);
  const [matchLarge, setMatchLarge] = useState<boolean>(true);

  const s = useMediaQuery(mediaQueries.s);
  const m = useMediaQuery(mediaQueries.m);
  const l = useMediaQuery(mediaQueries.l);

  useEffect(() => {
    setMatchSmall(s);
    setMatchMedium(m);
    setMatchLarge(l);
  }, [s, m, l]);

  const isSmall = global['matchMedia'] ? matchSmall : isSSRMobile;
  const isMedium = global['matchMedia'] ? matchMedium : false;
  const isLarge = global['matchMedia'] ? matchLarge : !isSSRMobile;

  const breakpoint = isSmall ? 'small' : isMedium ? 'medium' : 'large';

  return {
    isSmall,
    isMedium,
    isLarge,
    breakpoint,
  };
}
