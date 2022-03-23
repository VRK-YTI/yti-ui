import React from 'react';
import { ButtonProps, Icon } from 'suomifi-ui-components';
import { StyledButton } from './icon-button.styles';
import { BaseIconKeys } from 'suomifi-icons';

export interface IconButtonProps extends ButtonProps {
  icon: BaseIconKeys;
  color?: string;
  isLarge?: boolean;
}

export default function IconButton({
  icon,
  color,
  variant = 'secondaryNoBorder',
  ...props
}: IconButtonProps) {
  return (
    <StyledButton color={color} variant={variant} {...props}>
      <Icon icon={icon} />
    </StyledButton>
  );
}
