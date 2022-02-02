import React from 'react';
import { BasicBlockHeader, BasicBlockWrapper } from './block.styles';

/**
 * Error handling:
 * - should possibly missing title have
 *   some default value instead of it
 *   being empty?
 * -
 */

export interface BasicBlockProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  extra?: React.ReactNode;
  largeGap?: boolean;
}

export default function BasicBlock({ title, children, extra, largeGap }: BasicBlockProps) {
  return (
    <BasicBlockWrapper largeGap={largeGap}>
      {title && <BasicBlockHeader>{title}</BasicBlockHeader>}
      {children}
      {extra}
    </BasicBlockWrapper>
  );
}
