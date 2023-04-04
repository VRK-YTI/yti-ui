import { useEffect, useState } from 'react';
import { BaseIconKeys } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { default as CommonDrawer } from 'yti-common-ui/drawer';
import { DrawerButton } from 'yti-common-ui/drawer/drawer.styles';
import {
  ModelDrawerContainer,
  DrawerViewContainer,
  ModelPanel,
} from './model-side-navigation.styles';
import { useStoreDispatch } from '@app/store';
import { selectCurrentViewName, setView } from '../model/model.slice';
import { useSelector } from 'react-redux';

type ViewType = {
  id:
    | 'search'
    | 'graph-small'
    | 'info'
    | 'links'
    | 'classes'
    | 'attributes'
    | 'associations';
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
  const dispatch = useStoreDispatch();
  const currentView = useSelector(selectCurrentViewName());
  const [activeView, setActiveView] = useState<ViewType | undefined>(
    isSmall ? undefined : views?.[0] ?? undefined
  );

  const handleSetActiveView = (viewId: ViewType['id']) => {
    if (viewId === 'graph-small') {
      //TODO: Handle graph view in mobile
      return;
    }

    if (['search', 'links'].includes(viewId)) {
      dispatch(setView(viewId));
      return;
    }

    dispatch(setView(viewId, viewId === 'info' ? 'info' : 'list'));
  };

  useEffect(() => {
    if (currentView !== activeView?.id) {
      setActiveView(views.find((v) => v.id === currentView));
    }
  }, [activeView, currentView, views]);

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
          smallButtons={views
            .filter((view) => (isSmall ? true : !view.id.includes('-small')))
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
