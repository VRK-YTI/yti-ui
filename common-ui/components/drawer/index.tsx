import { useBreakpoints } from '../media-query';
import { useState } from 'react';
import { Icon } from 'suomifi-ui-components';
import {
  DrawerButtonGroup,
  DrawerContainer,
  DrawerContent,
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
