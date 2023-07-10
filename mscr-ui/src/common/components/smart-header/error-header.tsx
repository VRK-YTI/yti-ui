import React from 'react';
import { Block } from 'suomifi-ui-components';
import { HeaderContainer, MarginContainer } from '../layout/layout.styles';
import Logo from './logo';
import { HeaderWrapper } from './smart-header.styles';
import { useBreakpoints } from 'yti-common-ui/media-query';

export default function ErrorHeader() {
  const { breakpoint } = useBreakpoints();

  return (
    <Block variant="header">
      <HeaderContainer>
        <MarginContainer $breakpoint={breakpoint}>
          <HeaderWrapper $breakpoint={breakpoint}>
            <Logo />
          </HeaderWrapper>
        </MarginContainer>
      </HeaderContainer>
    </Block>
  );
}
