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
  const isSmall = useMediaQuery('(max-width:945px)');

  const layoutProps: LayoutProps = {
    isSmall: isSmall,
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
            <HeaderContainer>
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
                <Footer props={layoutProps} />
              </MarginContainer>
            </FooterContainer>
          }
        </SiteContainer>
      </ThemeProvider>
    </>
  );
}
