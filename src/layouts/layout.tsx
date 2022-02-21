import Head from 'next/head';
import React from 'react';
import { Block } from 'suomifi-ui-components';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme';
import {
  ContentContainer,
  FooterContainer,
  SiteContainer,
  MarginContainer,
} from './layout.styles';
import { useTranslation } from 'next-i18next';
import Footer from '../common/components/footer/footer';
import SmartHeader from '../modules/smart-header';
import { useBreakpoints } from '../common/components/media-query/media-query-context';
import SkipLink from '../common/components/skip-link/skip-link';

export default function Layout({
  children,
  feedbackSubject,
}: {
  children: any;
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

      <SkipLink href="#main">
        {t('skip-link-main')}
      </SkipLink>

      <SiteContainer>
        <SmartHeader />

        <ContentContainer>
          <MarginContainer breakpoint={breakpoint}>
            <Block variant="main" id="main">
              {children}
            </Block>
          </MarginContainer>
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
