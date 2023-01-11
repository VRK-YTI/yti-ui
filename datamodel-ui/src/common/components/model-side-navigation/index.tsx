import { useState } from 'react';
import { SearchInput } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { default as CommonSideNavigation } from 'yti-common-ui/side-navigation';
import { SideNavigationButton } from 'yti-common-ui/side-navigation/side-navigation.styles';

export default function SideNavigation() {
  const { isSmall } = useBreakpoints();
  const [activeView, setActiveView] = useState<
    'search' | 'info' | 'classes' | 'attributes' | 'associations' | 'layout'
  >('search');

  return (
    <div style={{ height: '1500px' }}>
      <CommonSideNavigation
        buttons={
          <>
            <SideNavigationButton
              icon="search"
              variant="secondaryNoBorder"
              $active={activeView === 'search'}
              onClick={() => setActiveView('search')}
            >
              Hae
            </SideNavigationButton>
            <SideNavigationButton
              icon="info"
              variant="secondaryNoBorder"
              $active={activeView === 'info'}
              onClick={() => setActiveView('info')}
            >
              Tiedot
            </SideNavigationButton>
            <SideNavigationButton
              icon="chatHeart"
              variant="secondaryNoBorder"
              $active={activeView === 'classes'}
              onClick={() => setActiveView('classes')}
            >
              Luokat
            </SideNavigationButton>
            <SideNavigationButton
              icon="history"
              variant="secondaryNoBorder"
              $active={activeView === 'attributes'}
              onClick={() => setActiveView('attributes')}
            >
              Attribuutit
            </SideNavigationButton>
            <SideNavigationButton
              icon="heart"
              variant="secondaryNoBorder"
              $active={activeView === 'associations'}
              onClick={() => setActiveView('associations')}
            >
              Assosiaatiot
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
