import Head from 'next/head';
import React from 'react';

import { Block } from 'suomifi-ui-components';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../theme';
import {
  ContentContainer,
  FooterContainer,
  HeaderContainer,
  NavigationContainer,
  SiteContainer,
  MarginContainer,
} from './layout.styles';
import { useTranslation } from 'next-i18next';
import User from '../../interfaces/user-interface';
import Footer from '../footer/footer';
import Header from '../header/header';
import Navigation from '../navigation/navigation';
import { useMediaQuery } from '@material-ui/core';
import { LayoutProps } from './layout-props';
import BreadcrumbWrapper from '../breadcrumb/breadcrumb';
import ErrorHeader from '../header/error-header';

export default function Layout({
  children,
  user,
  error
}: {
  children: any;
  user?: User;
  error?: boolean;
}) {
  const { t } = useTranslation('common');

  const siteTitle = t('terminology');
  const isLarge = useMediaQuery('(min-width:945px)');

  const layoutProps: LayoutProps = {
    isLarge,
    user
  };

  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Terminology/React POC" />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <SiteContainer isLarge={isLarge}>
          <Block variant="header">
            <HeaderContainer>
              <MarginContainer isLarge={isLarge}>
                {!error ? (
                  <Header props={layoutProps} />
                ) : (
                  <ErrorHeader props={layoutProps}/>
                )}
              </MarginContainer>
            </HeaderContainer>
          </Block>

          {!error &&
            <NavigationContainer isLarge={isLarge}>
              <MarginContainer isLarge={isLarge}>
                <Block variant="nav">
                  <Navigation props={layoutProps}/>
                </Block>
              </MarginContainer>
            </NavigationContainer>
          }
          <ContentContainer >

            <MarginContainer isLarge={isLarge}>
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
              <MarginContainer isLarge={isLarge}>
                <Footer props={layoutProps} />
              </MarginContainer>
            </FooterContainer>
          }
        </SiteContainer>
      </ThemeProvider>
    </>
  );
}
