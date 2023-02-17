import { Status } from 'interfaces/status.interface';
import { useState } from 'react';
import {
  ExternalLink,
  Icon,
  RadioButton,
  SearchInput,
  SingleSelect,
  Text,
} from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query';
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

type Params = {
  keyword: string | null;
  dataModel: string | null;
  infoDomain: string | null;
  status: Status | null;
};

interface MultiColumnSearchProps {
  selected?: string;
  setSelected: (value: string) => void;
  languageVersioned?: boolean;
}

export default function MultiColumnSearch({
  selected,
  setSelected,
  languageVersioned,
}: MultiColumnSearchProps) {
  const { isSmall } = useBreakpoints();
  const [params, setParams] = useState<Params>({
    keyword: '',
    dataModel: null,
    infoDomain: null,
    status: null,
  });
  const [results, setResults] = useState([
    {
      id: '1',
      title: 'Aikaväli',
    },
    {
      id: '2',
      title: 'Ajanjakso',
    },
  ]);

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
            <tr key={`result-${result.id}`}>
              <td className="td-with-radio-button">
                <div>
                  <RadioButton
                    value={result.id}
                    checked={result.id === selected}
                    onChange={(e) => setSelected(e.target.value)}
                  />
                </div>
                <div>
                  {result.title}
                  <ExternalLink href={''} labelNewWindow="">
                    ns:{result.title}
                  </ExternalLink>
                </div>
              </td>
              <td style={{ width: '40%' }}>
                <div>
                  <Text>Tietomallin nimi</Text>
                  <Text>
                    <Icon icon="calendar" /> Tietomallin tyyppi
                  </Text>
                  <Text>Tietomallin tietoalueet</Text>
                </div>
              </td>
              <td style={{ width: '20%' }}>
                <div>
                  <ExternalLink href={''} labelNewWindow="">
                    Käsitteen linkki
                  </ExternalLink>
                  <Text>Sanaston nimi</Text>
                </div>
              </td>
              <td style={{ width: '15%' }}>
                <div>
                  <Text>Päiväys</Text>
                  <StatusChip $isValid={result.id === '1'}>
                    Voimassa oleva
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
