import React from 'react';
import { BadgeBarWrapper } from './title-block.styles';

export interface BadgeBarProps {
  children: React.ReactNode;
  larger?: boolean;
  smBottom?: boolean;
}

export default function BadgeBar({
  children,
  larger,
  smBottom,
  ...rest
}: BadgeBarProps) {
  return (
    <BadgeBarWrapper $larger={larger} $smBottom={smBottom} {...rest}>
      {React.Children.map(children, (child, i) => (
        <>
          {child && i > 0 && ' \u00b7 '}
          {child}
        </>
      ))}
    </BadgeBarWrapper>
  );
}
