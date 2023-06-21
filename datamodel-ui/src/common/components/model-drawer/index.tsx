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
  setView,
} from '../model/model.slice';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import DrawerTopAlert from './drawer-top-alert';

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
    isSmall
      ? views.find((v) => v.id === 'graph')
      : views.find((v) => v.id === 'info')
  );

  const handleSetActiveView = (viewId: ViewType['id']) => {
    if (hasChanges) {
      dispatch(displayWarning());
      return;
    }

    if (['search', 'links', 'graph'].includes(viewId)) {
      dispatch(setView(viewId));
      return;
    }

    dispatch(setView(viewId, viewId === 'info' ? 'info' : 'list'));
  };

  useEffect(() => {
    if (currentView !== activeView?.id) {
      setActiveView(views.find((v) => v.id === currentView));
    }

    if (
      currentView === 'info' &&
      router.query.slug &&
      router.query.slug.length > 1
    ) {
      router.replace(router.query.slug[0]);
    }
  }, [activeView, currentView, views, router]);

  return (
    <ModelPanel position="bottom-left" $isSmall={isSmall}>
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
            {activeView && activeView.component}
          </DrawerViewContainer>
        </CommonDrawer>
      </ModelDrawerContainer>
    </ModelPanel>
  );
}
