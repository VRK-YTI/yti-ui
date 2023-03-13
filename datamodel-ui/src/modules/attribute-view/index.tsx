import DrawerItemList from '@app/common/components/drawer-item-list';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useEffect, useRef, useState } from 'react';
import { SearchInput, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import AttributeModal from '../attribute-modal';
import CommonForm from '../common-form';
import { ViewBlock } from './attribute-view.styles';

export default function AttributeView({ modelId }: { modelId: string }) {
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
            <Text variant="bold">0 Attribuuttia</Text>
            <AttributeModal
              buttonTranslations={{
                useSelected: 'Luo valitulle ala-attribuutti',
                createNew: 'Luo uusi attribuutti',
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
                  label: 'Elinkaaren vaihe',
                  subtitle: 'jhs210:elinkaari',
                  onClick: () => null,
                },
                {
                  label: 'Energialuokka',
                  subtitle: 'jhs210:energialuokka',
                  onClick: () => null,
                },
                {
                  label: 'Kerrosala',
                  subtitle: 'jhs210:kerrosala',
                  onClick: () => null,
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
        type={ResourceType.ATTRIBUTE}
        modelId={modelId}
        initialSubResourceOf={initialSubResourceOf}
      />
    );
  }
}
