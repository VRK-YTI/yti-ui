import { useSearchConceptMutation } from '@app/common/components/concept/concept.slice';
import { useBreakpoints } from 'yti-common-ui/media-query';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { createRef, useEffect, useState } from 'react';
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
import { CollectionMember } from '../edit-collection.types';
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
import { DetachedPagination } from 'yti-common-ui/pagination';
import {
  ConceptResponseObject,
  SearchResponse,
} from '@app/common/interfaces/interfaces-v2';
import { getNamespace } from '@app/common/utils/namespace';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

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
    useState<CollectionMember[]>(orgConcepts);
  const [showSelected, setShowSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>('ALL-STATUSES');
  const [totalResults, setTotalResults] = useState(0);
  const [searchResults, setSearchResults] =
    useState<SearchResponse<ConceptResponseObject>>();
  const [currPage, setCurrPage] = useState(1);
  const modalRef = createRef<HTMLDivElement>();

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

  const handleCheckbox = (
    checkboxState: boolean,
    concept: ConceptResponseObject
  ) => {
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
          uri: concept.uri,
          identifier: concept.identifier,
          label,
        },
      ]);
    } else {
      setSelectedConcepts(
        selectedConcepts.filter((c) => c.uri !== concept.uri)
      );
    }
  };

  const handleDeselect = (uri: string) => {
    const updatedConcepts = selectedConcepts.filter(
      (concept) => concept.uri !== uri
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
      namespace: getNamespace(terminologyId),
      query: searchTerm,
      status: status !== 'ALL-STATUSES' ? [status] : undefined,
      pageFrom: (currPage - 1) * 20,
      pageSize: 20,
      extendTerminologies: true,
    });
  };

  const handleClear = () => {
    searchConcept({
      namespace: getNamespace(terminologyId),
      extendTerminologies: true,
    });
    setSearchTerm('');
  };

  const handlePageChange = (num: number) => {
    setCurrPage(num);
    searchConcept({
      namespace: getNamespace(terminologyId),
      query: searchTerm,
      status: status !== 'ALL-STATUSES' ? [status] : undefined,
      pageFrom: (num - 1) * 20,
      pageSize: 20,
      extendTerminologies: true,
    });
    focusToTop();
  };

  const focusToTop = () => {
    if (modalRef.current) {
      modalRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    if (result.isUninitialized) {
      setSearchResults(undefined);
      setTotalResults(0);
    }

    if (result.isSuccess) {
      setSearchResults(result.data);
      setTotalResults(result.data.totalHitCount);
    }
  }, [result, setTotalResults]);

  return (
    <Modal
      appElementId="__next"
      visible={true}
      onEscKeyDown={() => setVisible(false)}
      variant={!isSmall ? 'default' : 'smallScreen'}
    >
      <ModalContent>
        <div ref={modalRef} />
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
                  count: totalResults,
                })}
              </Text>
            </SearchResultCountBlock>

            <ResultBlock
              closeAllText=""
              openAllText=""
              showToggleAllButton={false}
            >
              {searchResults?.responseObjects.map((concept) => {
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
                        )} \u00B7 ${getLanguageVersion({
                          data: concept?.terminology?.label,
                          lang: i18n.language,
                        })}`}
                        id={`checkbox-id-${concept.id}`}
                        onClick={(e) =>
                          handleCheckbox(e.checkboxState, concept)
                        }
                        defaultChecked={selectedConcepts
                          .map((c) => c.uri)
                          .includes(concept.uri)}
                        className="search-result-checkbox"
                        variant={isSmall ? 'large' : 'small'}
                      >
                        <SanitizedTextContent
                          text={getLanguageVersion({
                            data: concept.label,
                            lang: i18n.language,
                          })}
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
            <DetachedPagination
              currentPage={currPage}
              maxPages={Math.ceil(totalResults / 20)}
              maxTotal={20}
              setCurrentPage={handlePageChange}
            />
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
              onClick={() => deselect(concept.uri)}
              removable
            >
              {getLanguageVersion({ data: concept.label, lang: i18n.language })}
            </Chip>
          );
        })}
      </SelectedConceptBlock>
    </>
  );
}
