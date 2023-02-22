import { useTranslation } from 'next-i18next';
import {
  ExternalLink,
  Icon,
  RadioButton,
  SearchInput,
  SingleSelect,
  Text,
} from 'suomifi-ui-components';
import {
  ResultsTable,
  SearchToolsBlock,
  StatusChip,
} from './multi-column-search.styles';

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
  languageVersioned?: boolean;
}

export default function MultiColumnSearch({
  results,
  selectedId,
  setSelectedId,
  languageVersioned,
}: MultiColumnSearchProps) {
  const { i18n } = useTranslation('admin');

  const handleRadioButtonClick = (id: string) => {
    setSelectedId(id);
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
        />
        <SingleSelect
          className="wider"
          labelText="Tietomalli"
          itemAdditionHelpText=""
          ariaOptionsAvailableText=""
          clearButtonLabel=""
          items={[
            {
              labelText: 'test1',
              uniqueItemId: '1',
            },
          ]}
        />
        <SingleSelect
          labelText="Tietoalue"
          itemAdditionHelpText=""
          ariaOptionsAvailableText=""
          clearButtonLabel=""
          items={[
            {
              labelText: 'test1',
              uniqueItemId: '1',
            },
          ]}
        />
        <SingleSelect
          labelText="Tila"
          itemAdditionHelpText=""
          ariaOptionsAvailableText=""
          clearButtonLabel=""
          items={[
            {
              labelText: 'test1',
              uniqueItemId: '1',
            },
          ]}
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
