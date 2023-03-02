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
import { resolve } from 'yti-common-ui/media-query/styled-helpers';

type ViewType = {
  id: string;
  icon: BaseIconKeys;
  buttonLabel: string;
  buttonLabelSm?: string;
  component: React.ReactFragment;
};

interface SideNavigationProps {
  views: ViewType[];
}

export default function Drawer({ views }: SideNavigationProps) {
  const { breakpoint, isSmall } = useBreakpoints();
  const [activeView, setActiveView] = useState<ViewType | undefined>(
    isSmall ? undefined : views?.[0] ?? undefined
  );

  const handleSetActiveView = (viewId: string) => {
    if (!isSmall) {
      setActiveView(views.find((view) => view.id === viewId));
      return;
    }

    if (viewId === activeView?.id) {
      setActiveView(undefined);
    } else {
      setActiveView(views.find((view) => view.id === viewId));
    }
  };

  return (
    <ModelPanel position="top-left" $isSmall={isSmall}>
      <ModelDrawerContainer $isSmall={isSmall}>
        <CommonDrawer
          buttons={
            <>
              {views.map((view) => (
                <DrawerButton
                  key={view.id}
                  icon={view.icon}
                  variant="secondaryNoBorder"
                  $active={activeView?.id === view.id}
                  $breakpoint={breakpoint}
                  onClick={() => handleSetActiveView(view.id)}
                >
                  {resolve(
                    breakpoint,
                    view.buttonLabelSm ?? view.buttonLabel,
                    '',
                    view.buttonLabel
                  )}
                </DrawerButton>
              ))}
            </>
          }
          viewOpen={typeof activeView !== 'undefined'}
        >
          {typeof activeView !== 'undefined' && activeView.component && (
            <DrawerViewContainer>{activeView.component}</DrawerViewContainer>
          )}
        </CommonDrawer>
      </ModelDrawerContainer>
    </ModelPanel>
  );
}
