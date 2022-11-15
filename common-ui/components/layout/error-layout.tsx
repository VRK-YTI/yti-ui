import Head from "next/head";
import React from "react";
import { Block } from "suomifi-ui-components";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./theme";
import {
  ContentContainer,
  SiteContainer,
  MarginContainer,
  HeaderContainer,
} from "./layout.styles";
import { useBreakpoints } from "../media-query";
// import { HeaderWrapper } from '@app/modules/smart-header/smart-header.styles';
// import Logo from '@app/modules/smart-header/logo';
// import Matomo from '@app/common/components/matomo';

export default function ErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { breakpoint } = useBreakpoints();

  return (
    <ThemeProvider theme={lightTheme}>
      {/* <Matomo /> */}
      <Head>
        <meta name="description" content="Terminology/React POC" />
        <meta name="og:title" content="Sanastot" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <SiteContainer>
        <Block variant="header">
          <HeaderContainer>
            <MarginContainer $breakpoint={breakpoint}>
              {/* <HeaderWrapper $breakpoint={breakpoint}>
                <Logo />
              </HeaderWrapper> */}
            </MarginContainer>
          </HeaderContainer>
        </Block>

        <ContentContainer>
          <MarginContainer $breakpoint={breakpoint}>
            <Block variant="main" id="main">
              {children}
            </Block>
          </MarginContainer>
        </ContentContainer>
      </SiteContainer>
    </ThemeProvider>
  );
}
