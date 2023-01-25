import { useBreakpoints } from '../media-query';
import { useEffect, useState } from 'react';
import { Button, Icon } from 'suomifi-ui-components';
import {
  MoveButton,
  DrawerButtonGroup,
  DrawerContainer,
  DrawerContent,
  SideNavigationVisibleButtonGroup,
  DrawerWrapper,
  ToggleButton,
} from './side-navigation.styles';

interface SideNavigationProps {
  buttons: React.ReactFragment;
  viewOpen?: boolean;
  children: React.ReactFragment;
}

export default function Drawer({
  buttons,
  viewOpen,
  children,
}: SideNavigationProps) {
  const { isSmall } = useBreakpoints();
  const [open, setOpen] = useState(false);

  return (
    <DrawerContainer $open={open} $isSmall={isSmall}>
      {!isSmall && (
        <ToggleButton
          onClick={() => setOpen(!open)}
          variant="secondaryNoBorder"
          $open={open}
        >
          <Icon icon={open ? 'chevronLeft' : 'chevronRight'} />
        </ToggleButton>
      )}

      {/* <SideNavigationVisibleButtonGroup $isSmall={isSmall}>
          {sideOpen && (
            <>
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
            </>
          )}
          {!isSmall && (
            <Button
              icon={sideOpen ? 'chevronUp' : 'chevronDown'}
              variant="secondaryNoBorder"
              onClick={() => setSideOpen(!sideOpen)}
            />
          )}
        </SideNavigationVisibleButtonGroup> */}

      {isSmall && (
        <div className="small-screen-wrapper">
          <DrawerContent $isSmall={isSmall} $viewOpen={viewOpen}>
            {children}
          </DrawerContent>
          <DrawerButtonGroup $isSmall={isSmall}>{buttons}</DrawerButtonGroup>
        </div>
      )}

      <DrawerWrapper $open={open}>
        {open && (
          <>
            <DrawerContent $isSmall={isSmall}>{children}</DrawerContent>

            <DrawerButtonGroup $isSmall={isSmall}>{buttons}</DrawerButtonGroup>
          </>
        )}
      </DrawerWrapper>
    </DrawerContainer>
  );
}
