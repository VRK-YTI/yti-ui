import DrawerItemList from '@app/common/components/drawer-item-list';
import {
  selectResourceView,
  selectSelected,
  setSelected,
  setView,
} from '@app/common/components/model/model.slice';
import { useQueryInternalResourcesQuery } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import HasPermission from '@app/common/utils/has-permission';
import { useStoreDispatch } from '@app/store';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, SearchInput, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import { DetachedPagination } from 'yti-common-ui/pagination';
import { useGetResourceQuery } from '@app/common/components/resource/resource.slice';
import { getResourceInfo } from '@app/common/utils/parse-slug';
import ResourceInfo from './resource-info/index';

interface ResourceViewProps {
  modelId: string;
  type: ResourceType;
}

export default function ResourceView({ modelId, type }: ResourceViewProps) {
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
  const router = useRouter();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [currentResourceId, setCurrentResourceId] = useState<
    string | undefined
  >(
    getResourceInfo(router.query.slug)?.type === type.toString().toLowerCase()
      ? getResourceInfo(router.query.slug)?.id
      : undefined
  );

  const { data, refetch } = useQueryInternalResourcesQuery({
    query: query ?? '',
    limitToDataModel: modelId,
    pageSize: 20,
    pageFrom: (currentPage - 1) * 20,
    resourceTypes: [type],
  });

  const { data: resourceData } = useGetResourceQuery(
    {
      modelId: modelId,
      resourceIdentifier: currentResourceId ?? '',
    },
    {
      skip: typeof currentResourceId === 'undefined',
    }
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleShowResource = (id: string) => {
    dispatch(
      setView(
        type === ResourceType.ASSOCIATION ? 'associations' : 'attributes',
        'info'
      )
    );
    dispatch(
      setSelected(
        id,
        type === ResourceType.ASSOCIATION ? 'associations' : 'attributes'
      )
    );
    router.replace(
      `${modelId}/${
        type === ResourceType.ASSOCIATION ? 'associations' : 'attributes'
      }/${id}`
    );
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  useEffect(() => {
    if (
      type === ResourceType.ASSOCIATION
        ? globalSelected.type === 'associations'
        : globalSelected.type === 'attributes' &&
          currentResourceId !== globalSelected.id
    ) {
      setCurrentResourceId(globalSelected.id);
    }
  }, [globalSelected, currentResourceId, type]);

  return (
    <>
      {renderList()}
      {renderInfo()}
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
              {/* {t('attribute-count-title', {
                  count: data?.totalHitCount ?? 0,
                })} */}
              {type.toString() + ' ' + data?.totalHitCount ?? 0}
            </Text>
            {hasPermission && <Button>Placeholder button</Button>}
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
                onClick: () => handleShowResource(item.identifier),
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

  function renderInfo() {
    if (!view.info || !resourceData) {
      return <></>;
    }

    return (
      <ResourceInfo
        data={resourceData}
        modelId={modelId}
        handleEdit={() => null}
        handleReturn={() => null}
      />
    );
  }
}
