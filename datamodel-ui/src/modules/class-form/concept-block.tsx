import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from '@app/common/utils/translation-helpers';
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
  setConcept: (value: ClassFormType['equivalentClass'][0] | undefined) => void;
}

export default function ConceptBlock({
  concept,
  setConcept,
}: ConceptBlockProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<
    ClassFormType['equivalentClass'][0] | undefined
  >(concept);
  const [terminologyOptions] = useState([
    {
      labelText:
        t('terminologies-linked-to-data-model') +
        'Tietomallin linkitetyt sanastot',
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
      <BasicBlock title={t('concept')}>
        {!concept ? (
          <InlineAlert status="warning" style={{ marginBottom: '5px' }}>
            {t('concept-undefined')}
          </InlineAlert>
        ) : (
          <SelectedConceptsGroup
            closeAllText=""
            openAllText=""
            showToggleAllButton={false}
          >
            <Expander>
              <ExpanderTitleButton>
                {t('concept-definition')}
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
          {t('select-concept')}
        </Button>

        <Modal
          appElementId="__next"
          visible={visible}
          variant={isSmall ? 'smallScreen' : 'default'}
          onEscKeyDown={() => setVisible(false)}
        >
          <ModalContent>
            <ModalTitle>{t('select-concept')}</ModalTitle>
            <SearchBlock>
              <SearchInput
                labelText={t('search-concept')}
                clearButtonLabel={t('clear-selection')}
                searchButtonLabel={t('search-concept')}
              />
              <SingleSelect
                clearButtonLabel={t('clear-selection')}
                labelText={t('terminology')}
                noItemsText={t('no-terminologies-available')}
                ariaOptionsAvailableText={t('terminologies-available')}
                allowItemAddition={false}
                defaultSelectedItem={terminologyOptions.find(
                  (o) => o.uniqueItemId === 'linked'
                )}
                items={terminologyOptions}
              />
            </SearchBlock>

            {data.length < 1 ? (
              <Text>{t('search-concept-by-keyword')}</Text>
            ) : (
              <>
                <Text variant="bold">
                  {t('concept-counts', { count: data.length })}
                </Text>
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
                        onChange={() =>
                          handleRadioButtonClick({
                            label: d.title,
                            identifier: d.uri,
                          })
                        }
                      />
                      <div>
                        <Text>
                          {getLanguageVersion({
                            data: d.title,
                            lang: i18n.language,
                            appendLocale: true,
                          })}
                        </Text>
                        <div className="subtitle">
                          <Text>
                            {getLanguageVersion({
                              data: d.terminologyLabel,
                              lang: i18n.language,
                              appendLocale: true,
                            })}
                          </Text>
                          <StaticChip
                            className={d.status === 'VALID' ? 'valid' : 'other'}
                          >
                            {translateStatus(d.status, t)}
                          </StaticChip>
                        </div>

                        <Text className="description">
                          {getLanguageVersion({
                            data: d.description,
                            lang: i18n.language,
                            appendLocale: true,
                          })}
                        </Text>
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
              {t('select-concept')}
            </Button>
            <Button variant="secondary" onClick={() => handleClose()}>
              {t('cancel-variant')}
            </Button>
          </ModalFooter>
        </Modal>
      </BasicBlock>
    </>
  );
}
