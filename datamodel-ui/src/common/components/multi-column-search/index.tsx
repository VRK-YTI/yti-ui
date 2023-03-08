import {
  translateLanguage,
  translateStatus,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import {
  ExternalLink,
  Icon,
  RadioButton,
  SearchInput,
  SingleSelect,
  SingleSelectData,
  Text,
} from 'suomifi-ui-components';
import { InternalClassesSearchParams } from '../search-internal-classes/search-internal-classes.slice';
import {
  ResultsTable,
  SearchToolsBlock,
  StatusChip,
} from './multi-column-search.styles';
import { statusList } from 'yti-common-ui/utils/status-list';
import { useGetServiceCategoriesQuery } from '../service-categories/service-categories.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { isEqual } from 'lodash';

export interface ResultType {
  target: {
    identifier: string;
    label: string;
    linkLabel: string;
    link: string;
    modified: string;
    status: string;
    isValid?: boolean;
  };
  partOf: {
    label: string;
    type: string;
    domains: string[];
  };
  subClass: {
    label: string;
    link: string;
    partOf: string;
  };
}

interface MultiColumnSearchProps {
  primaryColumnName: string;
  results: ResultType[];
  selectedId?: string;
  setSelectedId: (value: string) => void;
  searchParams: InternalClassesSearchParams;
  setSearchParams: (value: InternalClassesSearchParams) => void;
  languageVersioned?: boolean;
}

export default function MultiColumnSearch({
  primaryColumnName,
  results,
  selectedId,
  setSelectedId,
  searchParams,
  setSearchParams,
  languageVersioned,
}: MultiColumnSearchProps) {
  const { t, i18n } = useTranslation('admin');
  const {
    data: serviceCategoriesResult,
    isSuccess: serviceCategoriesIsSuccess,
  } = useGetServiceCategoriesQuery(i18n.language);
  const [dataModelType] = useState<SingleSelectData[]>([
    {
      labelText: t('data-models-added-to-this-model'),
      uniqueItemId: 'this',
    },
  ]);
  const [languages] = useState<SingleSelectData[]>([
    { labelText: translateLanguage('fi', t), uniqueItemId: 'fi' },
    { labelText: translateLanguage('sv', t), uniqueItemId: 'sv' },
    { labelText: translateLanguage('en', t), uniqueItemId: 'en' },
  ]);

  const statuses: SingleSelectData[] = useMemo(() => {
    const returnValue = [
      {
        labelText: t('status-all'),
        uniqueItemId: '-1',
      },
    ];

    return returnValue.concat(
      statusList.map((status) => ({
        labelText: translateStatus(status, t),
        uniqueItemId: status,
      }))
    );
  }, [t]);

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

  const handleRadioButtonClick = (id: string) => {
    setSelectedId(id);
  };

  const handleSearchChange = (
    key: keyof InternalClassesSearchParams,
    value: typeof searchParams[keyof InternalClassesSearchParams]
  ) => {
    if ((key === 'groups' || key === 'status') && isEqual(value, ['-1'])) {
      setSearchParams({ ...searchParams, [key]: [] });
      return;
    }
    setSearchParams({ ...searchParams, [key]: value });
  };

  return (
    <div>
      <SearchToolsBlock>
        <SearchInput
          className="wider"
          clearButtonLabel={t('clear-keyword-filter')}
          labelText={t('search', { ns: 'common' })}
          searchButtonLabel={t('search-by-keyword', { ns: 'common' })}
          visualPlaceholder={t('search-by-keyword', { ns: 'common' })}
          defaultValue={searchParams.query}
          onChange={(e) => handleSearchChange('query', e?.toString() ?? '')}
          debounce={300}
        />
        <SingleSelect
          className="wider"
          labelText={t('data-model')}
          itemAdditionHelpText=""
          ariaOptionsAvailableText={t('data-models-available')}
          clearButtonLabel={t('clear-selection')}
          defaultSelectedItem={dataModelType.find(
            (type) => type.uniqueItemId === 'this'
          )}
          items={dataModelType}
        />
        <SingleSelect
          labelText={t('information-domain')}
          itemAdditionHelpText=""
          ariaOptionsAvailableText={t('information-domains-available')}
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
        />
        <SingleSelect
          labelText={t('status')}
          itemAdditionHelpText=""
          ariaOptionsAvailableText={t('statuses-available')}
          clearButtonLabel={t('clear-selection')}
          selectedItem={
            searchParams.status && searchParams.status.length > 0
              ? statuses.find(
                  (status) => status.uniqueItemId === searchParams.status?.[0]
                )
              : statuses.find((status) => status.uniqueItemId === '-1')
          }
          items={statuses}
          onItemSelect={(e) =>
            handleSearchChange('status', e !== null ? [e] : [])
          }
        />
        {languageVersioned && (
          <SingleSelect
            labelText={t('content-language')}
            itemAdditionHelpText=""
            ariaOptionsAvailableText={t('content-languages-available')}
            clearButtonLabel={t('clear-selection')}
            defaultSelectedItem={languages.find(
              (lang) => lang.uniqueItemId === i18n.language ?? 'fi'
            )}
            items={languages}
          />
        )}
      </SearchToolsBlock>

      <ResultsTable cellSpacing={0}>
        <tbody>
          <tr>
            <td>
              <Text variant="bold">{primaryColumnName}</Text>
            </td>
            <td>
              <Text variant="bold">{t('data-model')}</Text>
            </td>
            <td>
              <Text variant="bold">{t('concept')}</Text>
            </td>
            <td>
              <Text variant="bold">{t('modified')}</Text>
            </td>
          </tr>

          {results.map((result) => (
            <tr key={`result-${result.target.identifier}`}>
              <td className="td-with-radio-button">
                <div>
                  <RadioButton
                    value={result.target.identifier}
                    checked={result.target.identifier === selectedId}
                    onChange={(e) => handleRadioButtonClick(e.target.value)}
                  />
                </div>
                <div>
                  {result.target.label}
                  <ExternalLink
                    href={result.target.link}
                    labelNewWindow={t('link-opens-new-window-external', {
                      ns: 'common',
                    })}
                  >
                    {result.target.linkLabel}
                  </ExternalLink>
                </div>
              </td>
              <td style={{ width: '40%' }}>
                <div>
                  <Text>{result.partOf.label}</Text>
                  <Text>
                    <Icon icon="calendar" /> {result.partOf.type}
                  </Text>
                  <Text>{result.partOf.domains.join(', ')}</Text>
                </div>
              </td>
              <td style={{ width: '20%' }}>
                <div>
                  <ExternalLink
                    href={result.subClass.link}
                    labelNewWindow={t('link-opens-new-window-external', {
                      ns: 'common',
                    })}
                  >
                    {result.subClass.label}
                  </ExternalLink>
                  <Text>{result.subClass.partOf}</Text>
                </div>
              </td>
              <td style={{ width: '15%' }}>
                <div>
                  <Text>{result.target.modified}</Text>
                  <StatusChip $isValid={result.target.isValid}>
                    {result.target.status}
                  </StatusChip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </ResultsTable>
    </div>
  );
}
