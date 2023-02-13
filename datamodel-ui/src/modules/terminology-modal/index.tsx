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
  const [infoDomains] = useState([]);
  const [initialSelected] = useState([]);
  const [selected, setSelected] = useState<{ id: string; title: string }[]>([]);
  const [searchResults, setSearchResults] = useState<TerminologyResult[]>([]);

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
      <Button
        variant="secondary"
        icon="plus"
        id="terminologies"
        onClick={() => setVisible(true)}
      >
        {t('add-terminology')}
      </Button>
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('add-reference-to-terminologies')}</ModalTitle>
          {renderSearchBlock()}
          {renderResults()}
        </ModalContent>
        <ModalFooter>
          <Button
            disabled={isEqual(initialSelected, selected)}
            onClick={() => handleSubmit()}
          >
            {t('add-selected')}
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel-variant')}
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
            labelText={t('search-for-terminology')}
            clearButtonLabel={t('clear-all-selections')}
            searchButtonLabel={t('search')}
            defaultValue={searchTerm}
            onBlur={(e) => handleSearchTermChange(e.target.value)}
            onSearch={(e) => handleSearchTermChange(e ? e.toString() : '')}
            debounce={500}
          />

          <SingleSelect
            labelText={t('information-domain')}
            visualPlaceholder={t('input-or-select')}
            // This text can be left empty because item addition isn't enabled
            itemAdditionHelpText=""
            ariaOptionsAvailableText={t('information-domains-available')}
            clearButtonLabel={t('clear-all-selections')}
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
      return <Text>{t('add-refrence-to-terminologies-description')}</Text>;
    }

    return (
      <div>
        <SearchResultCount>
          <Text variant="bold">
            {t('terminology-counts', { count: searchResults.length })}
          </Text>
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
