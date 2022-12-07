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
// import Alerts from '@app/common/components/alert';
// import Matomo from '@app/common/components/matomo';
import getConfig from 'next/config';

export default function Layout({
  children,
  feedbackSubject,
}: {
  children: React.ReactNode;
  feedbackSubject?: string;
}) {
  const { t } = useTranslation('common');
  const { breakpoint } = useBreakpoints();
  const { publicRuntimeConfig } = getConfig();

  return (
    <ThemeProvider theme={lightTheme}>
      {/* <Matomo /> */}

      <Head>
        <meta name="description" content="Terminology/React POC" />
        <meta name="og:title" content={t('terminology')} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <SkipLink href="#main">{t('skip-link-main')}</SkipLink>

      <SiteContainer>
        <SmartHeader />

        <ContentContainer>
          {/* <Alerts /> */}
          <MarginContainer $breakpoint={breakpoint}>{children}</MarginContainer>
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
    </ThemeProvider>
  );
}
