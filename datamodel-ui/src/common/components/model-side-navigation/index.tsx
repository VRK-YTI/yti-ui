import { useState } from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { default as CommonSideNavigation } from 'yti-common-ui/side-navigation';
import { SideNavigationButton } from 'yti-common-ui/side-navigation/side-navigation.styles';

export default function SideNavigation() {
  const { isMedium, isLarge } = useBreakpoints();
  const [activeView, setActiveView] = useState<
    'search' | 'info' | 'classes' | 'attributes' | 'associations' | 'layout'
  >('search');

  return (
    <div style={{ height: '80vw' }}>
      <CommonSideNavigation
        buttons={
          <>
            <SideNavigationButton
              icon="search"
              variant="secondaryNoBorder"
              $active={activeView === 'search'}
              $isLarge={isLarge}
              onClick={() => setActiveView('search')}
            >
              {isLarge && 'Hae'}
            </SideNavigationButton>
            <SideNavigationButton
              icon="info"
              variant="secondaryNoBorder"
              $active={activeView === 'info'}
              $isLarge={isLarge}
              onClick={() => setActiveView('info')}
            >
              {isLarge && 'Tiedot'}
            </SideNavigationButton>
            <SideNavigationButton
              icon="chatHeart"
              variant="secondaryNoBorder"
              $active={activeView === 'classes'}
              $isLarge={isLarge}
              onClick={() => setActiveView('classes')}
            >
              {isLarge && 'Luokat'}
            </SideNavigationButton>
            <SideNavigationButton
              icon="history"
              variant="secondaryNoBorder"
              $active={activeView === 'attributes'}
              $isLarge={isLarge}
              onClick={() => setActiveView('attributes')}
            >
              {isLarge && 'Attribuutit'}
            </SideNavigationButton>
            <SideNavigationButton
              icon="heart"
              variant="secondaryNoBorder"
              $active={activeView === 'associations'}
              $isLarge={isLarge}
              onClick={() => setActiveView('associations')}
            >
              {isLarge && 'Assosiaatiot'}
            </SideNavigationButton>
          </>
        }
      >
        {renderView(activeView)}
      </CommonSideNavigation>
    </div>
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
      return renderSearchView();
  }
}

function renderSearchView() {
  return (
    <SearchInput
      labelText="Hae tietomallista"
      visualPlaceholder="Hae..."
      clearButtonLabel=""
      searchButtonLabel=""
    />
  );
}

function renderInfoView() {
  return <>Info</>;
}
function renderClassesView() {
  return <>Classes</>;
}
function renderAttributesView() {
  return <>Attributes</>;
}
function renderAssociationsView() {
  return <>Associations</>;
}
function renderLayoutView() {
  return <>Layout</>;
}
