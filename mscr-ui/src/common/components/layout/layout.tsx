import React, {useState} from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from 'yti-common-ui/theme';
import {
  ContentContainer,
  FooterContainer,
  SiteContainer,
  MarginContainer,
} from './layout.styles';
import { useTranslation } from 'next-i18next';
import SmartHeader from '../smart-header';
import { useBreakpoints } from 'yti-common-ui/media-query';
import SkipLink from 'yti-common-ui/skip-link';
import getConfig from 'next/config';
import { FakeableUser } from '../../interfaces/fakeable-user.interface';
import generateFakeableUsers from 'yti-common-ui/utils/generate-impersonate';
import { User } from 'yti-common-ui/interfaces/user.interface';
import MSCRSideBar from '../sidebar/MSCRSideBar';
import { Block } from 'suomifi-ui-components';
import SideNavigationPanel from '../side-navigation';
import Title from 'yti-common-ui/title';
import {SearchContext} from "@app/common/components/search-context-provider";
import SearchScreen from "@app/modules/search-screen";

export default function Layout({
  children,
  feedbackSubject,
  user,
  fakeableUsers,
  matomo,
  alerts,
  fullScreenElements,
}: {
  children: React.ReactNode;
  feedbackSubject?: string;
  user?: User;
  fakeableUsers?: FakeableUser[] | null;
  matomo?: React.ReactNode;
  alerts?: React.ReactNode;
  fullScreenElements?: React.ReactNode;
}) {
  const { t, i18n } = useTranslation('common');
  const { breakpoint } = useBreakpoints();
  const [isSearchActive, setIsSearchActive] = useState(false);


  return (
    <ThemeProvider theme={lightTheme}>
      <SearchContext.Provider
        value={{
          isSearchActive,
          setIsSearchActive
        }}
        >
        {matomo && matomo}
        <SkipLink href="#main">{t('skip-link-main')}</SkipLink>
        {fullScreenElements ? (
          <SiteContainer>
            <SmartHeader
              user={user}
              fakeableUsers={generateFakeableUsers(i18n.language, fakeableUsers)}
              fullScreenElements={fullScreenElements}
            />

            <ContentContainer
              $fullScreen={typeof fullScreenElements !== 'undefined'}
            >
              {children}
            </ContentContainer>
          </SiteContainer>
        ) : (
          <SiteContainer>
            <SmartHeader
              user={user}
              fakeableUsers={generateFakeableUsers(i18n.language, fakeableUsers)}
            />

            <Block>
              <SideNavigationPanel user={user ?? undefined} />
              <ContentContainer>
                {alerts && alerts}
                <MarginContainer $breakpoint={breakpoint}>
                  {isSearchActive && <SearchScreen />}
                  {children}
                </MarginContainer>
              </ContentContainer>
            </Block>
          </SiteContainer>
        )}
      </SearchContext.Provider>

    </ThemeProvider>
  );
}
