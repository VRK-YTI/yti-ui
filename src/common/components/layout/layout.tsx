import Head from 'next/head';
import React from 'react';

import { Block } from 'suomifi-ui-components';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../theme';
import {
  ContentContainer,
  FooterContainer,
  HamburgerMenu,
  HeaderContainer,
  NavigationContainer,
  SiteContainer,
  MarginContainer,
} from './layout.styles';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import AuthenticationPanel from '../authentication-panel/authentication-panel';
import User from '../../interfaces/user-interface';
import Footer from '../footer/footer';
import Header from '../header/header';
import Navigation from '../navigation/navigation';

const debug = false;

export default function Layout({
  children,
  user,
}: {
  children: any;
  user?: User;
}) {
  const { t } = useTranslation('common');
  const siteTitle = t('terminology');

  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Terminology/React POC" />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <SiteContainer debug={debug}>
          <Block variant="header">
            <HeaderContainer debug={debug}>
              <MarginContainer>
                <Header />
              </MarginContainer>
            </HeaderContainer>
          </Block>

          <Block variant="nav">
            <NavigationContainer>
              <MarginContainer>
                <Navigation />
              </MarginContainer>
            </NavigationContainer>
          </Block>
          <ContentContainer debug={debug}>
            <MarginContainer debug={debug}>
              <Block variant="main">{children}</Block>
            </MarginContainer>
          </ContentContainer>

          <FooterContainer>
            <MarginContainer>
              <Footer />
            </MarginContainer>
          </FooterContainer>

        </SiteContainer>
      </ThemeProvider>
    </>
  );
}
