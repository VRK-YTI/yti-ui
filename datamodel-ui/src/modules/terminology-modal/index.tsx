import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import {
  TerminologySearchParams,
  useGetTerminologiesMutation,
} from '@app/common/components/terminology-search/search-terminology.slice';
import { ModelTerminology } from '@app/common/interfaces/model.interface';
import { Terminology } from '@app/common/interfaces/terminology.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { isEqual } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  ExternalLink,
  IconPlus,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  SingleSelect,
  SingleSelectData,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { DetachedPagination } from 'yti-common-ui/pagination';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import {
  SearchBlock,
  SelectedChipBlock,
  SearchResult,
  SearchResultCount,
  SearchResultsBlock,
  SearchResultSubTitle,
  StatusChip,
} from './terminology-modal.styles';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';

export default function TerminologyModal({
  addedTerminologies,
  setFormData,
}: {
  addedTerminologies: ModelTerminology[];
  setFormData: (t: ModelTerminology[]) => void;
}) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<ModelTerminology[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: serviceCategoriesResult,
    isSuccess: serviceCategoriesIsSuccess,
  } = useGetServiceCategoriesQuery(i18n.language);

  const [searchParams, setSearchParams] = useState<TerminologySearchParams>({
    query: '',
    groups: [],
    pageFrom: 0,
  });
  const [searchTerminologies, results] = useGetTerminologiesMutation();
  const [terminologies, setTerminologies] = useState<Terminology[]>([]);

  const serviceCategories: SingleSelectData[] = useMemo(() => {
    if (!serviceCategoriesIsSuccess) {
      return [];
    }

    const returnValue = [
      {
        labelText: t('information-domains-all'),
        uniqueItemId: '-1',
      },
    ];

    return returnValue.concat(
      serviceCategoriesResult.map((result) => ({
        labelText: getLanguageVersion({
          data: result.label,
          lang: i18n.language,
        }),
        uniqueItemId: result.identifier,
      }))
    );
  }, [serviceCategoriesResult, serviceCategoriesIsSuccess, t, i18n.language]);

  const handleCheckboxClick = (uri: string) => {
    if (selected.some((s) => s.uri === uri)) {
      setSelected(selected.filter((s) => s.uri !== uri));
      return;
    }

    const terminology = terminologies.find((result) => result.uri === uri);
    setSelected([...selected, { label: terminology?.label ?? {}, uri }]);
  };

  const handleChipClick = (uri: string) => {
    setSelected(selected.filter((s) => s.uri !== uri));
  };

  const handleSearch = (obj?: TerminologySearchParams) => {
    if (obj) {
      setSearchParams(obj);
    }

    searchTerminologies(obj ?? searchParams);
  };

  useEffect(() => {
    if (results.isSuccess) {
      setTerminologies(results.data.terminologies);
    }
  }, [results]);

  useEffect(() => {
    setSelected(addedTerminologies);
  }, [visible, addedTerminologies]);

  const handleSearchChange = (
    key: keyof TerminologySearchParams,
    value: (typeof searchParams)[keyof TerminologySearchParams]
  ) => {
    if (key === 'groups' && isEqual(value, ['-1'])) {
      setSearchParams({ ...searchParams, [key]: [], ['pageFrom']: 0 });
      setCurrentPage(1);
      return;
    }
    setSearchParams({ ...searchParams, ['pageFrom']: 0, [key]: value });
    setCurrentPage(1);
  };

  useEffect(() => {
    handleSearch(searchParams);
  }, [searchParams]);

  const handleClose = () => {
    setCurrentPage(1);
    setSearchParams({
      query: '',
      groups: [],
      pageFrom: 0,
    });
    setSelected([]);
    setVisible(false);
  };

  const handleSubmit = () => {
    setFormData(selected);
    handleClose();
  };

  return (
    <>
      <Button
        variant="secondary"
        icon={<IconPlus />}
        onClick={() => setVisible(true)}
        id="add-terminology-button"
      >
        {t('add-terminology')}
      </Button>
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('add-reference-to-terminologies')}</ModalTitle>
          {renderSearchBlock()}
          {renderResults()}
        </ModalContent>
        <ModalFooter>
          <Button
            disabled={selected.length === 0 && addedTerminologies.length === 0}
            onClick={() => handleSubmit()}
            id="submit-button"
          >
            {t('add-selected')}
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
    </>
  );

  function renderSearchBlock() {
    return (
      <div>
        <SearchBlock $isSmall={isSmall}>
          <TextInput
            defaultValue={searchParams.query}
            labelText={t('search-for-terminology')}
            onChange={(e) => handleSearchChange('query', e?.toString() ?? '')}
            debounce={300}
            id="search-input"
            maxLength={TEXT_INPUT_MAX}
          />

          <SingleSelect
            labelText={t('information-domain')}
            visualPlaceholder={t('input-or-select')}
            itemAdditionHelpText=""
            ariaOptionsAvailableText={
              t('information-domains-available') as string
            }
            clearButtonLabel={t('clear-all-selections') as string}
            items={serviceCategories}
            defaultSelectedItem={serviceCategories.find(
              (category) => category.uniqueItemId === '-1'
            )}
            onItemSelect={(e) =>
              handleSearchChange(
                'groups',
                e !== null && e !== '-1' ? [e] : ['-1']
              )
            }
            id="information-domain-select"
          />
        </SearchBlock>

        {selected.length > 0 && (
          <SelectedChipBlock id="selected-chips">
            {selected.map((s) => {
              const label = getLanguageVersion({
                data: s.label,
                lang: i18n.language,
                appendLocale: true,
              });

              return (
                <Chip
                  key={s.uri}
                  removable
                  onClick={() => handleChipClick(s.uri)}
                  id={`selected-terminology-${s.uri}`}
                >
                  {label !== '' ? label : s.uri}
                </Chip>
              );
            })}
          </SelectedChipBlock>
        )}
      </div>
    );
  }

  function renderResults() {
    return (
      <div>
        <SearchResultCount>
          <Text variant="bold">
            {t('terminology-counts', {
              count: results.data?.totalHitCount ?? 0,
            })}
          </Text>
        </SearchResultCount>

        <SearchResultsBlock>
          {terminologies.map((result) => (
            <SearchResult key={`terminology-result-${result.id}`}>
              <div>
                <Checkbox
                  checked={selected.map((s) => s.uri).includes(result.uri)}
                  onClick={() => handleCheckboxClick(result.uri)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCheckboxClick(result.uri);
                    }
                  }}
                  id={`checkbox-${result.uri}`}
                />
              </div>

              <div>
                <div>
                  {renderHighlighted(
                    getLanguageVersion({
                      data: result.label,
                      lang: i18n.language,
                    })
                  )}
                </div>

                <SearchResultSubTitle>
                  <span>
                    <StatusChip status={result.status}>
                      {translateStatus(result.status, t)}
                    </StatusChip>
                  </span>
                </SearchResultSubTitle>

                <div className="result-description">
                  {result.description
                    ? renderHighlighted(
                        getLanguageVersion({
                          data: result.description,
                          lang: i18n.language,
                        })
                      )
                    : t('no-description', { ns: 'common' })}
                </div>

                <div>
                  <ExternalLink
                    href={result.uri}
                    labelNewWindow={t('link-opens-new-window-external', {
                      ns: 'common',
                    })}
                  >
                    <SanitizedTextContent text={result.uri} />
                  </ExternalLink>
                </div>
              </div>
            </SearchResult>
          ))}
        </SearchResultsBlock>
        <DetachedPagination
          currentPage={currentPage}
          maxPages={Math.ceil((results.data?.totalHitCount ?? 0) / 10)}
          maxTotal={10}
          setCurrentPage={(number) => {
            handleSearchChange('pageFrom', (number - 1) * 10);
            setCurrentPage(number);
          }}
        />
      </div>
    );
  }

  function renderHighlighted(text: string) {
    if (
      searchParams.query === '' ||
      (searchParams.query !== '' &&
        !text.toLowerCase().includes(searchParams.query.toLowerCase()))
    ) {
      return text;
    }

    return <SanitizedTextContent text={getHighlighted(text)} />;
  }

  function getHighlighted(text: string): string {
    if (!text.toLowerCase().includes(searchParams.query.toLowerCase())) {
      return text;
    }

    if (text.toLowerCase().indexOf(searchParams.query.toLowerCase()) === 0) {
      return `<span class="highlighted-content">${text.substring(
        0,
        searchParams.query.length
      )}</span>${getHighlighted(text.substring(searchParams.query.length))}`;
    }

    const indexOfTerm = text
      .toLowerCase()
      .indexOf(searchParams.query.toLowerCase());
    const endOfTerm = indexOfTerm + searchParams.query.length;

    return `${text.substring(
      0,
      indexOfTerm
    )}<span class="highlighted-content">${text.substring(
      indexOfTerm,
      endOfTerm
    )}</span>${getHighlighted(text.substring(endOfTerm))}`;
  }
}
