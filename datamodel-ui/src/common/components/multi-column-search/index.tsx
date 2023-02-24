import { translateStatus } from '@app/common/utils/translation-helpers';
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

/**
 * Sivujen ikonit 85px kork
 * sivujen nimien loppuun ... jos menee yli
 * Sivujen nimet pois mobiilissa
 * Kaavion valinta näkyviin mobiilissa
 *
 * kuviin ja tekstiin enemmän väliä
 *
 *
 * Mobiilissa yläpalkki piiloon scrollatessa
 *
 *
 * Lisää viittaus sanastoihin värin alphaa 50%
 *
 *
 * Mobiili
 * - Etusivu
 * - Tietoa palvelusta
 * - Kielet
 *
 *
 * Menusta kirjaudu sisään pois jos kirjautunut
 */

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
  results: ResultType[];
  selectedId?: string;
  setSelectedId: (value: string) => void;
  searchParams: InternalClassesSearchParams;
  setSearchParams: (value: InternalClassesSearchParams) => void;
  languageVersioned?: boolean;
}

export default function MultiColumnSearch({
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
      labelText: 'Tähän tietomalliin lisätyt tietomallit',
      uniqueItemId: 'this',
    },
  ]);
  const [statuses] = useState<SingleSelectData[]>(
    statusList.map((status) => ({
      labelText: translateStatus(status, t),
      uniqueItemId: status,
    }))
  );

  const serviceCategories: SingleSelectData[] = useMemo(() => {
    if (!serviceCategoriesIsSuccess) {
      return [];
    }

    const returnValue = [
      {
        labelText: 'Kaikki tietoalueet',
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
  }, [serviceCategoriesResult, i18n.language, serviceCategoriesIsSuccess]);

  const handleRadioButtonClick = (id: string) => {
    setSelectedId(id);
  };

  const handleSearchChange = (
    key: keyof InternalClassesSearchParams,
    value: typeof searchParams[keyof InternalClassesSearchParams]
  ) => {
    if (key === 'groups' && isEqual(value, ['-1'])) {
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
          clearButtonLabel=""
          labelText="Haku"
          searchButtonLabel=""
          visualPlaceholder="Hae nimellä"
          defaultValue={searchParams.query}
          onChange={(e) => handleSearchChange('query', e?.toString() ?? '')}
          debounce={300}
        />
        <SingleSelect
          className="wider"
          labelText="Tietomalli"
          itemAdditionHelpText=""
          ariaOptionsAvailableText=""
          clearButtonLabel=""
          defaultSelectedItem={dataModelType.find(
            (type) => type.uniqueItemId === 'this'
          )}
          items={dataModelType}
        />
        <SingleSelect
          labelText="Tietoalue"
          itemAdditionHelpText=""
          ariaOptionsAvailableText=""
          clearButtonLabel=""
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
          labelText="Tila"
          itemAdditionHelpText=""
          ariaOptionsAvailableText=""
          clearButtonLabel=""
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
            labelText="Sisällön kieli"
            itemAdditionHelpText=""
            ariaOptionsAvailableText=""
            clearButtonLabel=""
            items={[{ labelText: 'Suomi', uniqueItemId: 'fi' }]}
          />
        )}
      </SearchToolsBlock>

      <ResultsTable cellSpacing={0}>
        <tbody>
          <tr>
            <td>
              <Text variant="bold">Luokan nimi</Text>
            </td>
            <td>
              <Text variant="bold">Tietomalli</Text>
            </td>
            <td>
              <Text variant="bold">Käsite</Text>
            </td>
            <td>
              <Text variant="bold">Muokattu</Text>
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
                  <ExternalLink href={result.target.link} labelNewWindow="">
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
                  <ExternalLink href={result.subClass.link} labelNewWindow="">
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
