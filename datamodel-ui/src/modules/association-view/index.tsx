import DrawerItemList from '@app/common/components/drawer-item-list';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { SearchInput, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import AssociationModal from '../association-modal';
import CommonForm from '../common-form';
import CommonView from '../common-view';
import { ViewBlock } from './association-view.styles';

export default function AssociationView({
  modelId,
  languages,
}: {
  modelId: string;
  languages: string[];
}) {
  const { t } = useTranslation('common');
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

  const handleShowAssociation = () => {
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
            <Text variant="bold">
              {t('association-count-title', { count: 3 })}
            </Text>
            <AssociationModal
              buttonTranslations={{
                useSelected: t('create-new-sub-association-for-selected', {
                  ns: 'admin',
                }),
                createNew: t('create-new-association', { ns: 'admin' }),
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
                  onClick: handleShowAssociation,
                },
                {
                  label: 'Rakennuskohteen omistaja',
                  subtitle: 'jhs210:rakomista',
                  onClick: handleShowAssociation,
                },
                {
                  label: 'Rakennuskohteen osoite',
                  subtitle: 'jhs210:rakosoite',
                  onClick: handleShowAssociation,
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
        languages={languages}
      />
    );
  }

  function renderAssociation() {
    if (view !== 'association') {
      return <></>;
    }

    return (
      <CommonView
        type={ResourceType.ASSOCIATION}
        handleReturn={handleFormReturn}
      />
    );
  }
}
