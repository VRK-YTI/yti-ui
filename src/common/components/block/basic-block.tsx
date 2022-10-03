import React from 'react';
import { useBreakpoints } from '../media-query/media-query-context';
import { BasicBlockHeader, BasicBlockWrapper } from './block.styles';

export interface BasicBlockProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  extra?: React.ReactNode;
  largeGap?: boolean;
  largeWidth?: boolean;
  id?: string;
}

export default function BasicBlock({
  title,
  children,
  extra,
  largeGap,
  largeWidth,
  id,
}: BasicBlockProps) {
  const { isSmall } = useBreakpoints();
  return (
    <BasicBlockWrapper
      $largeGap={largeGap}
      $largeWidth={largeWidth}
      $isSmall={isSmall}
      id={id ?? 'basic-block'}
    >
      {title && <BasicBlockHeader>{title}</BasicBlockHeader>}
      {children && children}
      {extra}
    </BasicBlockWrapper>
  );
}
