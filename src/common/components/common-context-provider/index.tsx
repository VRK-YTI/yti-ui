import { createContext } from 'react';

// Note. Undefined is not allowed here so null must be used instead.
export interface CommonContextInterface {
  isSSRMobile: boolean;
  isMatomoEnabled: boolean;
  matomoUrl: string | null;
  matomoSiteId: string | null;
}

export const defaultCommonContextValue: CommonContextInterface = {
  isSSRMobile: false,
  isMatomoEnabled: false,
  matomoUrl: null,
  matomoSiteId: null,
};

export const CommonContext = createContext<CommonContextInterface>(
  defaultCommonContextValue
);

export const CommonContextProvider = CommonContext.Provider;
