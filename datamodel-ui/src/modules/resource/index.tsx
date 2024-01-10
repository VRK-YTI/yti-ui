import DrawerItemList from '@app/common/components/drawer-item-list';
import {
  resetHighlighted,
  resetHovered,
  resetSelected,
  selectDisplayLang,
  selectResourceView,
  selectSelected,
  setHighlighted,
  setHovered,
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
  useGetResourceActiveQuery,
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
import { useReactFlow } from 'reactflow';
import getConnectedElements from '../graph/utils/get-connected-elements';
import { UriData } from '@app/common/interfaces/uri.interface';
import ResourceError from '@app/common/components/resource-error';
import { SUOMI_FI_NAMESPACE } from '@app/common/utils/get-value';

interface ResourceViewProps {
  modelId: string;
  version?: string;
  type: ResourceType;
  languages: string[];
  terminologies: string[];
  applicationProfile?: boolean;
  organizationIds?: string[];
}

export default function ResourceView({
  modelId,
  version,
  type,
  languages,
  terminologies,
  applicationProfile,
  organizationIds,
}: ResourceViewProps) {
  const { t, i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const hasPermission = HasPermission({
    actions: ['CREATE_ATTRIBUTE'],
    targetOrganization: organizationIds,
  });
  const globalSelected = useSelector(selectSelected());
  const view = useSelector(
    selectResourceView(
      type === ResourceType.ASSOCIATION ? 'associations' : 'attributes'
    )
  );
  const ref = useRef<HTMLDivElement>(null);
  const { setView } = useSetView();
  const { setPage, getPage } = useSetPage();
  const { getNodes, getEdges } = useReactFlow();
  const displayLang = useSelector(selectDisplayLang());
  const [headerHeight, setHeaderHeight] = useState(hasPermission ? 112 : 97);
  const [currentPage, setCurrentPage] = useState(getPage());
  const [query, setQuery] = useState('');

  const { data, refetch } = useQueryInternalResourcesQuery({
    query: query ?? '',
    limitToDataModel: modelId,
    pageSize: 20,
    pageFrom: (currentPage - 1) * 20,
    resourceTypes: [type],
    fromVersion: version,
  });

  const {
    data: resourceData,
    refetch: refetchResource,
    isError: resourceIsError,
  } = useGetResourceQuery(
    {
      modelId: globalSelected.modelId ?? modelId,
      resourceIdentifier: globalSelected.id ?? '',
      applicationProfile,
      version: globalSelected.version ?? version,
    },
    {
      skip:
        !['associations', 'attributes'].includes(globalSelected.type) ||
        !globalSelected.id,
    }
  );

  const { data: inUse, refetch: refetchInUse } = useGetResourceActiveQuery(
    {
      prefix: modelId,
      uri: `${SUOMI_FI_NAMESPACE}${globalSelected.modelId}/${globalSelected.id}`,
      version: version,
    },
    {
      skip:
        !globalSelected.id || !globalSelected.modelId || !applicationProfile,
    }
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleShowResource = (id: string, modelPrefix: string) => {
    dispatch(
      setSelected(
        id,
        type === ResourceType.ASSOCIATION ? 'associations' : 'attributes',
        modelPrefix
      )
    );
    setView(
      type === ResourceType.ASSOCIATION ? 'associations' : 'attributes',
      'info',
      modelPrefix !== modelId ? `${modelPrefix}:${id}` : id
    );
  };

  const handleResourceHover = (id?: string, modelPrefix?: string) => {
    if (!id || !modelPrefix) {
      dispatch(resetHovered());

      if (type === ResourceType.ASSOCIATION) {
        dispatch(resetHighlighted());
      }
      return;
    }

    dispatch(
      setHovered(
        id,
        type === ResourceType.ASSOCIATION ? 'associations' : 'attributes'
      )
    );

    if (type === ResourceType.ASSOCIATION) {
      const targetEdge = getEdges().find((edge) => edge.data.identifier === id);

      if (!targetEdge) {
        return;
      }

      dispatch(
        setHighlighted(getConnectedElements(targetEdge, getNodes(), getEdges()))
      );
    }
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

  const handleFollowUp = (value?: UriData) => {
    dispatch(initializeResource(type, value, applicationProfile));

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

            {!version && hasPermission && (
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
          {!data || (query === '' && data?.totalHitCount < 1) ? (
            <Text>
              {type === 'ASSOCIATION'
                ? t('datamodel-no-associations')
                : t('datamodel-no-attributes')}
            </Text>
          ) : query !== '' && data?.totalHitCount < 1 ? (
            <Text>{t('no-results')}</Text>
          ) : (
            <DrawerItemList
              items={data.responseObjects.map((item) => {
                return {
                  label: getLanguageVersion({
                    data: item.label,
                    lang: displayLang ?? i18n.language,
                    appendLocale: true,
                  }),
                  subtitle: item.curie,
                  onClick: () =>
                    handleShowResource(
                      item.identifier,
                      item.curie.split(':')[0]
                    ),
                  onMouseEnter: () =>
                    handleResourceHover(
                      item.identifier,
                      item.curie.split(':')[0]
                    ),
                  onMouseLeave: () => handleResourceHover(),
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
    if (!view.info) {
      return <></>;
    }

    if (resourceIsError) {
      return <ResourceError handleReturn={handleReturn} />;
    }

    return (
      <ResourceInfo
        data={resourceData}
        inUse={inUse}
        modelId={globalSelected.modelId ?? modelId}
        handleEdit={handleEdit}
        handleReturn={handleReturn}
        handleShowResource={handleShowResource}
        handleRefetch={refetchInUse}
        isPartOfCurrentModel={globalSelected.modelId === modelId}
        applicationProfile={applicationProfile}
        currentModelId={
          globalSelected.modelId !== modelId ? modelId : undefined
        }
        disableEdit={version ? true : false}
        organizationIds={organizationIds}
      />
    );
  }

  function renderEdit() {
    if ((!view.edit && !view.create) || !hasPermission) {
      return <></>;
    }

    return (
      <ResourceForm
        modelId={globalSelected.modelId ?? modelId}
        languages={languages}
        terminologies={terminologies}
        applicationProfile={applicationProfile}
        currentModelId={modelId}
        isEdit={view.edit}
        refetch={() => {
          refetchResource();
          refetchInUse();
        }}
        handleReturn={view.edit ? handleFormReturn : handleReturn}
      />
    );
  }
}
