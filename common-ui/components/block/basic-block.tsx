import React from 'react';
import { useBreakpoints } from '../media-query';
import { BasicBlockHeader, BasicBlockWrapper } from './block.styles';
import { Tooltip, Text } from 'suomifi-ui-components';

export interface BasicBlockProps {
  title?: React.ReactNode;
  tooltip?: {
    text: string;
    ariaToggleButtonLabelText: string;
    ariaCloseButtonLabelText: string;
  };
  children?: React.ReactNode;
  extra?: React.ReactNode;
  largeGap?: boolean;
  largeWidth?: boolean;
  id?: string;
}

export default function BasicBlock({
  title,
  tooltip,
  children,
  extra,
  largeGap,
  largeWidth,
  id,
}: BasicBlockProps) {
  const { isSmall } = useBreakpoints();

  return (
    <BasicBlockWrapper
      $largeGap={largeGap}
      $largeWidth={largeWidth}
      $isSmall={isSmall}
      id={id ?? 'basic-block'}
    >
      {title && (
        <BasicBlockHeader>
          {title}
          {tooltip && (
            <Tooltip
              ariaToggleButtonLabelText={tooltip.ariaToggleButtonLabelText}
              ariaCloseButtonLabelText={tooltip.ariaCloseButtonLabelText}
            >
              <Text>{tooltip.text}</Text>
            </Tooltip>
          )}
        </BasicBlockHeader>
      )}
      {children && children}
      {extra}
    </BasicBlockWrapper>
  );
}
