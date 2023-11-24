import { ReactNode, useEffect, useState } from 'react';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { default as CommonDrawer } from 'yti-common-ui/drawer';
import { DrawerButton } from 'yti-common-ui/drawer/drawer.styles';
import {
  ModelDrawerContainer,
  DrawerViewContainer,
  ModelPanel,
} from './model-side-navigation.styles';
import { useStoreDispatch } from '@app/store';
import {
  displayWarning,
  selectCurrentViewName,
  selectHasChanges,
} from '../model/model.slice';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import DrawerTopAlert from './drawer-top-alert';
import useSetView from '@app/common/utils/hooks/use-set-view';

export type ViewType = {
  id:
    | 'search'
    | 'graph'
    | 'info'
    | 'links'
    | 'classes'
    | 'attributes'
    | 'associations'
    | 'documentation';
  icon: ReactNode;
  buttonLabel: string;
  buttonLabelSm?: string;
  component?: React.ReactFragment;
};

interface SideNavigationProps {
  views: ViewType[];
}

export default function Drawer({ views }: SideNavigationProps) {
  const { breakpoint, isSmall, isLarge } = useBreakpoints();
  const dispatch = useStoreDispatch();
  const hasChanges = useSelector(selectHasChanges());
  const router = useRouter();
  const currentView = useSelector(selectCurrentViewName());
  const [activeView, setActiveView] = useState<ViewType | undefined>(
    views.find((v) => v.id === currentView)
  );
  const { setView } = useSetView();

  const handleSetActiveView = (viewId: ViewType['id']) => {
    if (hasChanges) {
      dispatch(displayWarning());
      return;
    }

    if (['search', 'links', 'graph'].includes(viewId)) {
      setView(viewId);
      return;
    }
    setView(viewId, viewId === 'info' ? 'info' : 'list');
  };

  useEffect(() => {
    if (currentView !== activeView?.id) {
      setActiveView(views.find((v) => v.id === currentView) as ViewType);
    }
  }, [activeView, currentView, views, router]);

  return (
    <ModelPanel $isSmall={isSmall}>
      <ModelDrawerContainer $isSmall={isSmall}>
        <CommonDrawer
          buttons={views
            .filter((view) => (isSmall ? true : !view.id.includes('graph')))
            .map((view) => (
              <DrawerButton
                key={view.id}
                icon={view.icon}
                variant="secondaryNoBorder"
                $active={activeView?.id === view.id}
                $breakpoint={breakpoint}
                onClick={() => handleSetActiveView(view.id)}
                id={`drawer-button-${view.id}`}
              >
                {isLarge && view.buttonLabel}
              </DrawerButton>
            ))}
          smallButtons={views
            .filter((view) => (isSmall ? true : !view.id.includes('graph')))
            .map((view) => ({
              id: view.id,
              icon: view.icon,
              label: view.buttonLabel,
              onClick: () => handleSetActiveView(view.id),
            }))}
          viewOpen={
            typeof activeView !== 'undefined' &&
            typeof activeView.component !== 'undefined'
          }
          active={currentView}
          initialOpen
          navDisabled={hasChanges}
          openButtonExtraFunc={() => {
            dispatch(displayWarning());
          }}
        >
          <DrawerViewContainer>
            <DrawerTopAlert />
            {activeView?.component}
          </DrawerViewContainer>
        </CommonDrawer>
      </ModelDrawerContainer>
    </ModelPanel>
  );
}
