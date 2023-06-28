import React, { ReactNode } from 'react';
import { ButtonProps } from 'suomifi-ui-components';
import { StyledButton } from './icon-button.styles';

export interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
  color?: string;
}

export default function IconButton({
  icon,
  color,
  variant = 'secondaryNoBorder',
  ...props
}: IconButtonProps) {
  return (
    <StyledButton color={color} variant={variant} {...props}>
      {icon}
    </StyledButton>
  );
}
