import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  Expander,
  ExpanderTitleButton,
  ExternalLink,
  HintText,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  RadioButton,
  SearchInput,
  SingleSelect,
  StaticChip,
  Text,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  SearchBlock,
  SearchResultWrapper,
  SelectedConceptsGroup,
} from './concept-block.styles';

interface ConceptBlockProps {
  concept?: ClassFormType['equivalentClass'][0];
  setConcept: (value: object | undefined) => void;
}

export default function ConceptBlock({
  concept,
  setConcept,
}: ConceptBlockProps) {
  const { i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<
    ClassFormType['equivalentClass'][0] | undefined
  >(concept);
  const [terminologyOptions] = useState([
    {
      labelText: 'Tietomallin linkitetyt sanastot',
      uniqueItemId: 'linked',
    },
  ]);

  // TODO: Change this to use API
  const [data] = useState([
    {
      title: {
        fi: 'Rakennelma',
        en: 'Structure',
      },
      identifier: 'Rakennelma',
      terminologyLabel: {
        fi: 'Rakentamisen sanasto',
      },
      status: 'VALID',
      description: {
        fi: 'Omalla sisäänkäynnillä varustettu rakennuskohde, joka on erillinen, kiinteä tai tarkoitettu paikallaan pidettäväksi ja joka sisältää eri toimintoihin tarkoitettua katettua ja yleensä ulkoseinien tai muista rakennelmista erottavien seinien rajoittamaa tilaa',
        en: 'English description',
      },
      uri: 'http://uri.suomi.fi/rakennelma',
    },
    {
      title: {
        fi: 'Rakennus',
        en: 'Building',
      },
      identifier: 'Rakennus',
      terminologyLabel: {
        fi: 'Rakentamisen sanasto',
      },
      status: 'DRAFT',
      description: {
        fi: 'Omalla sisäänkäynnillä varustettu rakennuskohde, joka on erillinen, kiinteä tai tarkoitettu paikallaan pidettäväksi ja joka sisältää eri toimintoihin tarkoitettua katettua ja yleensä ulkoseinien tai muista rakennelmista erottavien seinien rajoittamaa tilaa',
        en: 'English description',
      },
      uri: 'http://uri.suomi.fi/rakennus',
    },
  ]);

  const handleOpen = () => {
    setVisible(true);
    if (concept) {
      setSelected(concept);
    }
  };

  const handleClose = () => {
    setSelected(undefined);
    setVisible(false);
  };

  const handleRadioButtonClick = (
    value: ClassFormType['equivalentClass'][0]
  ) => {
    setSelected(value);
  };

  const handleSubmit = () => {
    setConcept(selected);
    handleClose();
  };

  return (
    <>
      <BasicBlock title="Käsite">
        {!concept ? (
          <InlineAlert status="warning" style={{ marginBottom: '5px' }}>
            Käsitettä ei ole määritelty
          </InlineAlert>
        ) : (
          <SelectedConceptsGroup
            closeAllText=""
            openAllText=""
            showToggleAllButton={false}
          >
            <Expander>
              <ExpanderTitleButton>
                Käsitteen määritelmä
                <HintText>
                  {getLanguageVersion({
                    data: concept.label,
                    lang: i18n.language,
                  })}
                </HintText>
              </ExpanderTitleButton>
            </Expander>
          </SelectedConceptsGroup>
        )}
        <Button
          variant="secondary"
          style={{ width: 'min-content', whiteSpace: 'nowrap' }}
          onClick={() => handleOpen()}
        >
          Valitse käsite
        </Button>

        <Modal
          appElementId="__next"
          visible={visible}
          variant={isSmall ? 'smallScreen' : 'default'}
          onEscKeyDown={() => setVisible(false)}
        >
          <ModalContent>
            <ModalTitle>Valitse käsite</ModalTitle>
            <SearchBlock>
              <SearchInput
                labelText="Hae käsitettä"
                clearButtonLabel=""
                searchButtonLabel=""
              />
              <SingleSelect
                clearButtonLabel=""
                labelText="Sanasto"
                noItemsText=""
                ariaOptionsAvailableText=""
                allowItemAddition={false}
                defaultSelectedItem={terminologyOptions.find(
                  (o) => o.uniqueItemId === 'linked'
                )}
                items={terminologyOptions}
              />
            </SearchBlock>

            {data.length < 1 ? (
              <Text>Etsi käsitettä syöttämällä hakukenttään hakusana.</Text>
            ) : (
              <>
                <Text variant="bold">{data.length} käsitettä</Text>
                <SearchResultWrapper>
                  {data.map((d, idx) => (
                    <div
                      key={`concept-result-${idx}`}
                      className={
                        selected?.identifier === d.uri
                          ? 'item-wrapper selected'
                          : 'item-wrapper'
                      }
                    >
                      <RadioButton
                        value={d.uri}
                        checked={selected?.identifier === d.uri}
                        onChange={(e) => handleRadioButtonClick(e.target.value)}
                      />
                      <div>
                        <Text>{d.title}</Text>
                        <div className="subtitle">
                          <Text>{d.terminologyLabel}</Text>
                          <StaticChip
                            className={d.status === 'VALID' ? 'valid' : 'other'}
                          >
                            {d.status}
                          </StaticChip>
                        </div>

                        <Text className="description">{d.description}</Text>
                        <br />
                        <ExternalLink href={d.uri} labelNewWindow="">
                          {d.uri}
                        </ExternalLink>
                      </div>
                    </div>
                  ))}
                </SearchResultWrapper>
              </>
            )}
          </ModalContent>

          <ModalFooter>
            <Button disabled={!selected} onClick={() => handleSubmit()}>
              Valitse käsite
            </Button>
            <Button variant="secondary" onClick={() => handleClose()}>
              Peruuta
            </Button>
          </ModalFooter>
        </Modal>
      </BasicBlock>
    </>
  );
}
