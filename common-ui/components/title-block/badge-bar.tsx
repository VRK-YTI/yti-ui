import React from 'react';
import { BadgeBarWrapper } from './title-block.styles';

export interface BadgeBarProps {
  children: React.ReactNode;
  larger?: boolean;
}

export default function BadgeBar({ children, larger, ...rest }: BadgeBarProps) {
  return (
    <BadgeBarWrapper $larger={larger} {...rest}>
      {React.Children.map(children, (child, i) => (
        <>
          {i > 0 && ' \u00b7 '}
          {child}
        </>
      ))}
    </BadgeBarWrapper>
  );
}
