import DrawerItemList from '@app/common/components/drawer-item-list';
import {
  resetSelected,
  selectDisplayLang,
  selectResourceView,
  selectSelected,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useQueryInternalResourcesQuery } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import HasPermission from '@app/common/utils/has-permission';
import { useStoreDispatch } from '@app/store';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SearchInput, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import { DetachedPagination } from 'yti-common-ui/pagination';
import {
  initializeResource,
  resetResource,
  setResource,
  useGetResourceQuery,
} from '@app/common/components/resource/resource.slice';
import ResourceInfo from './resource-info/index';
import {
  translateCreateNewResource,
  translateCreateNewResourceForSelected,
  translateResourceCountTitle,
} from '@app/common/utils/translation-helpers';
import ResourceModal from './resource-modal';
import ResourceForm from './resource-form';
import { resourceToResourceFormType } from './utils';
import useSetView from '@app/common/utils/hooks/use-set-view';
import useSetPage from '@app/common/utils/hooks/use-set-page';

interface ResourceViewProps {
  modelId: string;
  type: ResourceType;
  languages: string[];
  terminologies: string[];
  applicationProfile?: boolean;
}

export default function ResourceView({
  modelId,
  type,
  languages,
  terminologies,
  applicationProfile,
}: ResourceViewProps) {
  const { t, i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const hasPermission = HasPermission({ actions: ['CREATE_ATTRIBUTE'] });
  const globalSelected = useSelector(selectSelected());
  const view = useSelector(
    selectResourceView(
      type === ResourceType.ASSOCIATION ? 'associations' : 'attributes'
    )
  );
  const ref = useRef<HTMLDivElement>(null);
  const { setView } = useSetView();
  const { setPage, getPage } = useSetPage();
  const displayLang = useSelector(selectDisplayLang());
  const [headerHeight, setHeaderHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(getPage());
  const [query, setQuery] = useState('');

  const { data, refetch } = useQueryInternalResourcesQuery({
    query: query ?? '',
    limitToDataModel: modelId,
    pageSize: 20,
    pageFrom: (currentPage - 1) * 20,
    resourceTypes: [type],
  });

  const { data: resourceData, refetch: refetchResource } = useGetResourceQuery(
    {
      modelId: globalSelected.modelId ?? modelId,
      resourceIdentifier: globalSelected.id ?? '',
      applicationProfile,
    },
    {
      skip:
        !['associations', 'attributes'].includes(globalSelected.type) ||
        !globalSelected.id,
    }
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleShowResource = (id: string, modelPrefix: string) => {
    setView(
      type === ResourceType.ASSOCIATION ? 'associations' : 'attributes',
      'info',
      id
    );
    dispatch(
      setSelected(
        id,
        type === ResourceType.ASSOCIATION ? 'associations' : 'attributes',
        modelPrefix
      )
    );
  };

  const handleReturn = () => {
    dispatch(resetSelected());
    setView(
      type === ResourceType.ASSOCIATION ? 'associations' : 'attributes',
      'list'
    );
    dispatch(resetResource());
    refetch();
  };

  const handleFormReturn = () => {
    setView(
      type === ResourceType.ASSOCIATION ? 'associations' : 'attributes',
      'info',
      globalSelected.id
    );
    dispatch(resetResource());
  };

  const handleFollowUp = (value?: { label: string; uri: string }) => {
    if (applicationProfile) {
      dispatch(
        initializeResource(
          type,
          languages,
          value
            ? {
                id: value.label,
                label: value.label,
                uri: value.uri,
              }
            : undefined,
          applicationProfile
        )
      );
    } else {
      dispatch(
        initializeResource(type, languages, value?.label, applicationProfile)
      );
    }

    setView(
      type === ResourceType.ASSOCIATION ? 'associations' : 'attributes',
      'create'
    );
  };

  const handleEdit = () => {
    if (resourceData) {
      setView(
        type === ResourceType.ASSOCIATION ? 'associations' : 'attributes',
        'edit'
      );
      dispatch(setResource(resourceToResourceFormType(resourceData)));
    }
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref, view]);

  return (
    <>
      {renderList()}
      {renderInfo()}
      {renderEdit()}
    </>
  );

  function renderList() {
    if (!view.list) {
      return <></>;
    }

    return (
      <>
        <StaticHeader ref={ref}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text variant="bold">
              {translateResourceCountTitle(type, t, data?.totalHitCount)}
            </Text>

            {hasPermission && (
              <ResourceModal
                modelId={modelId}
                type={type}
                buttonTranslations={
                  applicationProfile
                    ? {
                        useSelected:
                          type === ResourceType.ATTRIBUTE
                            ? t('create-new-attribute-constraint', {
                                ns: 'admin',
                              })
                            : t('create-new-association-constraint', {
                                ns: 'admin',
                              }),
                      }
                    : {
                        useSelected: translateCreateNewResourceForSelected(
                          type,
                          t
                        ),
                        createNew: translateCreateNewResource(type, t),
                      }
                }
                handleFollowUp={handleFollowUp}
                buttonIcon={true}
                applicationProfile={applicationProfile}
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
            id="search-input"
          />
        </StaticHeader>

        <DrawerContent height={headerHeight} spaced>
          {!data || data?.totalHitCount < 1 ? (
            <Text>{t('datamodel-no-attributes')}</Text>
          ) : (
            <DrawerItemList
              items={data.responseObjects.map((item) => {
                const prefix =
                  item.namespace?.split('/')?.filter(Boolean)?.pop() ?? modelId;
                return {
                  label: getLanguageVersion({
                    data: item.label,
                    lang: displayLang ?? i18n.language,
                    appendLocale: true,
                  }),
                  subtitle: `${prefix}:${item.identifier}`,
                  onClick: () => handleShowResource(item.identifier, prefix),
                };
              })}
            />
          )}

          <DetachedPagination
            currentPage={currentPage}
            maxPages={Math.ceil((data?.totalHitCount ?? 0) / 20)}
            maxTotal={20}
            setCurrentPage={(number) => {
              setCurrentPage(number);
              setPage(number);
            }}
          />
        </DrawerContent>
      </>
    );
  }

  function renderInfo() {
    if (!view.info || !resourceData) {
      return <></>;
    }
    return (
      <ResourceInfo
        data={resourceData}
        modelId={globalSelected.modelId ?? modelId}
        handleEdit={handleEdit}
        handleReturn={handleReturn}
        handleShowResource={handleShowResource}
        isPartOfCurrentModel={globalSelected.modelId === modelId}
        applicationProfile={applicationProfile}
        currentModelId={
          globalSelected.modelId !== modelId ? modelId : undefined
        }
      />
    );
  }

  function renderEdit() {
    if ((!view.edit && !view.create) || !hasPermission) {
      return <></>;
    }

    return (
      <ResourceForm
        type={type}
        modelId={modelId}
        languages={languages}
        terminologies={terminologies}
        applicationProfile={applicationProfile}
        isEdit={view.edit}
        refetch={refetchResource}
        handleReturn={view.edit ? handleFormReturn : handleReturn}
      />
    );
  }
}
