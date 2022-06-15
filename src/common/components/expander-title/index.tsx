import { ComponentProps, ReactNode } from 'react';
import { ExpanderTitleButton } from 'suomifi-ui-components';
import {
  PrimaryTextWrapper,
  SecondaryTextWrapper,
} from './expander-title.styles';

export interface ExpanderTitleProps
  extends ComponentProps<typeof ExpanderTitleButton> {
  title: ReactNode;
  extra?: ReactNode;
}

export default function ExpanderTitle({
  title,
  extra,
  ...rest
}: ExpanderTitleProps) {
  return (
    <ExpanderTitleButton {...rest}>
      <PrimaryTextWrapper>{title}</PrimaryTextWrapper>
      {extra && <SecondaryTextWrapper>{extra}</SecondaryTextWrapper>}
    </ExpanderTitleButton>
  );
}
