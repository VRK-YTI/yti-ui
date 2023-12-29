import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
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
import { SearchBlock, SearchResultWrapper } from './concept-block.styles';
import { useGetConceptsQuery } from '@app/common/components/concept-search/concept-search.slice';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import { ConceptType } from '@app/common/interfaces/concept-interface';
import { DetachedPagination } from 'yti-common-ui/pagination';
import ConceptView from '../concept-view';

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
  const [currentPage, setCurrentPage] = useState(1);

  const [terminologyOptions] = useState([
    {
      labelText: t('terminologies-linked-to-data-model'),
      uniqueItemId: 'linked',
    },
    {
      labelText: t('all-terminologies'),
      uniqueItemId: 'all',
    },
  ]);
  const [selectedOption, setSelectedOption] = useState(
    terminologyOptions.find((o) => o.uniqueItemId === 'linked')
  );

  // set to false if no terminologies are linked to data model, and the
  // uniqueItemId is 'linked'
  const [hasTerminologies, setHasTerminologies] = useState<boolean>(false);
  useEffect(() => {
    setHasTerminologies(
      !(selectedOption?.uniqueItemId === 'linked' && terminologies.length === 0)
    );
  }, [selectedOption, terminologies]);

  const { data } = useGetConceptsQuery(
    {
      keyword: keyword,
      terminologies:
        selectedOption?.uniqueItemId === 'linked' ? terminologies : [],
      highlight: false,
      pageFrom: currentPage,
    },
    {
      skip: !hasTerminologies, // no need to fetch if we're not listing concepts
    }
  );

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

  const handleSearchChange = (
    value: string | { labelText: string; uniqueItemId: string } | null
  ) => {
    if (typeof value === 'string') {
      setKeyword(value);
    } else {
      setSelectedOption(
        value === null
          ? terminologyOptions.find((o) => o.uniqueItemId === 'linked')
          : value
      );
    }
    setCurrentPage(1);
  };

  return (
    <>
      <BasicBlock
        largeGap
        title={`${t('concept', { ns: 'common' })} (dcterms:subject)`}
      >
        {!concept ? (
          <InlineAlert>{t('choose-concept-from-terminology')}</InlineAlert>
        ) : (
          <ConceptView data={concept} />
        )}
        <div>
          <Button
            variant="secondary"
            style={{
              width: 'min-content',
              marginLeft: '1px',
              whiteSpace: 'nowrap',
            }}
            onClick={() => handleOpen()}
            id="select-concept-button"
          >
            {t('select-concept')}
          </Button>
          {concept && (
            <Button
              variant="secondary"
              style={{
                width: 'min-content',
                marginLeft: '10px',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setConcept(undefined)}
              id="delete-concept-button"
            >
              {t('delete-concept')}
            </Button>
          )}
        </div>
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
                onChange={(e) => handleSearchChange(e?.toString() ?? '')}
                debounce={300}
                id="concept-search-input"
              />
              <SingleSelect
                clearButtonLabel={t('clear-selection')}
                labelText={t('terminology', { ns: 'common' })}
                noItemsText={t('no-terminologies-available')}
                ariaOptionsAvailableText={t('terminologies-available')}
                allowItemAddition={false}
                selectedItem={selectedOption}
                items={terminologyOptions}
                onItemSelectionChange={(e) => handleSearchChange(e)}
                id="terminology-select"
              />
            </SearchBlock>

            {!hasTerminologies ? (
              <Text>{t('no-linked-terminologies', { ns: 'common' })}</Text>
            ) : !data || data.totalHitCount < 1 ? (
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
                        onKeyPress={(e) =>
                          e.key === 'Enter' &&
                          handleRadioButtonClick({
                            label: c.label,
                            conceptURI: c.uri,
                            definition: c.definition,
                            status: c.status,
                            terminology: c.terminology,
                          })
                        }
                        id={`concept-radio-button-${c.uri}`}
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
                <DetachedPagination
                  currentPage={currentPage}
                  maxPages={Math.ceil((data?.totalHitCount ?? 0) / 20)}
                  maxTotal={20}
                  setCurrentPage={(number) => setCurrentPage(number)}
                />
              </>
            )}
          </ModalContent>

          <ModalFooter>
            <Button
              disabled={!selected}
              onClick={() => handleSubmit()}
              id="submit-button"
            >
              {t('select-concept')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleClose()}
              id="cancel-button"
            >
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
