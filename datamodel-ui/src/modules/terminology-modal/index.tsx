import { Status } from '@app/common/interfaces/status.interface';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { isEqual } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  ExternalLink,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  SearchInput,
  SingleSelect,
  Text,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import {
  SearchBlock,
  SelectedChipBlock,
  SearchResult,
  SearchResultCount,
  SearchResultsBlock,
  SearchResultSubTitle,
  StatusChip,
} from './terminology-modal.styles';

type TerminologyResult = {
  id: string;
  title: string;
  languages: string[];
  informationDomain: string[];
  status: Status;
  description?: string;
  uri: string;
};

export default function TerminologyModal() {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>();
  const [infoDomains] = useState([
    {
      labelText: 'Test #1',
      uniqueItemId: '001',
    },
    {
      labelText: 'Test #2',
      uniqueItemId: '002',
    },
  ]);
  const [initialSelected] = useState([]);
  const [selected, setSelected] = useState<{ id: string; title: string }[]>([]);
  const [searchResults, setSearchResults] = useState<TerminologyResult[]>([
    {
      id: '001',
      title: 'Title1',
      languages: ['fi', 'en', 'sv'],
      informationDomain: ['Rakennettu ympäristö'],
      status: 'VALID',
      description:
        'Sanasto liittyy käynnissä olevaan digikaavoitukseen ja kaavan kansallisen tietomallin kehittämiseen. Kehittämistyötä tehdään Maankäyttöpäätökset-hankkeen Kuntapilottiina yms yms',
      uri: 'http://url.suomi.fi',
    },
    {
      id: '002',
      title: 'Aluehallinnon aluejohto',
      languages: ['fi'],
      informationDomain: [
        'Rakennettu ympäristö',
        'Terveydenhuolto',
        'Sairaanhoito',
      ],
      status: 'DRAFT',
      uri: 'http://url.suomi.fi',
    },
  ]);

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCheckboxClick = (id: string) => {
    if (selected.some((s) => s.id === id)) {
      setSelected(selected.filter((s) => s.id !== id));
      return;
    }

    const title = searchResults.find((result) => result.id === id)?.title ?? '';
    setSelected([...selected, { id: id, title: title }]);
  };

  const handleChipClick = (id: string) => {
    setSelected(selected.filter((s) => s.id !== id));
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedDomain(null);
    setSelected([]);
    setVisible(false);
  };

  const handleSubmit = () => {
    handleClose();
  };

  return (
    <>
      <Button onClick={() => setVisible(true)}>Click</Button>
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>Lisää viittaus sanastoihin</ModalTitle>

          {renderSearchBlock()}
          {renderResults()}
        </ModalContent>
        <ModalFooter>
          <Button
            disabled={isEqual(initialSelected, selected)}
            onClick={() => handleSubmit()}
          >
            Lisää valitut
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            Peruuta
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  function renderSearchBlock() {
    return (
      <div>
        <SearchBlock $isSmall={isSmall}>
          <SearchInput
            labelText="Hae sanastoa"
            clearButtonLabel=""
            searchButtonLabel=""
            defaultValue={searchTerm}
            onBlur={(e) => handleSearchTermChange(e.target.value)}
            onSearch={(e) => handleSearchTermChange(e ? e.toString() : '')}
            debounce={500}
          />

          <SingleSelect
            labelText="Tietoalue"
            visualPlaceholder="Kirjoita tai valitse"
            itemAdditionHelpText=""
            ariaOptionsAvailableText=""
            clearButtonLabel=""
            items={infoDomains}
            onItemSelect={(e) => setSelectedDomain(e)}
          />
        </SearchBlock>

        {selected.length > 0 && (
          <SelectedChipBlock>
            {selected.map((s) => (
              <Chip key={s.id} removable onClick={() => handleChipClick(s.id)}>
                {s.title}
              </Chip>
            ))}
          </SelectedChipBlock>
        )}
      </div>
    );
  }

  function renderResults() {
    if (searchResults.length < 1) {
      return (
        <Text>
          Etsi sanastoja syöttämällä hakukenttään hakusana tai valitsemalla
          tietoalue. Tietoalue-pudotusvalikosta voit kohdistaa haun tiettyyn
          tietoalueeseen.
        </Text>
      );
    }

    return (
      <div>
        <SearchResultCount>
          <Text variant="bold">{searchResults.length} sanastoa</Text>
        </SearchResultCount>

        <SearchResultsBlock>
          {searchResults.map((result, idx) => (
            <SearchResult key={`terminology-result-${idx}`}>
              <div>
                <Checkbox
                  checked={selected.map((s) => s.id).includes(result.id)}
                  onClick={() => handleCheckboxClick(result.id)}
                />
              </div>

              <div>
                <div>{renderHighlighted(result.title)}</div>

                <SearchResultSubTitle>
                  <span>{result.languages.join(', ')}</span>
                  <span>{result.informationDomain.join(', ')}</span>
                  <span>
                    <StatusChip $isValid={result.status === 'VALID'}>
                      {translateStatus(result.status, t)}
                    </StatusChip>
                  </span>
                </SearchResultSubTitle>

                <div className="result-description">
                  {result.description
                    ? renderHighlighted(result.description)
                    : t('no-description', { ns: 'common' })}
                </div>

                <div>
                  <ExternalLink href={result.uri} labelNewWindow="">
                    <SanitizedTextContent text={result.uri} />
                  </ExternalLink>
                </div>
              </div>
            </SearchResult>
          ))}
        </SearchResultsBlock>
      </div>
    );
  }

  function renderHighlighted(text: string) {
    if (
      searchTerm === '' ||
      (searchTerm !== '' &&
        !text.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return text;
    }

    return <SanitizedTextContent text={getHighlighted(text)} />;
  }

  function getHighlighted(text: string): string {
    if (!text.toLowerCase().includes(searchTerm.toLowerCase())) {
      return text;
    }

    if (text.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0) {
      return `<span class="highlighted-content">${text.substring(
        0,
        searchTerm.length
      )}</span>${getHighlighted(text.substring(searchTerm.length))}`;
    }

    const indexOfTerm = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    const endOfTerm = indexOfTerm + searchTerm.length;

    return `${text.substring(
      0,
      indexOfTerm
    )}<span class="highlighted-content">${text.substring(
      indexOfTerm,
      endOfTerm
    )}</span>${getHighlighted(text.substring(endOfTerm))}`;
  }
}
