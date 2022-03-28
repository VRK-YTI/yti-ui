import React from 'react';
import { ButtonProps } from 'suomifi-ui-components';
import { StyledButton } from '../icon-button/icon-button.styles';
import { BaseIconKeys } from 'suomifi-icons';
import { Icon } from './icon';

export interface IconButtonProps extends Omit<ButtonProps, 'icon'> {
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
