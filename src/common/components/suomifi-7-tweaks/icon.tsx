// Extracted from suomifi-ui-components v7.0.0-beta.0

import React, { Component } from 'react';
import { default as styled } from 'styled-components';
import classnames from 'classnames';
import { SuomifiIcon, SuomifiIconInterface } from 'suomifi-icons';
import { iconBaseStyles } from './icon.styles';

export const baseClassName = 'fi-icon';
export const cursorPointerClassName = `${baseClassName}--cursor-pointer`;

export interface IconBaseProps {
  ariaLabel?: string;
  mousePointer?: boolean;
  color?: string;
  fill?: string;
  testId?: string;
}

export interface IconProps extends IconBaseProps, SuomifiIconInterface {}

const StyledSuomifiIcon = styled(
  ({ ariaLabel, mousePointer, className, ...passProps }: IconProps) => (
    <SuomifiIcon
      className={classnames(baseClassName, className, {
        [cursorPointerClassName]: !!mousePointer,
      })}
      {...passProps}
      {...ariaLabelOrHidden(ariaLabel)}
      {...ariaFocusableNoLabel(ariaLabel)}
    />
  )
)`
  ${iconBaseStyles}
`;

export class Icon extends Component<IconProps> {
  render() {
    const { icon, ...passProps } = this.props;

    if (icon !== undefined) {
      return <StyledSuomifiIcon {...passProps} icon={icon} />;
    }

    return;
  }
}

export const ariaLabelOrHidden = (ariaLabel?: string) =>
  ifAriaNoLabel(ariaLabel)
    ? { 'aria-label': ariaLabel, role: 'img' }
    : { 'aria-hidden': true };

export const ariaFocusableNoLabel = (ariaLabel?: string) =>
  ifAriaNoLabel(ariaLabel) ? {} : { focusable: false };

const ifAriaNoLabel = (ariaLabel?: string) => !!ariaLabel || ariaLabel === '';
