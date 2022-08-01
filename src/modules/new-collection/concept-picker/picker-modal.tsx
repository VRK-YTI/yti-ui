import { useSearchConceptMutation } from '@app/common/components/concept/concept.slice';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import SanitizedTextContent from '@app/common/components/sanitized-text-content';
import { Concepts } from '@app/common/interfaces/concepts.interface';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  DropdownItem,
  Expander,
  ExpanderTitle,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Text,
} from 'suomifi-ui-components';
import {
  FooterButton,
  ResultBlock,
  SearchBlock,
  SearchDropdown,
  SearchResultCountBlock,
  SearchTextInput,
  SelectedConceptBlock,
} from './concept-picker.styles';
import { PickerModalProps, SelectedConceptProps } from './concept-picker.types';
import { ExpanderConceptContent } from './expander-concept-content';

export default function PickerModal({
  setVisible,
  terminologyId,
  orgConcepts,
  setConcepts,
}: PickerModalProps) {
  const { t, i18n } = useTranslation('collection');
  const { isSmall } = useBreakpoints();
  const [searchConcept, result] = useSearchConceptMutation();
  const [selectedConcepts, setSelectedConcepts] =
    useState<Concepts[]>(orgConcepts);
  const [showSelected, setShowSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>('ALL-STATUSES');

  const statuses = [
    {
      name: 'ALL-STATUSES',
      uniqueItemId: 'ALL-STATUSES',
      labelText: t('ALL-STATUSES', { ns: 'common' }),
    },
    {
      name: 'VALID',
      uniqueItemId: 'VALID',
      labelText: t('VALID', { ns: 'common' }),
    },
    {
      name: 'INCOMPLETE',
      uniqueItemId: 'INCOMPLETE',
      labelText: t('INCOMPLETE', { ns: 'common' }),
    },
    {
      name: 'DRAFT',
      uniqueItemId: 'DRAFT',
      labelText: t('DRAFT', { ns: 'common' }),
    },
    {
      name: 'RETIRED',
      uniqueItemId: 'RETIRED',
      labelText: t('RETIRED', { ns: 'common' }),
    },
    {
      name: 'SUPERSEDED',
      uniqueItemId: 'SUPERSEDED',
      labelText: t('SUPERSEDED', { ns: 'common' }),
    },
    {
      name: 'INVALID',
      uniqueItemId: 'INVALID',
      labelText: t('INVALID', { ns: 'common' }),
    },
  ];

  const handleClick = () => {
    setConcepts(selectedConcepts);
    setVisible(false);
  };

  const handleCheckbox = (checkboxState: boolean, concept: Concepts) => {
    if (checkboxState) {
      setSelectedConcepts([...selectedConcepts, concept]);
    } else {
      setSelectedConcepts(selectedConcepts.filter((c) => c.id !== concept.id));
    }
  };

  const handleDeselect = (id: string) => {
    const updatedConcepts = selectedConcepts.filter(
      (concept) => concept.id !== id
    );
    setSelectedConcepts(updatedConcepts);

    if (updatedConcepts.length < 1) {
      setShowSelected(false);
    }
  };

  const handleStatus = (value: string) => {
    setStatus(value);
    searchConcept({
      terminologyId: terminologyId,
      query: searchTerm,
      status: value !== 'ALL-STATUSES' ? value : undefined,
    });
  };

  const handleSearch = () => {
    searchConcept({
      terminologyId: terminologyId,
      query: searchTerm,
      status: status !== 'ALL-STATUSES' ? status : undefined,
    });
  };

  const handleClear = () => {
    searchConcept({ terminologyId: terminologyId });
    setSearchTerm('');
  };

  useEffect(() => {
    searchConcept({ terminologyId: terminologyId });
  }, [terminologyId, searchConcept]);

  return (
    <Modal
      appElementId="__next"
      visible={true}
      onEscKeyDown={() => setVisible(false)}
      variant={!isSmall ? 'default' : 'smallScreen'}
    >
      <ModalContent>
        {showSelected ? (
          <SelectedConcepts
            selectedConcepts={selectedConcepts}
            deselect={handleDeselect}
          />
        ) : (
          <>
            <ModalTitle>{t('add-concept-to-collection')}</ModalTitle>

            <SearchBlock>
              <div>
                <SearchTextInput
                  labelText={t('search-term')}
                  icon="search"
                  visualPlaceholder={t('enter-search-term')}
                  defaultValue={searchTerm}
                  onChange={(e) => setSearchTerm(e?.toString() ?? '')}
                  onBlur={() => handleSearch()}
                  value={searchTerm}
                />

                <SearchDropdown
                  labelText={t('concept-status')}
                  defaultValue="ALL-STATUSES"
                  onChange={(e) => handleStatus(e)}
                >
                  {statuses.map((status) => (
                    <DropdownItem
                      key={`status-item-${status.uniqueItemId}`}
                      value={status.uniqueItemId}
                    >
                      {status.labelText}
                    </DropdownItem>
                  ))}
                </SearchDropdown>
              </div>
              <div>
                <Button onClick={() => handleSearch()}>{t('search')}</Button>

                <Button
                  variant="secondaryNoBorder"
                  iconRight="remove"
                  onClick={() => handleClear()}
                >
                  {t('clear-search')}
                </Button>
              </div>
            </SearchBlock>
            <SearchResultCountBlock>
              <Text smallScreen variant="bold">
                {t('number-of-concepts', {
                  number: result.data?.concepts.length ?? 0,
                })}
              </Text>
            </SearchResultCountBlock>

            <ResultBlock closeAllText="" openAllText="">
              {result.data?.concepts.map((concept) => {
                return (
                  <Expander key={`concept-${concept.id}`}>
                    <ExpanderTitle
                      title=""
                      ariaOpenText={t('open-concept-info')}
                      ariaCloseText={t('close-concept-info')}
                      toggleButtonAriaDescribedBy={`checkbox-id-${concept.id}`}
                    >
                      <Checkbox
                        hintText={`${translateStatus(concept.status, t)} \u00B7 ${
                          concept.terminology.label[i18n.language] ??
                          concept.terminology.label.fi ??
                          concept.terminology.label[
                            Object.keys(concept.terminology.label)[0]
                          ] ??
                          ''
                        }`}
                        id={`checkbox-id-${concept.id}`}
                        onClick={(e) =>
                          handleCheckbox(e.checkboxState, concept)
                        }
                        defaultChecked={selectedConcepts
                          .map((c) => c.id)
                          .includes(concept.id)}
                      >
                        <SanitizedTextContent
                          text={
                            concept.label[i18n.language] ??
                            concept.label.fi ??
                            concept.label[Object.keys(concept.label)[0]] ??
                            ''
                          }
                        />
                      </Checkbox>
                    </ExpanderTitle>
                    <ExpanderConceptContent
                      concept={concept}
                      terminologyId={terminologyId}
                    />
                  </Expander>
                );
              })}
            </ResultBlock>
          </>
        )}
      </ModalContent>

      <ModalFooter>
        {selectedConcepts.length > 0 && (
          <>
            <FooterButton
              variant="secondaryNoBorder"
              iconRight={showSelected ? 'arrowLeft' : 'arrowRight'}
              onClick={() => setShowSelected(!showSelected)}
            >
              {t('show-selected-concepts', {
                number: selectedConcepts.length ?? 0,
              })}
            </FooterButton>
            <br />
          </>
        )}
        <FooterButton onClick={() => handleClick()}>
          {t('add-concept', { count: selectedConcepts.length })}
        </FooterButton>
        <FooterButton variant="secondary" onClick={() => setVisible(false)}>
          {t('cancel-variant', { ns: 'admin' })}
        </FooterButton>
      </ModalFooter>
    </Modal>
  );
}

function SelectedConcepts({
  selectedConcepts,
  deselect,
}: SelectedConceptProps) {
  const { t, i18n } = useTranslation('collection');

  return (
    <>
      <Text as="h3">{t('selected-concepts')}</Text>
      <SelectedConceptBlock>
        {selectedConcepts.map((concept, idx) => {
          return (
            <Chip
              key={`selected-concept-${idx}`}
              onClick={() => deselect(concept.id)}
              removable
            >
              {concept.label[i18n.language] ??
                concept.label.fi ??
                concept.label[Object.keys(concept.label)[0]] ??
                ''}
            </Chip>
          );
        })}
      </SelectedConceptBlock>
    </>
  );
}
