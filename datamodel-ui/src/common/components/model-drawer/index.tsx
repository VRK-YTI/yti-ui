import { useState } from 'react';
import { BaseIconKeys } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { default as CommonDrawer } from 'yti-common-ui/drawer';
import { DrawerButton } from 'yti-common-ui/drawer/drawer.styles';
import {
  ModelDrawerContainer,
  DrawerViewContainer,
  ModelPanel,
} from './model-side-navigation.styles';

type ViewType = {
  id: string;
  icon: BaseIconKeys;
  buttonLabel: string;
  buttonLabelSm?: string;
  component?: React.ReactFragment;
};

interface SideNavigationProps {
  views: ViewType[];
}

export default function Drawer({ views }: SideNavigationProps) {
  const { breakpoint, isSmall, isLarge } = useBreakpoints();
  const [activeView, setActiveView] = useState<ViewType | undefined>(
    isSmall ? undefined : views?.[0] ?? undefined
  );

  const handleSetActiveView = (viewId: string) => {
    setActiveView(views.find((view) => view.id === viewId));
  };

  return (
    <ModelPanel position="top-left" $isSmall={isSmall}>
      <ModelDrawerContainer $isSmall={isSmall}>
        <CommonDrawer
          buttons={views
            .filter((view) => (isSmall ? true : !view.id.includes('-small')))
            .map((view) => (
              <DrawerButton
                key={view.id}
                icon={view.icon}
                variant="secondaryNoBorder"
                $active={activeView?.id === view.id}
                $breakpoint={breakpoint}
                onClick={() => handleSetActiveView(view.id)}
              >
                {isLarge && view.buttonLabel}
              </DrawerButton>
            ))}
          viewOpen={
            typeof activeView !== 'undefined' &&
            typeof activeView.component !== 'undefined'
          }
        >
          {typeof activeView !== 'undefined' &&
            typeof activeView.component !== 'undefined' && (
              <DrawerViewContainer>{activeView.component}</DrawerViewContainer>
            )}
        </CommonDrawer>
      </ModelDrawerContainer>
    </ModelPanel>
  );
}
