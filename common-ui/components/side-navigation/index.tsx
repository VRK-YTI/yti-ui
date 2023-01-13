import { useBreakpoints } from '../media-query';
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
  buttons: React.ReactFragment;
  children: React.ReactFragment;
}

export default function SideNavigation({
  buttons,
  children,
}: SideNavigationProps) {
  const { isSmall } = useBreakpoints();
  const [open, setOpen] = useState(false);
  const [sideOpen, setSideOpen] = useState(true);

  return (
    <SideNavigationContainer $open={open} $isSmall={isSmall}>
      <div>
        {!isSmall && (
          <ToggleButton
            onClick={() => setOpen(!open)}
            variant="secondaryNoBorder"
            $open={open}
          >
            <Icon icon={open ? 'chevronLeft' : 'chevronRight'} />
          </ToggleButton>
        )}
        <SideNavigationVisibleButtonGroup $isSmall={isSmall}>
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
        </SideNavigationVisibleButtonGroup>
      </div>

      {isSmall && (
        <div style={{ width: '100%' }}>
          <SideNavigationContent $isSmall={isSmall}>
            {children}
          </SideNavigationContent>
          <SideNavigationButtonGroup $isSmall={isSmall}>
            {buttons}
          </SideNavigationButtonGroup>
        </div>
      )}

      <SideNavigationWrapper $open={open}>
        {open && (
          <>
            <SideNavigationContent $isSmall={isSmall}>
              {children}
            </SideNavigationContent>

            <SideNavigationButtonGroup $isSmall={isSmall}>
              {buttons}
            </SideNavigationButtonGroup>
          </>
        )}
      </SideNavigationWrapper>
    </SideNavigationContainer>
  );
}
