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
  setResource,
  useGetResourceQuery,
} from '@app/common/components/resource/resource.slice';
import { useStoreDispatch } from '@app/store';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  selectSelected,
  selectViews,
} from '@app/common/components/model/model.slice';
import { getResourceInfo } from '@app/common/utils/parse-slug';
import { resourceToResourceFormType } from '../common-form/utils';

export default function AttributeView({
  modelId,
  languages,
  terminologies,
  applicationProfile,
}: {
  modelId: string;
  languages: string[];
  terminologies: string[];
  applicationProfile?: boolean;
}) {
  const { t, i18n } = useTranslation('common');
  const hasPermission = HasPermission({ actions: ['CREATE_ATTRIBUTE'] });
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const views = useSelector(selectViews());
  const globalSelected = useSelector(selectSelected());
  const [view, setView] = useState(
    Object.keys(views.attributes).filter((k) => k).length > 0
      ? Object.keys(views.attributes).find(
          (k) =>
            views.attributes[k as keyof typeof views['attributes']] === true
        )
      : 'list'
  );
  const [headerHeight, setHeaderHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [currentAttributeId, setCurrentAttributeId] = useState<
    string | undefined
  >(
    getResourceInfo(router.query.slug)?.type === 'attribute'
      ? getResourceInfo(router.query.slug)?.id
      : undefined
  );

  const { data, refetch } = useQueryInternalResourcesQuery({
    query: query ?? '',
    limitToDataModel: modelId,
    pageSize: 20,
    pageFrom: (currentPage - 1) * 20,
    resourceTypes: [ResourceType.ATTRIBUTE],
  });
  const { data: attributeData } = useGetResourceQuery(
    {
      modelId: modelId,
      resourceIdentifier: currentAttributeId ?? '',
      applicationProfile,
    },
    {
      skip: typeof currentAttributeId === 'undefined',
    }
  );

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  useEffect(() => {
    if (
      globalSelected.type === 'attributes' &&
      currentAttributeId !== globalSelected.id
    ) {
      setCurrentAttributeId(globalSelected.id);
    }
  }, [globalSelected, currentAttributeId]);

  const handleFollowUp = (value?: { label: string; uri: string }) => {
    dispatch(
      initializeResource(ResourceType.ATTRIBUTE, languages, value?.label)
    );
    setView('form');

    if (isEdit) {
      setIsEdit(false);
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleFormReturn = () => {
    setView('list');
    dispatch(resetResource());
    refetch();

    if (isEdit) {
      setIsEdit(false);
    }
  };

  const handleShowAttribute = (id: string) => {
    setView('info');
    setCurrentAttributeId(id);
    router.replace(`${modelId}/attribute/${id}`);
  };

  const handleFormFollowUp = (id: string) => {
    handleShowAttribute(id);
    refetch();
  };

  const handleEdit = () => {
    if (attributeData) {
      setView('form');
      dispatch(setResource(resourceToResourceFormType(attributeData)));
      setIsEdit(true);
    }
  };

  return (
    <>
      {renderListing()}
      {renderForm()}
      {renderAttribute()}
    </>
  );

  function renderListing() {
    if (view !== 'list') {
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
        terminologies={terminologies}
        isEdit={isEdit}
        applicationProfile={applicationProfile}
      />
    );
  }

  function renderAttribute() {
    if (view !== 'info') {
      return <></>;
    }

    return (
      <CommonView
        data={attributeData}
        modelId={modelId}
        handleReturn={handleFormReturn}
        handleEdit={handleEdit}
      />
    );
  }
}
