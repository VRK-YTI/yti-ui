import {
  Heading, Pagination,
  Paragraph,
  RouterLink,
  SearchInput
} from 'suomifi-ui-components';
import { IconLinkExternal } from 'suomifi-icons';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  HeadingAndCountWrapper,
  InstructionParagraph,
  ResultButton,
  TypeInfoWrapper,
  TypeSearchResultWrapper,
  TypeSelectorWrapper,
} from '@app/common/components/schema-info/schema-tree/node-info/type-selector/type-selector.styles';
import { useGetTypesSearchResultsQuery, usePatchDataTypeMutation } from '@app/common/components/schema/schema.slice';
import Tooltip from '@mui/material/Tooltip';
import { useStoreDispatch } from '@app/store';
import { useSelector } from 'react-redux';
import {
  resetDataTypeSearch,
  selectHitCount, selectPage, selectPageSize, selectQuery,
  selectResults, setHitCount, setPage, setQuery, setResults
} from '@app/common/components/data-type-registry-search/data-type-registry-search.slice';

export default function TypeSelector({ nodeId }: { nodeId?: string }) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const results = useSelector(selectResults());
  const [skip, setSkip] = useState(true);
  const query = useSelector(selectQuery());
  const hitCount = useSelector(selectHitCount());
  const currentPage = useSelector(selectPage());
  const pageSize = useSelector(selectPageSize());
  const lastPage = hitCount ? Math.ceil(hitCount / pageSize) : 0;
  const { query: queryRoute } = useRouter();
  const schemaId = (queryRoute?.pid ?? [''])[0];
  const [patchDataType] = usePatchDataTypeMutation();
  const { data, isSuccess, isError } = useGetTypesSearchResultsQuery(
    { query, page: currentPage, pageSize },
    { skip }
  );

  useEffect(() => {
    if (isSuccess) {
      dispatch(setResults(data.hits.map((hit) => hit.document)));
      dispatch(setHitCount(data.found));
    } else if (isError) {
      dispatch(resetDataTypeSearch());
    }
  }, [data, dispatch, isError, isSuccess]);

  const handleInputChange = (value: string) => {
    dispatch(setPage(1));
    // Skip the api call to the registry until the search query has 3 characters
    if (value.length < 2) {
      setSkip(true);
      dispatch(setResults([]));
      dispatch(setQuery(value));
      dispatch(setHitCount(0));
      return;
    }
    dispatch(setQuery(value));
    setSkip(false);
  };

  const handleUseButtonClick = (dataType: string) => {
    if (nodeId && schemaId && schemaId !== '') {
      const trimmedId = nodeId?.substring(5);
      const target = `${nodeId}`;
      patchDataType({ schemaId, target, dataType });
    }
  };

  function dataTypeSearchResult(id: string, name: string, description: string) {
    return (
      <TypeSearchResultWrapper key={id}>
        <TypeInfoWrapper>
          <Heading variant={'h5'}>{name}</Heading>
          <Paragraph>{description}</Paragraph>
        </TypeInfoWrapper>
        <ResultButton
          variant={'secondaryNoBorder'}
          onClick={() => handleUseButtonClick(id)}
        >
          {t('node-info.use-button')}
        </ResultButton>
        <Tooltip
          title={t('node-info.link-to-type-registry')}
          placement="top-end"
        >
          <RouterLink href={'https://hdl.handle.net/' + id}>
            <IconLinkExternal />
          </RouterLink>
        </Tooltip>
      </TypeSearchResultWrapper>
    );
  }

  return (
    <TypeSelectorWrapper>
      <SearchInput
        labelText={t('node-info.type-search')}
        clearButtonLabel={t('clear-label')}
        searchButtonLabel={t('search-label')}
        labelMode={'hidden'}
        visualPlaceholder={t('node-info.type-to-search')}
        value={query}
        onChange={(value) => handleInputChange(value as string)}
        aria-controls={'results'}
      />
      <HeadingAndCountWrapper>
        <Heading variant={'h4'}>
          {t('node-info.type-search-results-title')}
        </Heading>
        <Paragraph aria-live={'polite'}>{t('node-info.found-results', { hitCount })}</Paragraph>
      </HeadingAndCountWrapper>
      <div id={'results'} aria-labelledby={'results-label'}>
        {query.length > 1 && results && results.length > 0 && (
          <>
            {results.map((result) => {
              return dataTypeSearchResult(
                result.id,
                result.name,
                result.description
              );
            })}
          </>
        )}
        {query.length === 0 && (
          <InstructionParagraph>
            {t('node-info.make-query-and-choose')}
          </InstructionParagraph>
        )}
        {query.length === 1 && (
          <InstructionParagraph>
            {t('node-info.make-longer-query')}
          </InstructionParagraph>
        )}
        {query.length > 1 && (!results || results.length == 0) && (
          <InstructionParagraph>
            {t('node-info.no-results')}
          </InstructionParagraph>
        )}
      </div>
      {hitCount > pageSize && (
        <Pagination
          aria-label={t('pagination.aria.label')}
          pageIndicatorText={(currentPage, lastPage) =>
            t('pagination.page') + ' ' + currentPage + ' / ' + lastPage
          }
          ariaPageIndicatorText={(currentPage, lastPage) =>
            t('pagination.aria.info', { currentPage, lastPage })
          }
          lastPage={lastPage}
          currentPage={currentPage}
          onChange={(e) => dispatch(setPage(+e))}
          nextButtonAriaLabel={t('pagination.aria.next')}
          previousButtonAriaLabel={t('pagination.aria.prev')}
          pageInput={false}
        />
      )}
    </TypeSelectorWrapper>
  );
}
