import {
  Heading, Pagination,
  Paragraph,
  RouterLink,
  SearchInput
} from 'suomifi-ui-components';
import { IconLinkExternal } from 'suomifi-icons';
import { useTranslation } from 'next-i18next';
import { DataType } from '@app/common/interfaces/data-type.interface';
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
import { usePatchDataTypeMutation } from '@app/common/components/schema/schema.slice';
import Tooltip from '@mui/material/Tooltip';
import { useStoreDispatch } from '@app/store';
import { useSelector } from 'react-redux';
import {
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
  const { query: queryRoute } = useRouter();
  const schemaId = (queryRoute?.pid ?? [''])[0];
  const [patchDataType] = usePatchDataTypeMutation();
  // ToDo: When backend exists, implement api call
  // const { data, isSuccess } = useGetTypesSearchResultsQuery(
  //   { query, page: currentPage, pageSize },
  //   { skip }
  // );
  const lastPage = hitCount ? Math.ceil(hitCount / pageSize) : 0;

  const handleInputChange = (value: string) => {
    // Skip the api call to the registry until the search query has 3 characters
    if (value.length < 3) {
      setSkip(true);
      dispatch(setQuery(value));
      return;
    }
    dispatch(setQuery(value));
    setSkip(false);
    // ToDo: Make an api call to the back end with the query to get data types (when back end is ready)
    // Include pagination in the implementation
  };

  const handleUseButtonClick = (dataType: string) => {
    const trimmedId = nodeId?.substring(5);
    const target = `${schemaId}#${trimmedId}`;
    patchDataType({ schemaId, target, dataType });
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

  useEffect(() => {
    const mockResults: DataType[] = [
      {
        aliases: [],
        authors: [],
        content: {
          Identifier: '21.T11969/b415e16fbe4ca40f2270',
          Schema: {
            Properties: [
              {
                Property: 'String Enum',
                Value: [
                  'climatologyMeteorologyAtmosphere',
                  'oceans',
                  'society',
                  'economy',
                  'environment',
                  'transportation',
                  'geoscientificInformation',
                  'space physics',
                  '',
                ],
              },
            ],
            Type: 'Enum',
          },
          description:
            'INSPIRE topic category (see http://inspire.ec.europa.eu/metadata-codelist/TopicCategory)',
          name: 'topic',
          provenance: {
            creationDate: '2024-05-24T13:34:39.097Z',
            lastModificationDate: '2024-05-24T13:34:39.097Z',
          },
          versioning: { version: '0.1' },
        },
        date: 1716508800,
        description:
          'INSPIRE topic category (see http://inspire.ec.europa.eu/metadata-codelist/TopicCategory)',
        fundamentalType: 'Enum',
        id: '21.T11969/b415e16fbe4ca40f2270',
        name: 'topic',
        origin: 'Typeregistry-EOSC',
        style: 'eosc',
        taxonomies: [],
        type: 'BasicInfoType',
        unit: 'None',
      },
      {
        aliases: [],
        authors: [],
        content: {
          Identifier: '21.T11969/50c9e3dd19460ed72a07',
          Schema: {
            Type: 'Array',
            minItems: 1,
            subCond: '21.T11969/6d2c84af313b862f1b18',
            unique: true,
          },
          name: 'titles',
          provenance: {
            creationDate: '2024-05-20T21:23:20.332Z',
            lastModificationDate: '2024-05-21T12:38:22.862Z',
          },
        },
        date: 1716163200,
        description: '',
        fundamentalType: 'Array',
        id: '21.T11969/50c9e3dd19460ed72a07',
        name: 'titles',
        origin: 'Typeregistry-EOSC',
        style: 'eosc',
        taxonomies: [],
        type: 'InfoType',
        unit: 'None',
      },
      {
        aliases: [],
        authors: [],
        content: {
          Identifier: '21.T11969/984816fd329622876e14',
          Schema: {
            Properties: [{ Property: 'minLength', Value: 0 }],
            Type: 'String',
          },
          name: 'TEST',
          provenance: {
            creationDate: '2024-05-14T13:19:16.364Z',
            lastModificationDate: '2024-05-14T13:19:16.364Z',
          },
        },
        date: 1715644800,
        description: '',
        fundamentalType: 'String',
        id: '21.T11969/984816fd329622876e14',
        name: 'TEST',
        origin: 'Typeregistry-EOSC',
        style: 'eosc',
        taxonomies: [],
        type: 'BasicInfoType',
        unit: 'None',
      },
      {
        aliases: [],
        authors: [],
        content: {
          Identifier: '21.T11969/3c6de1b7dd91465d437e',
          Schema: {
            Properties: [
              { Property: 'minLength', Value: 1 },
              { Property: 'maxLength', Value: 550 },
            ],
            Type: 'String',
          },
          name: 'title',
          provenance: {
            creationDate: '2024-05-14T08:56:12.340Z',
            lastModificationDate: '2024-05-14T08:56:12.340Z',
          },
        },
        date: 1715644800,
        description: '',
        fundamentalType: 'String',
        id: '21.T11969/3c6de1b7dd91465d437e',
        name: 'title',
        origin: 'Typeregistry-EOSC',
        style: 'eosc',
        taxonomies: [],
        type: 'BasicInfoType',
        unit: 'None',
      },
      {
        id: '1234',
        name: 'fake',
        description: 'woah',
        origin: 'hat',
      },
      {
        id: '7654',
        name: 'fake1',
        description: '',
        origin: 'hat',
      },
      {
        id: '34567',
        name: 'fake2',
        description: 'wheeeeee',
        origin: 'hat',
      },
      {
        id: '09876',
        name: 'fake3',
        description: '',
        origin: 'hat',
      },
      {
        id: '780',
        name: 'fake4',
        description: '',
        origin: 'hat',
      },
      {
        id: '765432',
        name: 'fake5',
        description: '',
        origin: 'hat',
      },
    ];
    if (!skip) {
      dispatch(setResults(mockResults));
      dispatch(setHitCount(mockResults.length));
    }
  }, [dispatch, skip]);

  return (
    <TypeSelectorWrapper>
      {/*ToDo: Remove this disclaimer when it's no longer relevant*/}
      This is a mock implementation of the type search
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
        {query.length !== 0 && results && (
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
