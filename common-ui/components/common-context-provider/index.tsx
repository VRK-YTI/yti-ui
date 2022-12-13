import { createContext } from 'react';

// Note. Undefined is not allowed here so null must be used instead.
export interface CommonContextState {
  isSSRMobile: boolean;
  isMatomoEnabled: boolean;
  matomoUrl: string | null;
  matomoSiteId: string | null;
  user?: object;
  fakeableUsers?: object[];
}

export const initialCommonContextState: CommonContextState = {
  isSSRMobile: false,
  isMatomoEnabled: false,
  matomoUrl: null,
  matomoSiteId: null,
  user: {},
  fakeableUsers: [],
};

export const CommonContext = createContext<CommonContextState>(
  initialCommonContextState
);

export const CommonContextProvider = CommonContext.Provider;
