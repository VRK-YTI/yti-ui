import React from 'react';
import CommonWrapper from '../wrapper';
import { BadgeBarWrapper } from './title-block.styles';

export interface BadgeBarProps {
  children: React.ReactNode;
}

function BadgeBar({ children, ...rest }: BadgeBarProps) {
  return (
    <BadgeBarWrapper {...rest}>
      {React.Children.map(children, (child, i) => (
        <>
          {i > 0 && ' \u00b7 '}
          {child}
        </>
      ))}
    </BadgeBarWrapper>
  );
}

export default CommonWrapper(BadgeBar)
