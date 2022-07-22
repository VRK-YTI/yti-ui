import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useSearchConceptMutation } from '@app/common/components/concept/concept.slice';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { Concept } from '@app/common/interfaces/concept.interface';
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
} from 'suomifi-ui-components';
import {
  ResultBlock,
  SearchBlock,
  SearchDropdown,
  SearchResultCountBlock,
  SearchTextInput,
} from './concept-picker.styles';

interface ConceptPickerProps {
  terminologyId: string;
}

export default function ConceptPicker({ terminologyId }: ConceptPickerProps) {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };

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
              />
            )}
          </BasicBlockExtraWrapper>
        }
      >
        Voit lisätä esimerkiksi samaan aihepiiriin kuuluvat käsitteet yhteen
        käsitekokoelmaan.
      </BasicBlock>
    </>
  );
}

interface PickerModalProps {
  setVisible: (value: boolean) => void;
  terminologyId: string;
}

function PickerModal({ setVisible, terminologyId }: PickerModalProps) {
  const { isSmall } = useBreakpoints();
  const [searchConcept, result] = useSearchConceptMutation();
  const [selectedConcepts, setSelectedConcepts] = useState<Concept[]>([]);

  const handleClick = () => {
    setVisible(false);
  };

  const handleCheckbox = (checkboxState: boolean, concept: Concept) => {
    if (checkboxState) {
      setSelectedConcepts([...selectedConcepts, concept]);
    } else {
      setSelectedConcepts(selectedConcepts.filter(c => c.id !== concept.id));
    }
  };

  // console.log(result.data);
  console.log(selectedConcepts);

  useEffect(() => {
    searchConcept({ terminologyId: terminologyId });
  }, [terminologyId]);

  return (
    <Modal
      style={{
        maxWidth: '900px !important',
      }}
      appElementId="__next"
      visible={true}
      onEscKeyDown={() => setVisible(false)}
      variant={!isSmall ? 'default' : 'smallScreen'}
    >
      <ModalContent>
        <ModalTitle>Lisää käsite käsitekokoelmaan</ModalTitle>

        <SearchBlock>
          <div>
            <SearchTextInput
              labelText="Hakusana"
              icon="search"
              visualPlaceholder="Kirjoita hakusana"
            />

            <SearchDropdown labelText="Käsitteen tila">
              <DropdownItem value="1">Kaikki tilat</DropdownItem>
              <DropdownItem value="2">Testi2</DropdownItem>
            </SearchDropdown>
          </div>
          <div>
            <Button>Hae</Button>

            <Button variant="secondaryNoBorder" iconRight="remove">
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
                    hintText={`${concept.status} ${
                      concept.terminology.label.fi ??
                      concept.terminology.label.en
                    }`}
                    id={`checkbox-id-${idx}`}
                    onClick={(e) => handleCheckbox(e.checkboxState, concept)}
                  >
                    {concept.label.fi ?? concept.label.en}
                  </Checkbox>
                </ExpanderTitle>
                <ExpanderContent>Testi123</ExpanderContent>
              </Expander>
            );
          })}
        </ResultBlock>
      </ModalContent>

      <ModalFooter>
        <Button onClick={() => handleClick()}>Tallenna</Button>
        <Button variant="secondary" onClick={() => setVisible(false)}>
          Peruuta
        </Button>
      </ModalFooter>
    </Modal>
  );
}
