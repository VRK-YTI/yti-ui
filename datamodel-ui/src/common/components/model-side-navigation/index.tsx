import { useState } from 'react';
import { BaseIconKeys } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { default as CommonSideNavigation } from 'yti-common-ui/side-navigation';
import { SideNavigationButton } from 'yti-common-ui/side-navigation/side-navigation.styles';
import {
  ModelSideNavigationContainer,
  ViewContainer,
} from './model-side-navigation.styles';

type ViewType = {
  id: string;
  icon: BaseIconKeys;
  buttonLabel: string;
  component: React.ReactFragment;
};

interface SideNavigationProps {
  views: ViewType[];
}

export default function SideNavigation({ views }: SideNavigationProps) {
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
    <ModelSideNavigationContainer $isSmall={isSmall}>
      <CommonSideNavigation
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
          <ViewContainer>{activeView.component}</ViewContainer>
        )}
      </CommonSideNavigation>
    </ModelSideNavigationContainer>
  );
}
