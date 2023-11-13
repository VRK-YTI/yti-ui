import { useBreakpoints } from '../media-query';
import {
  useEffect,
  useState,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';
import { IconChevronLeft, IconChevronRight } from 'suomifi-ui-components';
import {
  DrawerButtonGroup,
  DrawerContainer,
  DrawerContent,
  DrawerWrapper,
  ToggleButton,
  WidthDragger,
} from './drawer.styles';
import ScrollableButtonMenu from './scrollable-button-menu';

interface SideNavigationProps {
  buttons: React.ReactFragment;
  smallButtons: {
    id: string;
    icon: ReactNode;
    label: string;
    onClick: () => void;
  }[];
  viewOpen?: boolean;
  active?: string;
  initialOpen?: boolean;
  navDisabled?: boolean;
  openButtonExtraFunc?: () => void;
  children: React.ReactFragment;
}

export default function Drawer({
  buttons,
  smallButtons,
  viewOpen,
  active,
  initialOpen,
  navDisabled,
  openButtonExtraFunc,
  children,
}: SideNavigationProps) {
  const { isSmall } = useBreakpoints();
  const [open, setOpen] = useState(initialOpen ?? false);
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

  const handleSetOpen = (value: boolean) => {
    if (!navDisabled) {
      setOpen(value);
    }

    if (openButtonExtraFunc) {
      openButtonExtraFunc();
    }
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
            onClick={() => handleSetOpen(!open)}
            variant="secondaryNoBorder"
            $open={open}
          >
            {open ? <IconChevronLeft /> : <IconChevronRight />}
          </ToggleButton>

          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          {open && <WidthDragger onMouseDown={(e) => handleResize(e)} />}
        </div>
      )}

      {isSmall ? (
        <div className="small-screen-wrapper">
          {children && (
            <DrawerContent $isSmall={isSmall} $viewOpen={viewOpen}>
              {children}
            </DrawerContent>
          )}
          <ScrollableButtonMenu buttons={smallButtons} active={active} />
        </div>
      ) : (
        <DrawerWrapper $open={open}>
          {open && (
            <>
              <DrawerContent $isSmall={isSmall} $width={width}>
                {children}
              </DrawerContent>

              <DrawerButtonGroup $isSmall={isSmall}>
                {buttons}
              </DrawerButtonGroup>
            </>
          )}
        </DrawerWrapper>
      )}
    </DrawerContainer>
  );
}
