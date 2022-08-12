import React from 'react';
import { BasicBlockHeader, BasicBlockWrapper } from './block.styles';

export interface BasicBlockProps {
  title?: React.ReactNode;
  children: React.ReactNode;
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
  return (
    <BasicBlockWrapper $largeGap={largeGap} $largeWidth={largeWidth} id={id ?? 'basic-block'}>
      {title && <BasicBlockHeader>{title}</BasicBlockHeader>}
      {children}
      {extra}
    </BasicBlockWrapper>
  );
}
