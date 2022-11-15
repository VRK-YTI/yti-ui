import React from "react";
import { ButtonProps, Icon } from "suomifi-ui-components";
import { StyledButton } from "./icon-button.styles";

export interface IconButtonProps extends ButtonProps {
  icon: ButtonProps["icon"];
  color?: string;
  isLarge?: boolean;
}

export default function IconButton({
  icon,
  color,
  variant = "secondaryNoBorder",
  ...props
}: IconButtonProps) {
  return (
    <StyledButton color={color} variant={variant} {...props}>
      {icon && <Icon icon={icon} />}
    </StyledButton>
  );
}
