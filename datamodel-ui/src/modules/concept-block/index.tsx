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
import { ConceptType } from '@app/common/interfaces/concept-interface';

interface ConceptBlockProps {
  concept?: ConceptType;
  setConcept: (value: ConceptType | undefined) => void;
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
  const [selected, setSelected] = useState<ConceptType | undefined>(concept);
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

  const handleRadioButtonClick = (value: ClassFormType['concept']) => {
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
                {getLanguageVersion({
                  data: concept.label,
                  lang: i18n.language,
                })}
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
                noItemsText={t('no-terminologies-available') as string}
                ariaOptionsAvailableText={
                  t('terminologies-available') as string
                }
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
                  {data.concepts.map((c, idx) => (
                    <div
                      key={`concept-result-${idx}`}
                      className={
                        typeof c.uri !== 'undefined' &&
                        selected &&
                        'identifier' in selected &&
                        selected?.identifier === c.uri
                          ? 'item-wrapper selected'
                          : 'item-wrapper'
                      }
                    >
                      <RadioButton
                        value={c.uri ?? ''}
                        checked={
                          typeof c.uri !== 'undefined' &&
                          selected &&
                          selected?.conceptURI === c.uri
                            ? true
                            : false
                        }
                        onChange={() =>
                          handleRadioButtonClick({
                            label: c.label,
                            conceptURI: c.uri,
                            definition: c.definition,
                            status: c.status,
                            terminology: c.terminology,
                          })
                        }
                      />
                      <div>
                        <Text>
                          {renderHighlighted(
                            getLanguageVersion({
                              data: c.label,
                              lang: i18n.language,
                              appendLocale: true,
                            })
                          )}
                        </Text>
                        <div className="subtitle">
                          <Text>
                            {getLanguageVersion({
                              data: c.terminology.label,
                              lang: i18n.language,
                              appendLocale: true,
                            })}
                          </Text>
                          <StaticChip
                            className={c.status === 'VALID' ? 'valid' : 'other'}
                          >
                            {translateStatus(c.status, t)}
                          </StaticChip>
                        </div>

                        <Text className="description">
                          {renderHighlighted(
                            getLanguageVersion({
                              data: c.definition,
                              lang: i18n.language,
                              appendLocale: true,
                            })
                          )}
                        </Text>

                        <ExternalLink
                          href={c.uri}
                          labelNewWindow={t('link-opens-new-window-external', {
                            ns: 'common',
                          })}
                        >
                          {c.uri}
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
