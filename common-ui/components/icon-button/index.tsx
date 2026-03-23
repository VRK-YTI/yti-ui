import React, { ReactElement } from 'react';
import { ButtonProps } from 'suomifi-ui-components';
import { StyledButton } from './icon-button.styles';

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'icon'> {
  icon: ReactElement;
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
