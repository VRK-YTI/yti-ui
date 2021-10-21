import Head from 'next/head';
import React from 'react';

// import { Link } from 'suomifi-ui-components'
import Link from 'next/link';
import { LanguageMenu, LanguageMenuItem } from 'suomifi-ui-components';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../theme';
import {
  ContentContainer,
  HamburgerMenu,
  HeaderContainer,
  HeaderTitle,
  HeaderWrapper,
  SiteContainer,
  SiteLogo,
  SiteWrapper,
  WidthContainer,
} from './layout.styles';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import AuthenticationPanel from '../authentication-panel/authentication-panel';
import User from '../../interfaces/user-interface';

const debug = false;

function Title() {
  return (
    <Link passHref href="/">
      <HeaderTitle>Sanastot</HeaderTitle>
    </Link>
  );
}

export default function Layout({
  children,
  user,
}: {
  children: any;
  user?: User;
}) {
  const { t } = useTranslation('common');
  const router = useRouter();

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
          <SiteWrapper debug={debug}>
            <HeaderContainer debug={debug}>
              <WidthContainer debug={debug}>
                <HeaderWrapper debug={debug}>
                  <SiteLogo>
                    <Title />
                  </SiteLogo>
                  <LanguageMenu name={router.locale?.toUpperCase() ?? '??'}>
                    <LanguageMenuItem
                      onSelect={() => {
                        router.push(router.asPath, router.asPath, {
                          locale: 'fi',
                        });
                      }}
                      selected={router.locale === 'fi'}
                    >
                      Suomeksi
                    </LanguageMenuItem>
                    <LanguageMenuItem
                      onSelect={() => {
                        router.push(router.asPath, router.asPath, {
                          locale: 'en',
                        });
                      }}
                      selected={router.locale === 'en'}
                    >
                      Englanniksi
                    </LanguageMenuItem>
                  </LanguageMenu>
                  <AuthenticationPanel user={user} />
                  <HamburgerMenu debug={debug}>
                    <Link href="/">&#x2630;</Link>
                  </HamburgerMenu>
                </HeaderWrapper>
              </WidthContainer>
            </HeaderContainer>
            <ContentContainer debug={debug}>
              <WidthContainer debug={debug}>
                <main>{children}</main>
              </WidthContainer>
            </ContentContainer>
          </SiteWrapper>
        </SiteContainer>
      </ThemeProvider>
    </>
  );
}
