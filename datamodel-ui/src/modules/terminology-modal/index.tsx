import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import {
  TerminologySearchParams,
  useGetTerminologiesMutation,
} from '@app/common/components/terminology-search/search-terminology.slice';
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
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  SearchInput,
  SingleSelect,
  SingleSelectData,
  Text,
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

export default function TerminologyModal() {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [initialSelected] = useState([]);
  const [selected, setSelected] = useState<
    { id: string; title: string; uri: string }[]
  >([]);
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

  const handleCheckboxClick = (id: string) => {
    if (selected.some((s) => s.id === id)) {
      setSelected(selected.filter((s) => s.id !== id));
      return;
    }

    const title =
      getLanguageVersion({
        data: terminologies.find((result) => result.id === id)?.label,
        lang: i18n.language,
      }) ?? '';
    const uri = terminologies.find((result) => result.id === id)?.uri ?? '';
    setSelected([...selected, { id: id, title: title, uri: uri }]);
  };

  const handleChipClick = (id: string) => {
    setSelected(selected.filter((s) => s.id !== id));
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

  const handleSearchChange = (
    key: keyof TerminologySearchParams,
    value: typeof searchParams[keyof TerminologySearchParams]
  ) => {
    console.log(value);
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
    handleClose();
  };

  return (
    <>
      <Button
        variant="secondary"
        icon="plus"
        id="terminologies"
        onClick={() => setVisible(true)}
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
            disabled={isEqual(initialSelected, selected)}
            onClick={() => handleSubmit()}
          >
            {t('add-selected')}
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
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
          <SearchInput
            labelText={t('search-for-terminology')}
            clearButtonLabel={t('clear-all-selections')}
            searchButtonLabel={t('search')}
            defaultValue={searchParams.query}
            onBlur={(e) => handleSearchChange('query', e?.target.value ?? '')}
            onSearch={(e) => handleSearchChange('query', e ?? '')}
            debounce={500}
          />

          <SingleSelect
            labelText={t('information-domain')}
            visualPlaceholder={t('input-or-select')}
            // This text can be left empty because item addition isn't enabled
            itemAdditionHelpText=""
            ariaOptionsAvailableText={t('information-domains-available')}
            clearButtonLabel={t('clear-all-selections')}
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
          />
        </SearchBlock>

        {selected.length > 0 && (
          <SelectedChipBlock>
            {selected.map((s) => (
              <Chip key={s.id} removable onClick={() => handleChipClick(s.id)}>
                {s.title}
              </Chip>
            ))}
          </SelectedChipBlock>
        )}
      </div>
    );
  }

  function renderResults() {
    return (
      <div>
        <Text>{t('add-refrence-to-terminologies-description')}</Text>
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
                  checked={selected.map((s) => s.id).includes(result.id)}
                  onClick={() => handleCheckboxClick(result.id)}
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
                    <StatusChip $isValid={result.status === 'VALID'}>
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
                  <ExternalLink href={result.uri} labelNewWindow="">
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
