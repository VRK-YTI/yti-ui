import DrawerItemList from '@app/common/components/drawer-item-list';
import {
  ViewList,
  resetHovered,
  selectDisplayLang,
  setHovered,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useQueryInternalResourcesQuery } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { getPrefixFromURI } from '@app/common/utils/get-value';
import useSetPage from '@app/common/utils/hooks/use-set-page';
import useSetView from '@app/common/utils/hooks/use-set-view';
import { translateResourceType } from '@app/common/utils/translation-helpers';
import { useStoreDispatch } from '@app/store';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SearchInput, Text } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import { DetachedPagination } from 'yti-common-ui/pagination';

export default function SearchView({ modelId }: { modelId: string }) {
  const { t, i18n } = useTranslation('common');
  const ref = useRef<HTMLDivElement>(null);
  const { setView } = useSetView();
  const { setPage, getPage } = useSetPage();
  const dispatch = useStoreDispatch();
  const displayLang = useSelector(selectDisplayLang());
  const [headerHeight, setHeaderHeight] = useState(0);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(getPage());

  const { data } = useQueryInternalResourcesQuery({
    query: query ?? '',
    limitToDataModel: modelId,
    pageSize: 20,
    pageFrom: (currentPage - 1) * 20,
    resourceTypes: [],
  });
  const router = useRouter();

  const getResourceType = (type: ResourceType): keyof ViewList => {
    switch (type) {
      case ResourceType.ASSOCIATION:
        return 'associations';
      case ResourceType.ATTRIBUTE:
        return 'attributes';
      default:
        return 'classes';
    }
  };

  const handleItemClick = (data: InternalClass) => {
    const resourceModelId = getPrefixFromURI(data.namespace);

    setView(getResourceType(data.resourceType), 'info');
    dispatch(
      setSelected(
        data.identifier,
        getResourceType(data.resourceType),
        resourceModelId
      )
    );
    router.replace({
      pathname: `${modelId}/${data.resourceType.toLowerCase()}/${
        resourceModelId !== modelId ? `${resourceModelId}:` : ''
      }${data.identifier}`,
      query: {
        lang: Array.isArray(router.query.lang)
          ? router.query.lang[0]
          : router.query.lang,
      },
    });
  };

  const handleQueryChange = (e: string) => {
    setQuery(e);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <>
      <StaticHeader ref={ref}>
        <div>
          <SearchInput
            labelText={t('search-from-model')}
            clearButtonLabel={t('clear-all-selections', { ns: 'admin' })}
            searchButtonLabel={t('search')}
            visualPlaceholder={`${t('search-variant')}...`}
            fullWidth
            onChange={(e) => handleQueryChange(e?.toString() ?? '')}
            debounce={500}
            id="model-search-input"
          />
        </div>
        <div>
          <Text smallScreen variant="bold">
            {t('search-results', { count: data?.totalHitCount ?? 0 })}
          </Text>
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight}>
        {data ? (
          <>
            <DrawerItemList
              items={data.responseObjects.map((item) => ({
                label: (
                  <>
                    {getLanguageVersion({
                      data: item.label,
                      lang: displayLang ?? i18n.language,
                      appendLocale: true,
                    })}{' '}
                    <Text smallScreen>
                      ({translateResourceType(item.resourceType, t)})
                    </Text>
                  </>
                ),
                subtitle: item.curie,
                onClick: () => handleItemClick(item),
                onMouseEnter: () => {
                  dispatch(
                    setHovered(
                      item.identifier,
                      getResourceType(item.resourceType)
                    )
                  );
                },
                onMouseLeave: () => {
                  dispatch(resetHovered());
                },
              }))}
            />

            <DetachedPagination
              currentPage={currentPage}
              maxPages={Math.ceil((data?.totalHitCount ?? 0) / 20)}
              maxTotal={20}
              setCurrentPage={(number) => {
                setCurrentPage(number);
                setPage(number);
              }}
            />
          </>
        ) : (
          <></>
        )}
      </DrawerContent>
    </>
  );
}
