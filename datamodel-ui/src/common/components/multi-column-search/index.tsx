import { translateLanguage } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  SearchInput,
  SingleSelect,
  SingleSelectData,
} from 'suomifi-ui-components';
import { SearchToolsBlock } from './multi-column-search.styles';
import { useGetServiceCategoriesQuery } from '../service-categories/service-categories.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { isEqual } from 'lodash';
import { InternalResourcesSearchParams } from '../search-internal-resources/search-internal-resources.slice';
import { Status } from 'yti-common-ui/interfaces/status.interface';
import ResourceList, { ResultType } from '../resource-list';
import { DetachedPagination } from 'yti-common-ui/pagination';

interface MultiColumnSearchProps {
  primaryColumnName: string;
  result: {
    totalHitCount?: number;
    items: ResultType[];
  };
  selectedId?: string;
  setSelectedId: (value: string) => void;
  searchParams: InternalResourcesSearchParams;
  setSearchParams: (value: InternalResourcesSearchParams) => void;
  setContentLanguage: (value: string) => void;
  languageVersioned?: boolean;
  applicationProfile?: boolean;
  modelId: string;
}

export default function MultiColumnSearch({
  primaryColumnName,
  result,
  selectedId,
  setSelectedId,
  searchParams,
  setSearchParams,
  setContentLanguage,
  languageVersioned,
  modelId,
  applicationProfile,
}: MultiColumnSearchProps) {
  const { t, i18n } = useTranslation('admin');
  const {
    data: serviceCategoriesResult,
    isSuccess: serviceCategoriesIsSuccess,
  } = useGetServiceCategoriesQuery(i18n.language);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataModelType] = useState<SingleSelectData[]>([
    {
      labelText: t('data-models-added-to-this-model'),
      uniqueItemId: 'self',
    },
    {
      labelText: t('datamodels-all', { ns: 'common' }),
      uniqueItemId: 'all',
    },
  ]);
  const [languages] = useState<SingleSelectData[]>([
    { labelText: translateLanguage('fi', t), uniqueItemId: 'fi' },
    { labelText: translateLanguage('sv', t), uniqueItemId: 'sv' },
    { labelText: translateLanguage('en', t), uniqueItemId: 'en' },
  ]);

  const statuses: SingleSelectData[] = [
    {
      labelText: t('status-all'),
      uniqueItemId: '-1',
    },
    {
      labelText: t('statuses-in-use'),
      uniqueItemId: 'in-use',
    },
    {
      labelText: t('statuses-not-in-use'),
      uniqueItemId: 'not-in-use',
    },
  ];

  const serviceCategories: SingleSelectData[] = useMemo(() => {
    if (!serviceCategoriesIsSuccess) {
      return [];
    }

    const returnValue = [
      {
        labelText: t('information-domains-all'),
        uniqueItemId: '-1',
      },
    ];

    return returnValue.concat(
      serviceCategoriesResult.map((result) => ({
        labelText: getLanguageVersion({
          data: result.label,
          lang: i18n.language,
        }),
        uniqueItemId: result.identifier,
      }))
    );
  }, [serviceCategoriesResult, serviceCategoriesIsSuccess, t, i18n.language]);

  const handleRadioButtonClick = (id: string | string[]) => {
    const targetId = Array.isArray(id) ? id[0] : id;
    setSelectedId(selectedId === targetId ? '' : targetId);
  };

  const handleAvailableDataModelsChange = (value: string | null) => {
    if (value === 'self') {
      setSearchParams({
        ...searchParams,
        ['limitToDataModel']: modelId,
        ['fromAddedNamespaces']: true,
        pageFrom: 0,
      });
    } else {
      setSearchParams({
        ...searchParams,
        ['limitToDataModel']: '',
        ['fromAddedNamespaces']: false,
        pageFrom: 0,
      });
    }

    setCurrentPage(1);
  };

  const handleSearchChange = (
    key: keyof InternalResourcesSearchParams,
    value: typeof searchParams[keyof InternalResourcesSearchParams]
  ) => {
    if (key === 'groups' && isEqual(value, ['-1'])) {
      setSearchParams({ ...searchParams, [key]: [] });
      return;
    }

    if (key === 'status') {
      const setStatuses =
        value !== '-1'
          ? value === 'in-use'
            ? (['VALID', 'DRAFT'] as Status[])
            : (['INCOMPLETE', 'INVALID', 'RETIRED', 'SUPERSEDED'] as Status[])
          : [];

      setSearchParams({
        ...searchParams,
        [key]: setStatuses,
        pageFrom: 0,
      });

      return;
    }

    setSearchParams({ ...searchParams, [key]: value, pageFrom: 0 });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ ...searchParams, pageFrom: (page - 1) * 2 });
  };

  return (
    <div>
      {applicationProfile && (
        <div style={{ marginBottom: '20px' }}>
          <SearchInput
            className="wider"
            clearButtonLabel={t('clear-keyword-filter')}
            labelText={t('search', { ns: 'common' })}
            labelMode="hidden"
            searchButtonLabel={t('search-by-keyword', { ns: 'common' })}
            visualPlaceholder={t('search-by-keyword', { ns: 'common' })}
            defaultValue={searchParams.query}
            onChange={(e) => handleSearchChange('query', e?.toString() ?? '')}
            debounce={300}
            id="search-input"
          />
        </div>
      )}
      <SearchToolsBlock>
        {!applicationProfile && (
          <SearchInput
            className="wider"
            clearButtonLabel={t('clear-keyword-filter')}
            labelText={t('search', { ns: 'common' })}
            searchButtonLabel={t('search-by-keyword', { ns: 'common' })}
            visualPlaceholder={t('search-by-keyword', { ns: 'common' })}
            defaultValue={searchParams.query}
            onChange={(e) => handleSearchChange('query', e?.toString() ?? '')}
            debounce={300}
            id="search-input"
          />
        )}

        {applicationProfile && (
          <Dropdown
            className="data-model-type-picker"
            labelText={t('datamodel-type')}
            defaultValue={'LIBRARY'}
            onChange={(e) => {
              handleSearchChange('limitToModelType', e);
            }}
            id="data-model-type-picker"
          >
            <DropdownItem value={'LIBRARY'}>
              {t('library', { ns: 'common' })}
            </DropdownItem>
            <DropdownItem value={'PROFILE'}>
              {t('profile', { ns: 'common' })}
            </DropdownItem>
          </Dropdown>
        )}

        <Dropdown
          className="data-model-picker"
          labelText={t('data-model')}
          defaultValue="self"
          onChange={(item) => {
            handleAvailableDataModelsChange(item);
          }}
          id="data-model-picker"
        >
          {dataModelType.map((type) => (
            <DropdownItem key={type.uniqueItemId} value={type.uniqueItemId}>
              {type.labelText}
            </DropdownItem>
          ))}
        </Dropdown>

        <SingleSelect
          labelText={t('information-domain')}
          itemAdditionHelpText=""
          ariaOptionsAvailableText={
            t('information-domains-available') as string
          }
          clearButtonLabel={t('clear-selection')}
          defaultSelectedItem={serviceCategories.find(
            (category) => category.uniqueItemId === '-1'
          )}
          onItemSelect={(e) =>
            handleSearchChange(
              'groups',
              e !== null && e !== '-1' ? [e] : ['-1']
            )
          }
          selectedItem={serviceCategories.find((category) =>
            searchParams.groups && searchParams.groups.length > 0
              ? category.uniqueItemId === searchParams.groups[0]
              : category.uniqueItemId === '-1'
          )}
          items={serviceCategories}
          id="information-domain-picker"
        />

        <Dropdown
          labelText={t('status')}
          defaultValue={'in-use'}
          onChange={(e) => handleSearchChange('status', e)}
          className="status-picker"
          id="status-picker"
        >
          {statuses.map((status) => (
            <DropdownItem key={status.uniqueItemId} value={status.uniqueItemId}>
              {status.labelText}
            </DropdownItem>
          ))}
        </Dropdown>

        {languageVersioned && (
          <Dropdown
            labelText={t('content-language')}
            defaultValue={
              languages.find(
                (lang) => lang.uniqueItemId === i18n.language ?? 'fi'
              )?.uniqueItemId ?? 'fi'
            }
            onChange={setContentLanguage}
            id="content-language-picker"
          >
            {languages.map((lang) => (
              <DropdownItem key={lang.uniqueItemId} value={lang.uniqueItemId}>
                {lang.labelText}
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </SearchToolsBlock>

      <ResourceList
        primaryColumnName={primaryColumnName}
        items={result.items}
        selected={selectedId}
        handleClick={handleRadioButtonClick}
        serviceCategories={serviceCategoriesResult}
      />

      <DetachedPagination
        currentPage={currentPage}
        maxPages={Math.ceil((result.totalHitCount ?? 0) / 20)}
        maxTotal={20}
        setCurrentPage={(number) => handlePageChange(number)}
      />
    </div>
  );
}
