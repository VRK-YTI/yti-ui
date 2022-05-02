import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useState } from 'react';
import { Button, Checkbox, Chip, Expander, ExpanderTitle, Label, Modal, ModalContent, ModalFooter, ModalTitle, Paragraph, SearchInput, SingleSelect, SingleSelectData, Text } from 'suomifi-ui-components';
import { ChipBlock, ModalFooterFitted, ResultList, SearchBlock } from './relation-information-block.styles';

export default function RelationalInformationBlock({
  title,
  buttonTitle,
  description,
  chipDescription
}: any) {
  const [items, setItems] = useState<number[]>([]);
  return (
    <BasicBlock
      title={title}
      extra={
        <BasicBlockExtraWrapper>
          <ManageRelationalInfoModal buttonTitle={buttonTitle} setItems={setItems} />

          {items.length > 0 &&
            <div style={{ marginTop: '20px' }}>
              <Paragraph>
                <Text variant='bold' smallScreen>{chipDescription}</Text>
              </Paragraph>

              <ChipBlock>
                {items.map(item => {
                  return (
                    <Chip
                      key={item}
                      removable
                      onClick={() => setItems(items.filter(tItem => tItem !== item))}
                    >
                      {item.title}
                    </Chip>
                  );
                })}
              </ChipBlock>
            </div>
          }
        </ BasicBlockExtraWrapper>
      }
    >
      {description}
    </BasicBlock>
  );
}

function ManageRelationalInfoModal({ buttonTitle, setItems }: any) {
  const [visible, setVisible] = useState(false);
  const [chosen, setChosen] = useState<any>([]);
  const [showChosen, setShowChosen] = useState(false);

  const results = [
    {
      id: 1,
      title: 'test1',
      author: 'Oulun kaupunki',
      status: 'VALID'
    },
    {
      id: 2,
      title: 'test2',
      author: 'Oulun kaupunki',
      status: 'VALID'
    }
  ];

  const items = [
    { name: 'valid', uniqueItemId: 'valid1', labelText: 'VALID' },
    { name: 'temp', uniqueItemId: 'temp2', labelText: 'TEMP' }
  ];

  const handleCheckbox = (e: any, result: any) => {
    if (e.checkboxState) {
      setChosen([...chosen, result]);
    } else {
      setChosen(chosen.filter(chose => chose.id !== result.id));
    }
  };

  const handleChange = () => {
    setVisible(false);
    setItems(chosen);
  };

  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        variant='secondary'
      >
        {buttonTitle}
      </Button>

      <Modal
        appElementId='__next'
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
      >
        <ModalContent>
          {
            showChosen
              ?
              renderChosen()
              :
              renderResults()
          }
        </ModalContent>

        <ModalFooterFitted>
          {chosen.length > 0 &&
            <div>
              <Button
                variant='secondaryNoBorder'
                icon={showChosen ? 'arrowLeft' : ''}
                iconRight={!showChosen ? 'arrowRight' : ''}
                onClick={() => setShowChosen(!showChosen)}
              >
                {showChosen
                  ?
                  'Valitse lisää käsitteitä'
                  :
                  'Näytä valinnat (n)'
                }
              </Button>
            </div>
          }

          <Button onClick={() => handleChange()}>
            Lisää käsitteet
          </Button>
          <Button
            onClick={() => setVisible(false)}
            variant='secondary'
          >
            Peruuta
          </Button>
        </ModalFooterFitted>
      </Modal>
    </>
  );

  function renderResults() {
    return (
      <>
        <ModalTitle>{buttonTitle}</ModalTitle>
        <SearchBlock>
          <div>
            <SearchInput
              labelText='Hakusana'
              clearButtonLabel='Tyhjennä'
              searchButtonLabel='Hae'

            />
            <SingleSelect
              ariaOptionsAvailableText='Saatavilla'
              labelText='Käsitteen tila'
              clearButtonLabel='Tyhjennä'
              items={items}
              noItemsText='Ei vaihtoehtoja'
            />
          </div>
          <div>
            <Button>Hae</Button>
            <Button
              variant='secondaryNoBorder'
              icon='remove'
            >Tyhjennä haku</Button>
          </div>
          <div>
            <Text variant='bold' smallScreen>n käsitettä</Text>
          </div>
        </SearchBlock>

        <ResultList>
          {results.map((result, idx) => {
            return (
              <Expander key={`${result.title}-${idx}`}>
                <ExpanderTitle
                  ariaCloseText='Sulje'
                  ariaOpenText='Avaa'
                  toggleButtonAriaDescribedBy=''
                >
                  <Checkbox
                    hintText={`${result.author} ${result.status}`}
                    onClick={(e) => handleCheckbox(e, result)}
                    checked={chosen.some(chose => chose.id === result.id)}
                  >
                    {result.title}
                  </Checkbox>
                </ExpanderTitle>
              </Expander>
            );
          })}
        </ResultList>
      </>
    );
  };

  function renderChosen() {
    const handleChipRemove = (chose) => {
      const updatedChosen = chosen.filter(c => c.id !== chose.id);
      setChosen(updatedChosen);

      if (updatedChosen.length < 1) {
        setShowChosen(false);
      }
    };

    return (
      <>
        <ModalTitle>
          <Button
            variant='secondaryNoBorder'
            icon={showChosen ? 'arrowLeft' : ''}
            iconRight={!showChosen ? 'arrowRight' : ''}
            onClick={() => setShowChosen(!showChosen)}
          >
            {showChosen
              ?
              'Valitse lisää käsitteitä'
              :
              'Näytä valinnat (n)'
            }
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
                {chose.title}
              </Chip>
            )
          })}
        </ChipBlock>
      </>
    );
  };
}
