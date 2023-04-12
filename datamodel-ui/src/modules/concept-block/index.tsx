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
import { useGetConceptsQuery } from '@app/common/components/concept-search/concept-search.slice';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';

interface ConceptBlockProps {
  concept?: ClassFormType['concept'];
  setConcept: (value: ClassFormType['concept'] | undefined) => void;
  terminologies: string[];
}

export default function ConceptBlock({
  concept,
  setConcept,
  terminologies,
}: ConceptBlockProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState<
    ClassFormType['concept'] | undefined
  >(concept);
  const [terminologyOptions] = useState([
    {
      labelText: t('terminologies-linked-to-data-model'),
      uniqueItemId: 'linked',
    },
    {
      labelText: 'Kaikki sanastot',
      uniqueItemId: 'all',
    },
  ]);
  const [selectedOption, setSelectedOption] = useState(
    terminologyOptions.find((o) => o.uniqueItemId === 'linked')
  );

  const { data } = useGetConceptsQuery({
    keyword: keyword,
    terminologies:
      selectedOption?.uniqueItemId === 'linked' ? terminologies : [],
    highlight: false,
  });

  const handleOpen = () => {
    setVisible(true);
    if (concept) {
      setSelected(concept);
    }
  };

  const handleClose = () => {
    setSelected(undefined);
    setVisible(false);
    setKeyword('');
    setSelectedOption(
      terminologyOptions.find((o) => o.uniqueItemId === 'linked')
    );
  };

  const handleRadioButtonClick = (
    value: ClassFormType['equivalentClass'][0]
  ) => {
    setSelected(value);
  };

  const handleSubmit = () => {
    setConcept(selected);
    setVisible(false);
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
                  {'label' in concept &&
                    getLanguageVersion({
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
          onEscKeyDown={() => handleClose()}
        >
          <ModalContent>
            <ModalTitle>{t('select-concept')}</ModalTitle>
            <SearchBlock>
              <SearchInput
                labelText={t('search-concept')}
                clearButtonLabel={t('clear-selection')}
                searchButtonLabel={t('search-concept')}
                onChange={(e) => setKeyword(e?.toString() ?? '')}
                debounce={300}
              />
              <SingleSelect
                clearButtonLabel={t('clear-selection')}
                labelText={t('terminology')}
                noItemsText={t('no-terminologies-available')}
                ariaOptionsAvailableText={t('terminologies-available')}
                allowItemAddition={false}
                selectedItem={selectedOption}
                items={terminologyOptions}
                onItemSelectionChange={(e) =>
                  setSelectedOption(
                    e
                      ? e
                      : terminologyOptions.find(
                          (o) => o.uniqueItemId === 'linked'
                        )
                  )
                }
              />
            </SearchBlock>

            {!data || data.totalHitCount < 1 ? (
              <Text>{t('search-concept-by-keyword')}</Text>
            ) : (
              <>
                <Text variant="bold">
                  {t('concept-counts', { count: data?.totalHitCount })}
                </Text>
                <SearchResultWrapper>
                  {data.concepts.map((concept, idx) => (
                    <div
                      key={`concept-result-${idx}`}
                      className={
                        typeof concept.uri !== 'undefined' &&
                        selected &&
                        'identifier' in selected &&
                        selected?.identifier === concept.uri
                          ? 'item-wrapper selected'
                          : 'item-wrapper'
                      }
                    >
                      <RadioButton
                        value={concept.uri ?? ''}
                        checked={
                          typeof concept.uri !== 'undefined' &&
                          selected &&
                          'identifier' in selected &&
                          selected?.identifier === concept.uri
                            ? true
                            : false
                        }
                        onChange={() =>
                          handleRadioButtonClick({
                            label: concept.label,
                            identifier: concept.uri,
                          })
                        }
                      />
                      <div>
                        <Text>
                          {renderHighlighted(
                            getLanguageVersion({
                              data: concept.label,
                              lang: i18n.language,
                              appendLocale: true,
                            })
                          )}
                        </Text>
                        <div className="subtitle">
                          <Text>
                            {getLanguageVersion({
                              data: concept.terminology.label,
                              lang: i18n.language,
                              appendLocale: true,
                            })}
                          </Text>
                          <StaticChip
                            className={
                              concept.status === 'VALID' ? 'valid' : 'other'
                            }
                          >
                            {translateStatus(concept.status, t)}
                          </StaticChip>
                        </div>

                        <Text className="description">
                          {renderHighlighted(
                            getLanguageVersion({
                              data: concept.definition,
                              lang: i18n.language,
                              appendLocale: true,
                            })
                          )}
                        </Text>

                        <ExternalLink href={concept.uri} labelNewWindow="">
                          {concept.uri}
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

  function renderHighlighted(text: string) {
    if (
      keyword === '' ||
      (keyword !== '' && !text.toLowerCase().includes(keyword.toLowerCase()))
    ) {
      return <SanitizedTextContent text={text} />;
    }

    return <SanitizedTextContent text={getHighlighted(text)} />;
  }

  function getHighlighted(text: string): string {
    if (!text.toLowerCase().includes(keyword.toLowerCase())) {
      return text;
    }

    if (
      (text.includes('<a') || text.includes('</a')) &&
      text.includes('>') &&
      (text.indexOf('<a') < text.indexOf('>') ||
        text.indexOf('</a') < text.indexOf('>'))
    ) {
      return text;
    }

    if (text.toLowerCase().indexOf(keyword.toLowerCase()) === 0) {
      return `<span class="highlighted-content">${text.substring(
        0,
        keyword.length
      )}</span>${getHighlighted(text.substring(keyword.length))}`;
    }

    const indexOfTerm = text.toLowerCase().indexOf(keyword.toLowerCase());
    const endOfTerm = indexOfTerm + keyword.length;

    return `${text.substring(
      0,
      indexOfTerm
    )}<span class="highlighted-content">${text.substring(
      indexOfTerm,
      endOfTerm
    )}</span>${getHighlighted(text.substring(endOfTerm))}`;
  }
}
