import { useState } from 'react';
import { Button, Icon } from 'suomifi-ui-components';
import {
  MoveButton,
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
    <SideNavigationContainer $open={open}>
      <div>
        <ToggleButton
          onClick={() => setOpen(!open)}
          variant="secondaryNoBorder"
          $open={open}
        >
          <Icon icon={open ? 'chevronLeft' : 'chevronRight'} />
        </ToggleButton>

        <SideNavigationVisibleButtonGroup>
          <Button icon="minus" />
          <Button icon="plus" />
          <MoveButton>
            <Icon icon="arrowUp" id="up" />
            <Icon icon="arrowRight" id="right" />
            <Icon icon="arrowDown" id="down" />
            <Icon icon="arrowLeft" id="left" />
          </MoveButton>
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
