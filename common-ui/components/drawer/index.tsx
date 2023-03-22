import { useBreakpoints } from '../media-query';
import { useEffect, useState, MouseEvent as ReactMouseEvent } from 'react';
import { Icon, BaseIconKeys } from 'suomifi-ui-components';
import {
  DrawerButtonGroup,
  DrawerContainer,
  DrawerContent,
  DrawerWrapper,
  ToggleButton,
} from './drawer.styles';
import ScrollableButtonMenu from './scrollable-button-menu';

interface SideNavigationProps {
  buttons: React.ReactFragment;
  smallButtons: {
    id: string;
    icon: BaseIconKeys;
    label: string;
    onClick: () => void;
  }[];
  viewOpen?: boolean;
  children: React.ReactFragment;
}

export default function Drawer({
  buttons,
  smallButtons,
  viewOpen,
  children,
}: SideNavigationProps) {
  const { isSmall } = useBreakpoints();
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(390);

  const handleResize = (e: ReactMouseEvent<HTMLDivElement>) => {
    const initWidth = width;
    const startPos = e.pageX;

    function onMouseMove(e: MouseEvent) {
      const newWidth = initWidth - startPos + e.pageX;
      if (newWidth >= 390 && newWidth <= window.innerWidth - 150) {
        setWidth(() => newWidth);
      }
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp, { once: true });
  };

  useEffect(() => {
    if (isSmall) {
      setWidth(390);
    }
  }, [isSmall]);

  return (
    <DrawerContainer $open={open} $isSmall={isSmall}>
      {!isSmall && (
        <div>
          <ToggleButton
            onClick={() => setOpen(!open)}
            variant="secondaryNoBorder"
            $open={open}
          >
            <Icon icon={open ? 'chevronLeft' : 'chevronRight'} />
          </ToggleButton>

          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions*/}
          <div
            style={{
              height: '100%',
              width: '8px',
              cursor: 'w-resize',
            }}
            onMouseDown={(e) => handleResize(e)}
          />
        </div>
      )}

      {isSmall && (
        <div className="small-screen-wrapper">
          {children && (
            <DrawerContent $isSmall={isSmall} $viewOpen={viewOpen}>
              {children}
            </DrawerContent>
          )}
          <ScrollableButtonMenu buttons={smallButtons} />
        </div>
      )}

      <DrawerWrapper $open={open}>
        {open && (
          <>
            <DrawerContent $isSmall={isSmall} $width={width}>
              {children}
            </DrawerContent>

            <DrawerButtonGroup $isSmall={isSmall}>{buttons}</DrawerButtonGroup>
          </>
        )}
      </DrawerWrapper>
    </DrawerContainer>
  );
}
