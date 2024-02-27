import React from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme';
import {
  ContentContainer,
  FooterContainer,
  SiteContainer,
  MarginContainer,
} from './layout.styles';
import { useTranslation } from 'next-i18next';
import Footer from '../footer';
import SmartHeader from '../smart-header';
import { useBreakpoints } from '../media-query';
import SkipLink from '../skip-link';
import getConfig from 'next/config';
import { FakeableUser } from '../../interfaces/fakeable-user.interface';
import generateFakeableUsers from '../../utils/generate-impersonate';
import { User } from '../../interfaces/user.interface';

export default function Layout({
  children,
  feedbackSubject,
  user,
  fakeableUsers,
  matomo,
  alerts,
  fullScreenElements,
  headerHidden,
  langPickerHidden,
  hideSv,
}: {
  children: React.ReactNode;
  feedbackSubject?: string;
  user?: User;
  fakeableUsers?: FakeableUser[] | null;
  matomo?: React.ReactNode;
  alerts?: React.ReactNode;
  fullScreenElements?: React.ReactNode;
  headerHidden?: boolean;
  langPickerHidden?: boolean;
  hideSv?: boolean;
}) {
  const { t, i18n } = useTranslation('common');
  const { breakpoint } = useBreakpoints();
  const { publicRuntimeConfig } = getConfig();

  if (headerHidden) {
    return (
      <ThemeProvider theme={lightTheme}>
        {matomo && matomo}
        <div style={{ minWidth: '100vw', minHeight: '100vh' }}>{children}</div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={lightTheme}>
      {matomo && matomo}

      <SkipLink href="#main">{t('skip-link-main')}</SkipLink>
      {fullScreenElements ? (
        <SiteContainer>
          <SmartHeader
            user={user}
            fakeableUsers={generateFakeableUsers(i18n.language, fakeableUsers)}
            fullScreenElements={fullScreenElements}
            langPickerHidden={langPickerHidden}
            hideSv={hideSv}
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
            hideSv={hideSv}
          />

          <ContentContainer>
            {alerts && alerts}
            <MarginContainer $breakpoint={breakpoint}>
              {children}
            </MarginContainer>
          </ContentContainer>

          <FooterContainer>
            <MarginContainer $breakpoint={breakpoint}>
              <Footer
                t={t}
                feedbackSubject={feedbackSubject}
                versionInfo={publicRuntimeConfig?.versionInfo}
              />
            </MarginContainer>
          </FooterContainer>
        </SiteContainer>
      )}
    </ThemeProvider>
  );
}
