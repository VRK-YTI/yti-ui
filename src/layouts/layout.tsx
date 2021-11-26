import Head from 'next/head';
import React from 'react';
import { Block } from 'suomifi-ui-components';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme';
import {
  ContentContainer,
  FooterContainer,
  HeaderContainer,
  NavigationContainer,
  SiteContainer,
  MarginContainer,
} from './layout.styles';
import { useTranslation } from 'next-i18next';
import User from '../common/interfaces/user-interface';
import Footer from '../common/components/footer/footer';
import Header from '../modules/header';
import Navigation from '../common/components/navigation/navigation';
import { LayoutProps } from './layout-props';
import BreadcrumbWrapper from '../common/components/breadcrumb/breadcrumb';
import ErrorHeader from '../modules/header/error-header';

export default function Layout({
  children,
  user,
  error,
  isSmall = false,
  feedbackSubject,
}: {
  children: any;
  user?: User;
  error?: boolean;
  isSmall?: boolean;
  feedbackSubject?: string;
}) {
  const { t } = useTranslation('common');

  const siteTitle = t('terminology');

  const layoutProps: LayoutProps = {
    isSmall,
    user
  };

  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <Head>
          <meta name="description" content="Terminology/React POC" />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <SiteContainer isSmall={isSmall}>
          <Block variant="header">
            <HeaderContainer isSmall={isSmall}>
              <MarginContainer isSmall={isSmall}>
                {!error ? (
                  <Header props={layoutProps} />
                ) : (
                  <ErrorHeader props={layoutProps}/>
                )}
              </MarginContainer>
            </HeaderContainer>
          </Block>

          {!error &&
            <NavigationContainer isSmall={isSmall}>
              <MarginContainer isSmall={isSmall}>
                <Block variant="nav">
                  <Navigation props={layoutProps}/>
                </Block>
              </MarginContainer>
            </NavigationContainer>
          }
          <ContentContainer >
            <MarginContainer isSmall={isSmall}>
              <Block variant="main">
                <>
                  {!error &&
                    <BreadcrumbWrapper />
                  }
                  {children}
                </>
              </Block>
            </MarginContainer>
          </ContentContainer>

          {!error &&
            <FooterContainer>
              <MarginContainer isSmall={isSmall}>
                <Footer props={layoutProps} feedbackSubject={feedbackSubject} />
              </MarginContainer>
            </FooterContainer>
          }
        </SiteContainer>
      </ThemeProvider>
    </>
  );
}
