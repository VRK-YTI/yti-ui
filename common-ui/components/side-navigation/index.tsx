import { useState } from 'react';
import {
  SideNavigationButtonGroup,
  SideNavigationContainer,
  SideNavigationContent,
  SideNavigationWrapper,
  ToggleButton,
} from './side-navigation.styles';

interface SideNavigationProps {
  children: React.ReactFragment;
  buttons: React.ReactFragment;
}

export default function SideNavigation({
  children,
  buttons,
}: SideNavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <SideNavigationContainer>
      <ToggleButton
        icon={open ? 'chevronLeft' : 'chevronRight'}
        onClick={() => setOpen(!open)}
        variant="secondaryNoBorder"
      />
      <SideNavigationWrapper $open={open}>
        <SideNavigationContent>{children}</SideNavigationContent>

        <SideNavigationButtonGroup>{buttons}</SideNavigationButtonGroup>
      </SideNavigationWrapper>
    </SideNavigationContainer>
  );
}
