import React from 'react';
import { Block } from 'suomifi-ui-components';
import Logo from './logo';
import { HeaderWrapper } from './smart-header.styles';
import { useBreakpoints } from 'yti-common-ui/media-query';

export default function ErrorHeader() {
  const { breakpoint } = useBreakpoints();

  return (
    <Block variant="header">
      <HeaderWrapper $breakpoint={breakpoint}>
        <Logo />
      </HeaderWrapper>
    </Block>
  );
}
