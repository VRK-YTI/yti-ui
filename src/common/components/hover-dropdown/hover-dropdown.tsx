import React from 'react';
import { Link } from 'suomifi-ui-components';
import {
  HoverDropdownItem,
  HoverDropdownList,
  HoverDropdownListWrapper,
  HoverDropdownWrapper
} from './hover-dropdown.styles';

export interface HoverDropdownProps {
  items?: { key: string, label: string, value?: string, onClick?: () => void }[];
  children?: React.ReactNode;
}

export default function HoverDropdown({ children, items }: HoverDropdownProps) {
  return (
    <HoverDropdownWrapper>
      <div>{children}</div>
      <HoverDropdownListWrapper>
        <HoverDropdownList>
          {items?.map(({ key, value, label, onClick }) => (
            <HoverDropdownItem key={key}>
              {value ? (
                <Link href="#" onClick={onClick}>{label}</Link>
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
