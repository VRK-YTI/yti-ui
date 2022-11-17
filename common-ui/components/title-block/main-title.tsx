import React from 'react';
import { MainTitleWrapper } from './title-block.styles';
import useTitleRef from '../../utils/hooks/use-title-ref';

export interface MainTitleProps {
  children?: JSX.Element | string;
}

export default function MainTitle({ children }: MainTitleProps) {
  const titleRef = useTitleRef();

  return (
    <MainTitleWrapper variant="h1" tabIndex={-1} ref={titleRef} id="main-title">
      {children}
    </MainTitleWrapper>
  );
}
