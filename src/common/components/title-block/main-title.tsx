import React from 'react';
import { MainTitleWrapper } from './title-block.styles';
import useTitleRef from '@app/common/utils/hooks/use-title-ref';

export interface MainTitleProps {
  children?: React.ReactNode;
}

export default function MainTitle({ children }: MainTitleProps) {
  const titleRef = useTitleRef();

  return (
    <MainTitleWrapper variant="h1" tabIndex={-1} ref={titleRef}>
      {children}
    </MainTitleWrapper>
  );
}
