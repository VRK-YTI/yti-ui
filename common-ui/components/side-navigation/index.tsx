import { useState } from 'react';
import { Button, Icon } from 'suomifi-ui-components';
import {
  SideNavigationButtonGroup,
  SideNavigationContainer,
  SideNavigationContent,
  SideNavigationVisibleButtonGroup,
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
      <div>
        <ToggleButton
          onClick={() => setOpen(!open)}
          variant="secondaryNoBorder"
        >
          <Icon icon={open ? 'chevronLeft' : 'chevronRight'} />
        </ToggleButton>

        <SideNavigationVisibleButtonGroup>
          <Button icon="minus" />
          <Button icon="plus" />
          <Button icon="plus" />
          <Button icon="swapRounded" />
          <Button icon="download" />
          <Button icon="save" />
          <Button icon="chevronDown" variant="secondaryNoBorder" />
        </SideNavigationVisibleButtonGroup>
      </div>

      <SideNavigationWrapper $open={open}>
        {open && (
          <>
            <SideNavigationContent>{children}</SideNavigationContent>

            <SideNavigationButtonGroup>{buttons}</SideNavigationButtonGroup>
          </>
        )}
      </SideNavigationWrapper>
    </SideNavigationContainer>
  );
}
