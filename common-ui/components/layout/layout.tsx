import Head from 'next/head';
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
  fullScreen,
}: {
  children: React.ReactNode;
  feedbackSubject?: string;
  user?: User;
  fakeableUsers?: FakeableUser[] | null;
  matomo?: React.ReactNode;
  alerts?: React.ReactNode;
  fullScreen?: boolean;
}) {
  const { t, i18n } = useTranslation('common');
  const { breakpoint } = useBreakpoints();
  const { publicRuntimeConfig } = getConfig();

  return (
    <ThemeProvider theme={lightTheme}>
      {matomo && matomo}

      <Head>
        <meta name="description" content="Terminology/React POC" />
        <meta name="og:title" content={t('terminology')} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <SkipLink href="#main">{t('skip-link-main')}</SkipLink>
      {fullScreen ? (
        <SiteContainer>
          <ContentContainer $fullScreen={fullScreen}>
            {children}
          </ContentContainer>
        </SiteContainer>
      ) : (
        <SiteContainer>
          <SmartHeader
            user={user}
            fakeableUsers={generateFakeableUsers(i18n.language, fakeableUsers)}
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
