import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useSearchConceptQuery } from '@app/common/components/concept/concept.slice';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  Expander,
  ExpanderTitle,
  Label,
  Modal,
  ModalContent,
  ModalTitle,
  Paragraph,
  SearchInput,
  SingleSelect,
  Text,
} from 'suomifi-ui-components';
import {
  ChipBlock,
  ModalFooterFitted,
  ResultList,
  SearchBlock,
} from './relation-information-block.styles';

export default function RelationalInformationBlock({
  title,
  buttonTitle,
  description,
  chipDescription,
}: any) {
  const { i18n } = useTranslation('admin');
  const { data } = useSearchConceptQuery({terminologyId: 'f286aa7c-8b44-44af-9c62-3b19130f961c', query: 'uusi'});
  const [items, setItems] = useState<any[]>([]);

  return (
    <BasicBlock
      title={title}
      extra={
        <BasicBlockExtraWrapper>
          <ManageRelationalInfoModal
            buttonTitle={buttonTitle}
            items={items}
            setItems={setItems}
            data={data}
          />

          {items.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <Paragraph>
                <Text variant="bold" smallScreen>
                  {chipDescription}
                </Text>
              </Paragraph>

              <ChipBlock>
                {items.map((item) => {
                  return (
                    <Chip
                      key={item}
                      removable
                      onClick={() =>
                        setItems(items.filter((tItem) => tItem !== item))
                      }
                    >
                      {item.label[i18n.language]}
                    </Chip>
                  );
                })}
              </ChipBlock>
            </div>
          )}
        </BasicBlockExtraWrapper>
      }
    >
      {description}
    </BasicBlock>
  );
}

function ManageRelationalInfoModal({ buttonTitle, items, setItems, data }: any) {
  const [visible, setVisible] = useState(false);
  const [chosen, setChosen] = useState<any>(items);
  const [showChosen, setShowChosen] = useState(false);

  const status = [
    { name: 'valid', uniqueItemId: 'valid1', labelText: 'VALID' },
    { name: 'temp', uniqueItemId: 'temp2', labelText: 'TEMP' },
  ];

  const handleClose = () => {
    setVisible(false);
    setShowChosen(false);
  };

  const handleChange = () => {
    handleClose();
    setItems(chosen);
  };

  return (
    <>
      <Button onClick={() => setVisible(true)} variant="secondary">
        {buttonTitle}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
      >
        <ModalContent>
          {showChosen
            ?
            renderChosen(chosen, setChosen, setShowChosen, showChosen)
            :
            renderResults(buttonTitle, status, data, chosen, setChosen)
          }
        </ModalContent>

        <ModalFooterFitted>
          {chosen.length > 0 && (
            <div>
              <Button
                variant="secondaryNoBorder"
                icon={showChosen ? 'arrowLeft' : ''}
                iconRight={!showChosen ? 'arrowRight' : ''}
                onClick={() => setShowChosen(!showChosen)}
              >
                {showChosen ? 'Valitse lisää käsitteitä' : `Näytä valinnat (${chosen.length})`}
              </Button>
            </div>
          )}

          <Button onClick={() => handleChange()}>Lisää käsitteet</Button>
          <Button onClick={() => handleClose()} variant="secondary">
            Peruuta
          </Button>
        </ModalFooterFitted>
      </Modal>
    </>
  );
}


function renderResults(buttonTitle, items, data, chosen, setChosen) {
  const handleCheckbox = (e: any, concept: any) => {
    if (e.checkboxState) {
      setChosen([...chosen, concept]);
    } else {
      setChosen(chosen.filter((chose) => chose.id !== concept.id));
    }
  };

  return (
    <>
      <ModalTitle>{buttonTitle}</ModalTitle>
      <SearchBlock>
        <div>
          <SearchInput
            labelText="Hakusana"
            clearButtonLabel="Tyhjennä"
            searchButtonLabel="Hae"
          />
          <SingleSelect
            ariaOptionsAvailableText="Saatavilla"
            labelText="Käsitteen tila"
            clearButtonLabel="Tyhjennä"
            items={items}
            noItemsText="Ei vaihtoehtoja"
          />
        </div>
        <div>
          <Button>Hae</Button>
          <Button variant="secondaryNoBorder" icon="remove">
            Tyhjennä haku
          </Button>
        </div>
        <div>
          <Text variant="bold" smallScreen>
            {data?.totalHitCount ?? 0} käsitettä
          </Text>
        </div>
      </SearchBlock>

      <ResultList>
        {data?.concepts.map((concept, idx) => {
          return (
            <Expander key={`${concept.id}-${idx}`}>
              <ExpanderTitle
                ariaCloseText="Sulje"
                ariaOpenText="Avaa"
                toggleButtonAriaDescribedBy=""
              >
                <Checkbox
                  hintText={`organisaatio · ${concept.status} `}
                  onClick={(e) => handleCheckbox(e, concept)}
                  checked={chosen.some((chose) => chose.id === concept.id)}
                >
                  {concept.label.fi}
                </Checkbox>
              </ExpanderTitle>
            </Expander>
          );
        })}
      </ResultList>
    </>
  );
}

function renderChosen(chosen, setChosen, setShowChosen, showChosen) {
  const handleChipRemove = (chose) => {
    const updatedChosen = chosen.filter((c) => c.id !== chose.id);
    setChosen(updatedChosen);

    if (updatedChosen.length < 1) {
      setShowChosen(false);
    }
  };

  return (
    <>
      <ModalTitle>
        <Button
          variant="secondaryNoBorder"
          icon={showChosen ? 'arrowLeft' : ''}
          iconRight={!showChosen ? 'arrowRight' : ''}
          onClick={() => setShowChosen(!showChosen)}
        >
          {showChosen ? 'Valitse lisää käsitteitä' : 'Näytä valinnat (n)'}
        </Button>
      </ModalTitle>

      <Label>Valitut hierarkkiset alakäsitteet</Label>
      <ChipBlock>
        {chosen.map((chose, idx) => {
          return (
            <Chip
              removable
              onClick={() => handleChipRemove(chose)}
              key={`${chose}-${idx}`}
            >
              {chose.label.fi}
            </Chip>
          );
        })}
      </ChipBlock>
    </>
  );
}
