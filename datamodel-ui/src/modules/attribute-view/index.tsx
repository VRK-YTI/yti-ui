import DrawerItemList from '@app/common/components/drawer-item-list';
import { useQueryInternalResourcesQuery } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import HasPermission from '@app/common/utils/has-permission';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { SearchInput, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import { DetachedPagination } from 'yti-common-ui/pagination';
import AttributeModal from '../attribute-modal';
import CommonForm from '../common-form';
import CommonView from '../common-view';
import {
  initializeResource,
  resetResource,
  useGetResourceMutation,
} from '@app/common/components/resource/resource.slice';
import { useStoreDispatch } from '@app/store';

export default function AttributeView({
  modelId,
  languages,
}: {
  modelId: string;
  languages: string[];
}) {
  const { t, i18n } = useTranslation('common');
  const [view, setView] = useState('listing');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useStoreDispatch();
  const hasPermission = HasPermission({ actions: ['CREATE_ATTRIBUTE'] });
  const [currentPage, setCurrentPage] = useState(1);
  const [getResource, getResourceResult] = useGetResourceMutation();
  const [query, setQuery] = useState('');
  const [initialSubResourceOf, setInitialSubResourceOf] = useState<{
    label: string;
    uri: string;
  }>();
  const { data, refetch } = useQueryInternalResourcesQuery({
    query: query ?? '',
    limitToDataModel: modelId,
    pageSize: 20,
    pageFrom: (currentPage - 1) * 20,
    resourceTypes: [ResourceType.ATTRIBUTE],
  });

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  const handleFollowUp = (value?: { label: string; uri: string }) => {
    dispatch(initializeResource(ResourceType.ATTRIBUTE, value?.label));
    setView('form');
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleFormReturn = () => {
    setView('listing');
    dispatch(resetResource());
    refetch();
  };

  const handleShowAttribute = (id: string) => {
    getResource({ modelId: modelId, resourceIdentifier: id });
    setView('attribute');
  };

  const handleFormFollowUp = (id: string) => {
    handleShowAttribute(id);
    refetch();
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
              {t('attribute-count-title', {
                count: data?.totalHitCount ?? 0,
              })}
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
                modelId={modelId}
              />
            )}
          </div>

          <SearchInput
            labelText=""
            clearButtonLabel={t('clear-all-selections', { ns: 'admin' })}
            searchButtonLabel={t('search')}
            labelMode="hidden"
            fullWidth
            onChange={(e) => handleQueryChange(e?.toString() ?? '')}
            debounce={500}
          />
        </StaticHeader>

        <DrawerContent height={headerHeight} spaced>
          {!data || data?.totalHitCount < 1 ? (
            <Text>{t('datamodel-no-attributes')}</Text>
          ) : (
            <DrawerItemList
              items={data.responseObjects.map((item) => ({
                label: getLanguageVersion({
                  data: item.label,
                  lang: i18n.language,
                }),
                subtitle: `${modelId}:${item.identifier}`,
                onClick: () => handleShowAttribute(item.identifier),
              }))}
            />
          )}
          <DetachedPagination
            currentPage={currentPage}
            maxPages={Math.ceil((data?.totalHitCount ?? 0) / 20)}
            maxTotal={20}
            setCurrentPage={(number) => setCurrentPage(number)}
          />
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
        handleFollowUp={handleFormFollowUp}
        type={ResourceType.ATTRIBUTE}
        modelId={modelId}
        languages={languages}
      />
    );
  }

  function renderAttribute() {
    if (view !== 'attribute' || !getResourceResult.isSuccess) {
      return <></>;
    }

    const assoc = getResourceResult.data;
    if (!assoc) {
      return <></>;
    }

    return (
      <CommonView
        data={assoc}
        modelId={modelId}
        type={ResourceType.ASSOCIATION}
        handleReturn={handleFormReturn}
      />
    );
  }
}
