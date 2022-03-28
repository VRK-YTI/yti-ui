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
import Footer from '@app/common/components/footer/footer';
import SmartHeader from '@app/modules/smart-header';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import SkipLink from '@app/common/components/skip-link/skip-link';
import { Alerts } from '@app/common/components/alert';

export default function Layout({
  children,
  feedbackSubject,
}: {
  children: React.ReactNode;
  feedbackSubject?: string;
}) {
  const { t } = useTranslation('common');
  const { breakpoint } = useBreakpoints();

  return (
    <ThemeProvider theme={lightTheme}>
      <Head>
        <meta name="description" content="Terminology/React POC" />
        <meta name="og:title" content={t('terminology')} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <SkipLink href="#main">{t('skip-link-main')}</SkipLink>

      <SiteContainer>
        <SmartHeader />

        <ContentContainer>
          <Alerts />
          <MarginContainer breakpoint={breakpoint}>{children}</MarginContainer>
        </ContentContainer>

        <FooterContainer>
          <MarginContainer breakpoint={breakpoint}>
            <Footer feedbackSubject={feedbackSubject} />
          </MarginContainer>
        </FooterContainer>
      </SiteContainer>
    </ThemeProvider>
  );
}
