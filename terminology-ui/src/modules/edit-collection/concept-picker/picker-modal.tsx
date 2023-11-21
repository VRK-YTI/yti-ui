import { useSearchConceptMutation } from '@app/common/components/concept/concept.slice';
import { useBreakpoints } from 'yti-common-ui/media-query';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import { Concepts } from '@app/common/interfaces/concepts.interface';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';
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
  IconArrowLeft,
  IconArrowRight,
  IconRemove,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  SearchInput,
  Text,
} from 'suomifi-ui-components';
import { EditCollectionFormDataType } from '../edit-collection.types';
import {
  FooterButton,
  ResultBlock,
  SearchBlock,
  SearchDropdown,
  SearchResultCountBlock,
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
    useState<EditCollectionFormDataType['concepts']>(orgConcepts);
  const [showSelected, setShowSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>('ALL-STATUSES');

  const statuses = [
    {
      name: 'ALL-STATUSES',
      uniqueItemId: 'ALL-STATUSES',
      labelText: t('statuses.all-statuses', { ns: 'common' }),
    },
    {
      name: 'VALID',
      uniqueItemId: 'VALID',
      labelText: t('statuses.valid', { ns: 'common' }),
    },
    {
      name: 'INCOMPLETE',
      uniqueItemId: 'INCOMPLETE',
      labelText: t('statuses.incomplete', { ns: 'common' }),
    },
    {
      name: 'DRAFT',
      uniqueItemId: 'DRAFT',
      labelText: t('statuses.draft', { ns: 'common' }),
    },
    {
      name: 'RETIRED',
      uniqueItemId: 'RETIRED',
      labelText: t('statuses.retired', { ns: 'common' }),
    },
    {
      name: 'SUPERSEDED',
      uniqueItemId: 'SUPERSEDED',
      labelText: t('statuses.superseded', { ns: 'common' }),
    },
    {
      name: 'INVALID',
      uniqueItemId: 'INVALID',
      labelText: t('statuses.invalid', { ns: 'common' }),
    },
  ];

  const handleClick = () => {
    setConcepts(selectedConcepts);
    setVisible(false);
  };

  const handleCheckbox = (checkboxState: boolean, concept: Concepts) => {
    if (checkboxState) {
      let label = concept.label;

      if (Object.keys(label).some((key) => label[key].includes('<b>'))) {
        const newLabel = new Map();
        Object.keys(label).forEach((key) => {
          newLabel.set(key, label[key].replaceAll(/<\/*[^>]>/g, ''));
        });
        label = Object.fromEntries(newLabel);
      }

      setSelectedConcepts([
        ...selectedConcepts,
        {
          id: concept.id,
          prefLabels: label,
        },
      ]);
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

            <SearchBlock $isSmall={isSmall}>
              <div>
                <SearchInput
                  clearButtonLabel=""
                  labelText={t('search-term')}
                  searchButtonLabel=""
                  defaultValue={searchTerm}
                  onChange={(e) => setSearchTerm(e?.toString() ?? '')}
                  onSearch={() => handleSearch()}
                  visualPlaceholder={t('enter-search-term')}
                  maxLength={TEXT_INPUT_MAX}
                  id="keyword-input"
                />

                <SearchDropdown
                  labelText={t('concept-status')}
                  defaultValue="ALL-STATUSES"
                  onChange={(e) => handleStatus(e)}
                  id="status-picker"
                  $isSmall={isSmall}
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
                <Button onClick={() => handleSearch()} id="search-button">
                  {t('search')}
                </Button>

                <Button
                  variant="secondaryNoBorder"
                  iconRight={<IconRemove />}
                  onClick={() => handleClear()}
                  id="clear-button"
                >
                  {t('clear-search')}
                </Button>
              </div>
            </SearchBlock>
            <SearchResultCountBlock id="search-result-counts-block">
              <Text smallScreen variant="bold">
                {t('number-of-concepts', {
                  count: result.data?.concepts.length ?? 0,
                })}
              </Text>
            </SearchResultCountBlock>

            <ResultBlock
              closeAllText=""
              openAllText=""
              showToggleAllButton={false}
            >
              {result.data?.concepts.map((concept) => {
                return (
                  <Expander key={`concept-${concept.id}`}>
                    <ExpanderTitle
                      title=""
                      toggleButtonAriaDescribedBy={`checkbox-id-${concept.id}`}
                      toggleButtonAriaLabel={t('additional-information', {
                        ns: 'admin',
                      })}
                      className="search-result-expander"
                    >
                      <Checkbox
                        hintText={`${translateStatus(
                          concept.status,
                          t
                        )} \u00B7 ${
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
                        className="search-result-checkbox"
                        variant={isSmall ? 'large' : 'small'}
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
              iconRight={showSelected ? <IconArrowLeft /> : <IconArrowRight />}
              onClick={() => setShowSelected(!showSelected)}
              id="switch-view-button"
            >
              {t('show-selected-concepts', {
                count: selectedConcepts.length ?? 0,
              })}
            </FooterButton>
            <br />
          </>
        )}
        <FooterButton onClick={() => handleClick()} id="submit-button">
          {t('add-concept', { count: selectedConcepts.length })}
        </FooterButton>
        <FooterButton
          variant="secondary"
          onClick={() => setVisible(false)}
          id="cancel-button"
        >
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
      <SelectedConceptBlock id="selected-concepts-block">
        {selectedConcepts.map((concept, idx) => {
          return (
            <Chip
              key={`selected-concept-${idx}`}
              onClick={() => deselect(concept.id)}
              removable
            >
              {concept.prefLabels[i18n.language] ??
                concept.prefLabels.fi ??
                concept.prefLabels[Object.keys(concept.prefLabels)[0]] ??
                ''}
            </Chip>
          );
        })}
      </SelectedConceptBlock>
    </>
  );
}
