import DrawerItemList from '@app/common/components/drawer-item-list';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import HasPermission from '@app/common/utils/has-permission';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { SearchInput, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import AttributeModal from '../attribute-modal';
import CommonForm from '../common-form';
import CommonView from '../common-view';
import { ViewBlock } from './attribute-view.styles';

export default function AttributeView({
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
  const hasPermission = HasPermission({ actions: ['CREATE_ATTRIBUTE'] });
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
    setView('attribute');
  };

  return (
    <>
      {renderListing()}
      {renderForm()}
      {renderAttribute()}
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
              {t('attribute-count-title', { count: 3 })}
            </Text>
            {hasPermission && (
              <AttributeModal
                buttonTranslations={{
                  useSelected: t('create-new-sub-attribute-for-selected', {
                    ns: 'admin',
                  }),
                  createNew: t('create-new-attribute', { ns: 'admin' }),
                }}
                buttonIcon
                handleFollowUp={handleFollowUp}
              />
            )}
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
                  onClick: handleShowAttribute,
                },
                {
                  label: 'Energialuokka',
                  subtitle: 'jhs210:energialuokka',
                  onClick: handleShowAttribute,
                },
                {
                  label: 'Kerrosala',
                  subtitle: 'jhs210:kerrosala',
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
        type={ResourceType.ATTRIBUTE}
        modelId={modelId}
        initialSubResourceOf={initialSubResourceOf}
        languages={languages}
      />
    );
  }

  function renderAttribute() {
    if (view !== 'attribute') {
      return <></>;
    }

    return (
      <CommonView
        type={ResourceType.ATTRIBUTE}
        handleReturn={handleFormReturn}
      />
    );
  }
}
