import DrawerItemList from '@app/common/components/drawer-item-list';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useEffect, useRef, useState } from 'react';
import { SearchInput, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import AssociationModal from '../association-modal';
import CommonForm from '../common-form';
import CommonView from '../common-view';
import { ViewBlock } from './association-view.styles';

export default function AssociationView({ modelId }: { modelId: string }) {
  const [view, setView] = useState('listing');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [initialSubResourceOf, setInitialSubResourceOf] = useState<{
    label: string;
    uri: string;
  }>();

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  const handleFollowUp = (value?: { label: string; uri: string }) => {
    if (value) {
      setInitialSubResourceOf(value);
    }

    setView('form');
  };

  const handleFormReturn = () => {
    setView('listing');
  };

  const handleShowAttribute = () => {
    setView('association');
  };

  return (
    <>
      {renderListing()}
      {renderForm()}
      {renderAssociation()}
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
                  onClick: handleShowAttribute,
                },
                {
                  label: 'Rakennuskohteen omistaja',
                  subtitle: 'jhs210:rakomista',
                  onClick: handleShowAttribute,
                },
                {
                  label: 'Rakennuskohteen osoite',
                  subtitle: 'jhs210:rakosoite',
                  onClick: handleShowAttribute,
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

    return (
      <CommonForm
        handleReturn={handleFormReturn}
        type={ResourceType.ASSOCIATION}
        modelId={modelId}
        initialSubResourceOf={initialSubResourceOf}
      />
    );
  }

  function renderAssociation() {
    if (view !== 'association') {
      return <></>;
    }

    return <CommonView type="association" handleReturn={handleFormReturn} />;
  }
}
