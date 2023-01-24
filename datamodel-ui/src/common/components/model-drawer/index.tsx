import { useState } from 'react';
import { BaseIconKeys } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { default as CommonDrawer } from 'yti-common-ui/drawer';
import { SideNavigationButton } from 'yti-common-ui/drawer/side-navigation.styles';
import {
  ModelDrawerContainer,
  DrawerViewContainer,
} from './model-side-navigation.styles';
import { Panel } from 'reactflow';

type ViewType = {
  id: string;
  icon: BaseIconKeys;
  buttonLabel: string;
  component: React.ReactFragment;
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
    <Panel
      position="top-left"
      style={{
        height: '100%',
        maxHeight: '100%',
        position: 'absolute',
        display: 'flex',
      }}
    >
      <ModelDrawerContainer $isSmall={isSmall}>
        <CommonDrawer
          buttons={
            <>
              {views.map((view) => (
                <SideNavigationButton
                  key={view.id}
                  icon={view.icon}
                  variant="secondaryNoBorder"
                  $active={activeView?.id === view.id}
                  $breakpoint={breakpoint}
                  onClick={() => handleSetActiveView(view.id)}
                >
                  {isLarge && view.buttonLabel}
                </SideNavigationButton>
              ))}
            </>
          }
        >
          {typeof activeView !== 'undefined' && activeView.component && (
            <DrawerViewContainer>{activeView.component}</DrawerViewContainer>
          )}
        </CommonDrawer>
      </ModelDrawerContainer>
    </Panel>
  );
}
