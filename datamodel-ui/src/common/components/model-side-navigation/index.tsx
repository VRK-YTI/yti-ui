import { useState } from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { default as CommonSideNavigation } from 'yti-common-ui/side-navigation';
import { SideNavigationButton } from 'yti-common-ui/side-navigation/side-navigation.styles';
import {
  ModelSideNavigationContainer,
  ViewContainer,
} from './model-side-navigation.styles';

export default function SideNavigation() {
  const { breakpoint, isSmall, isLarge } = useBreakpoints();
  const [activeView, setActiveView] = useState<
    | ''
    | 'search'
    | 'info'
    | 'classes'
    | 'attributes'
    | 'associations'
    | 'layout'
  >(isSmall ? '' : 'search');

  const handleSetActiveView = (view: typeof activeView) => {
    if (!isSmall) {
      setActiveView(view);
      return;
    }

    if (view === activeView) {
      setActiveView('');
    } else {
      setActiveView(view);
    }
  };

  return (
    <ModelSideNavigationContainer $isSmall={isSmall}>
      <CommonSideNavigation
        buttons={
          <>
            <SideNavigationButton
              icon="search"
              variant="secondaryNoBorder"
              $active={activeView === 'search'}
              $breakpoint={breakpoint}
              onClick={() => handleSetActiveView('search')}
            >
              {isLarge && 'Hae'}
            </SideNavigationButton>
            <SideNavigationButton
              icon="info"
              variant="secondaryNoBorder"
              $active={activeView === 'info'}
              $breakpoint={breakpoint}
              onClick={() => handleSetActiveView('info')}
            >
              {isLarge && 'Tiedot'}
            </SideNavigationButton>
            <SideNavigationButton
              icon="chatHeart"
              variant="secondaryNoBorder"
              $active={activeView === 'classes'}
              $breakpoint={breakpoint}
              onClick={() => handleSetActiveView('classes')}
            >
              {isLarge && 'Luokat'}
            </SideNavigationButton>
            <SideNavigationButton
              icon="history"
              variant="secondaryNoBorder"
              $active={activeView === 'attributes'}
              $breakpoint={breakpoint}
              onClick={() => handleSetActiveView('attributes')}
            >
              {isLarge && 'Attribuutit'}
            </SideNavigationButton>
            <SideNavigationButton
              icon="heart"
              variant="secondaryNoBorder"
              $active={activeView === 'associations'}
              $breakpoint={breakpoint}
              onClick={() => handleSetActiveView('associations')}
            >
              {isLarge && 'Assosiaatiot'}
            </SideNavigationButton>
          </>
        }
      >
        {renderView(activeView)}
      </CommonSideNavigation>
    </ModelSideNavigationContainer>
  );
}

function renderView(view: string) {
  switch (view) {
    case 'search':
      return renderSearchView();
    case 'info':
      return renderInfoView();
    case 'classes':
      return renderClassesView();
    case 'attributes':
      return renderAttributesView();
    case 'associations':
      return renderAssociationsView();
    case 'layout':
      return renderLayoutView();
    default:
      return renderEmptyView();
  }
}

function renderSearchView() {
  return (
    <ViewContainer>
      <SearchInput
        labelText="Hae tietomallista"
        visualPlaceholder="Hae..."
        clearButtonLabel=""
        searchButtonLabel=""
      />
    </ViewContainer>
  );
}

function renderInfoView() {
  return <ViewContainer>Info</ViewContainer>;
}
function renderClassesView() {
  return <ViewContainer>Classes</ViewContainer>;
}
function renderAttributesView() {
  return <ViewContainer>Attributes</ViewContainer>;
}
function renderAssociationsView() {
  return <ViewContainer>Associations</ViewContainer>;
}
function renderLayoutView() {
  return <ViewContainer>Layout</ViewContainer>;
}

function renderEmptyView() {
  return <></>;
}
