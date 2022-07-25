import {
  BasicBlock,
  MultilingualPropertyBlock,
} from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import {
  useGetConceptQuery,
  useSearchConceptMutation,
} from '@app/common/components/concept/concept.slice';
import FormattedDate from '@app/common/components/formatted-date';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import SanitizedTextContent from '@app/common/components/sanitized-text-content';
import Separator from '@app/common/components/separator';
import { Concepts } from '@app/common/interfaces/concepts.interface';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  DropdownItem,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Text,
  Expander,
  ExpanderContent,
  ExpanderTitle,
  Checkbox,
  Chip,
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

interface ConceptPickerProps {
  terminologyId: string;
  setFormConcepts: (value: any) => void;
}

export default function ConceptPicker({
  terminologyId,
  setFormConcepts,
}: ConceptPickerProps) {
  const [visible, setVisible] = useState(false);
  const [concepts, setConcepts] = useState<Concepts[]>([]);

  const handleClick = () => {
    setVisible(true);
  };

  useEffect(() => {
    setFormConcepts(concepts);
  }, [concepts, setFormConcepts]);

  return (
    <>
      <BasicBlock
        title="Käsitekokoelmaan kuuluvat käsitteet"
        extra={
          <BasicBlockExtraWrapper>
            <Button variant="secondary" onClick={() => handleClick()}>
              Lisää käsite käsitekokoelmaan
            </Button>
            {visible && (
              <PickerModal
                setVisible={setVisible}
                terminologyId={terminologyId}
                orgConcepts={concepts}
                setConcepts={setConcepts}
              />
            )}
          </BasicBlockExtraWrapper>
        }
      >
        Voit lisätä esimerkiksi samaan aihepiiriin kuuluvat käsitteet yhteen
        käsitekokoelmaan.
      </BasicBlock>

      {concepts.length > 0 && (
        <BasicBlock
          title="Valitut käsitekokoeilmaan kuuluvat käsitteet"
          extra={
            <BasicBlockExtraWrapper>
              <SelectedConceptBlock>
                {concepts.map((concept) => (
                  <Chip
                    key={`concept-${concept.id}`}
                    onClick={() =>
                      setConcepts(concepts.filter((c) => c.id !== concept.id))
                    }
                    removable
                  >
                    {concept.label.fi ?? concept.label.en}
                  </Chip>
                ))}
              </SelectedConceptBlock>
            </BasicBlockExtraWrapper>
          }
        ></BasicBlock>
      )}
    </>
  );
}

interface PickerModalProps {
  setVisible: (value: boolean) => void;
  terminologyId: string;
  orgConcepts: Concepts[];
  setConcepts: (value: Concepts[]) => void;
}

