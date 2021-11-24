import React from 'react';
import { Link } from 'suomifi-ui-components';
import {
  HoverDropdownItem,
  HoverDropdownList,
  HoverDropdownListWrapper,
  HoverDropdownWrapper
} from './hover-dropdown.styles';

export interface HoverDropdownProps {
  onChange?: (value: string) => void;
  items?: { key: string, label: string, value?: string }[];
  children?: React.ReactNode;
  isSmall?: boolean;
}

export default function HoverDropdown({ onChange, children, items, isSmall = false }: HoverDropdownProps) {
  return (
    <HoverDropdownWrapper>
      <div>{children}</div>
      <HoverDropdownListWrapper>
        <HoverDropdownList>
          {items?.map(({ key, value, label }) => (
            <HoverDropdownItem key={key}>
              {value ? (
                <Link href="#" onClick={() => onChange?.(value)}>{label}</Link>
              ) : (
                <span>{label}</span>
              )}
            </HoverDropdownItem>
          ))}
        </HoverDropdownList>
      </HoverDropdownListWrapper>
    </HoverDropdownWrapper>
  );
}
