import DrawerItemList from '@app/common/components/drawer-item-list';
import { useEffect, useRef, useState } from 'react';
import { SearchInput, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import AssociationModal from '../association-modal';
import CommonForm from '../common-form';
import { ViewBlock } from './association-view.styles';

export default function AttributeView() {
  const [view, setView] = useState('listing');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  const handleFollowUp = () => {
    setView('form');
  };

  const handleFormReturn = () => {
    setView('listing');
  };

  return (
    <>
      {renderListing()}
      {renderForm()}
    </>
  );

  function renderListing() {
    if (view !== 'listing') {
      return <></>;
    }

    return (
      <>
        <StaticHeader ref={ref}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text variant="bold">0 Assosiaatiota</Text>
            <AssociationModal
              buttonTranslations={{
                useSelected: 'Luo valitulle ala-assosiaatio',
                createNew: 'Luo uusi assosiaatio',
              }}
              buttonIcon
              handleFollowUp={handleFollowUp}
            />
          </div>
        </StaticHeader>

        <DrawerContent height={headerHeight}>
          <ViewBlock>
            <SearchInput
              labelText=""
              clearButtonLabel=""
              searchButtonLabel=""
              labelMode="hidden"
              className="fullwidth"
            />

            <DrawerItemList
              items={[
                {
                  label: 'Liitetään kohteella',
                  subtitle: 'jhs210:liitos',
                },
                {
                  label: 'Rakennuskohteen omistaja',
                  subtitle: 'jhs210:rakomista',
                },
                {
                  label: 'Rakennuskohteen osoite',
                  subtitle: 'jhs210:rakosoite',
                },
              ]}
            />
          </ViewBlock>
        </DrawerContent>
      </>
    );
  }

  function renderForm() {
    if (view !== 'form') {
      return <></>;
    }

    return <CommonForm handleReturn={handleFormReturn} />;
  }
}