function PickerModal({
  setVisible,
  terminologyId,
  orgConcepts,
  setConcepts,
}: PickerModalProps) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const [searchConcept, result] = useSearchConceptMutation();
  const [selectedConcepts, setSelectedConcepts] =
    useState<Concepts[]>(orgConcepts);
  const [showSelected, setShowSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>('ALL');

  const statuses = [
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

  const handleSearch = () => {
    searchConcept({
      terminologyId: terminologyId,
      query: searchTerm,
      status: status !== 'ALL' ? status : undefined,
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
            <ModalTitle>Lisää käsite käsitekokoelmaan</ModalTitle>

            <SearchBlock>
              <div>
                <SearchTextInput
                  labelText="Hakusana"
                  icon="search"
                  visualPlaceholder="Kirjoita hakusana"
                  defaultValue={searchTerm}
                  onChange={(e) => setSearchTerm(e?.toString() ?? '')}
                  value={searchTerm}
                />

                <SearchDropdown
                  labelText="Käsitteen tila"
                  defaultValue="ALL"
                  onChange={(e) => setStatus(e)}
                >
                  <DropdownItem value="ALL">Kaikki tilat</DropdownItem>
                  {statuses.map((status, idx) => (
                    <DropdownItem
                      key={`status-item-${idx}`}
                      value={status.uniqueItemId}
                    >
                      {status.labelText.fi}
                    </DropdownItem>
                  ))}
                </SearchDropdown>
              </div>
              <div>
                <Button onClick={() => handleSearch()}>Hae</Button>

                <Button
                  variant="secondaryNoBorder"
                  iconRight="remove"
                  onClick={() => handleClear()}
                >
                  Tyhjennä haku
                </Button>
              </div>
            </SearchBlock>
            <SearchResultCountBlock>
              <Text smallScreen variant="bold">
                {result.data?.concepts.length} käsitettä
              </Text>
            </SearchResultCountBlock>

            <ResultBlock closeAllText="" openAllText="">
              {result.data?.concepts.map((concept, idx) => {
                return (
                  <Expander key={`concept-${idx}`}>
                    <ExpanderTitle
                      title=""
                      ariaOpenText="open expander"
                      ariaCloseText="close expander"
                      toggleButtonAriaDescribedBy="checkbox-id"
                    >
                      <Checkbox
                        hintText={`${t(concept.status)} \u00B7 ${concept.terminology.label.fi ??
                          concept.terminology.label.en
                          }`}
                        id={`checkbox-id-${idx}`}
                        onClick={(e) =>
                          handleCheckbox(e.checkboxState, concept)
                        }
                        defaultChecked={selectedConcepts
                          .map((c) => c.id)
                          .includes(concept.id)}
                      >
                        <SanitizedTextContent
                          text={concept.label.fi ?? concept.label.en}
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
              {`Näytä valinnat (${selectedConcepts.length})`}
            </FooterButton>
            <br />
          </>
        )}
        <FooterButton onClick={() => handleClick()}>
          Lisää käsitteet
        </FooterButton>
        <FooterButton variant="secondary" onClick={() => setVisible(false)}>
          Peruuta
        </FooterButton>
      </ModalFooter>
    </Modal>
  );
}

interface SelectedConceptProps {
  selectedConcepts: Concepts[];
  deselect: (value: string) => void;
}

function SelectedConcepts({
  selectedConcepts,
  deselect,
}: SelectedConceptProps) {
  return (
    <>
      <Text as="h3">Valitut käsitteet</Text>
      <SelectedConceptBlock>
        {selectedConcepts.map((concept, idx) => {
          return (
            <Chip
              key={`selected-concept-${idx}`}
              onClick={() => deselect(concept.id)}
              removable
            >
              {concept.label.fi}
            </Chip>
          );
        })}
      </SelectedConceptBlock>
    </>
  );
}

interface ExpanderConceptContent {
  concept: Concepts;
  terminologyId: string;
}

function ExpanderConceptContent({
  concept,
  terminologyId,
}: ExpanderConceptContent) {
  const { data } = useGetConceptQuery({
    terminologyId: terminologyId,
    conceptId: concept.id,
  });

  return (
    <ExpanderContent>
      <MultilingualPropertyBlock
        title="Suositettavat termit"
        data={Object.keys(concept.label).map((key) => ({
          lang: key,
          regex: '(?s)^.*$',
          value: concept.label[key],
        }))}
      />

      {concept.definition && (
        <MultilingualPropertyBlock
          title="Määritelmä"
          data={Object.keys(concept.definition).map((key) => ({
            lang: key,
            regex: '(?s)^.*$',
            value: concept.definition[key],
          }))}
        />
      )}

      <Separator isLarge />

      <BasicBlock title="Vastuuorganisaatio">
        {concept.terminology.label.fi}
      </BasicBlock>

      <BasicBlock title="Muokattu viimeksi">
        <FormattedDate date={concept.modified} />
        {data?.lastModifiedBy && `, ${data?.lastModifiedBy}`}
      </BasicBlock>
    </ExpanderContent>
  );
}
