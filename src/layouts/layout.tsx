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
import User from '../common/interfaces/user-interface';
import Footer from '../common/components/footer/footer';
import BreadcrumbWrapper from '../common/components/breadcrumb/breadcrumb';
import SmartHeader from '../modules/smart-header';
import { Breakpoint, useBreakpoints } from '../common/components/media-query/media-query-context';

export default function Layout({
  children,
  user,
  feedbackSubject,
}: {
  children: any;
  user?: User;
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
      <SiteContainer>
        <SmartHeader user={user} />

        <ContentContainer>
          <MarginContainer breakpoint={breakpoint}>
            <Block variant="main">
              <BreadcrumbWrapper />
              {children}
            </Block>
          </MarginContainer>
        </ContentContainer>

        <FooterContainer>
          <MarginContainer breakpoint={breakpoint}>
            <Footer props={{ user }} feedbackSubject={feedbackSubject} />
          </MarginContainer>
        </FooterContainer>
      </SiteContainer>
    </ThemeProvider>
  );
}
