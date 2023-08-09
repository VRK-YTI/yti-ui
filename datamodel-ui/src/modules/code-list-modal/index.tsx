import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Chip,
  IconPlus,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import {
  useGetCodeRegistriesQuery,
  useGetCodesQuery,
} from '@app/common/components/code/code.slice';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { ModelCodeList } from '@app/common/interfaces/model.interface';
import { DetachedPagination } from 'yti-common-ui/pagination';
import WideModal from '@app/common/components/wide-modal';
import FilterBlock, { FilterType } from './filter-block';
import ResultsAndInfoBlock from './results-and-info-block';
import { SelectedChipsWrapper } from './code-list-modal.styles';

export default function CodeListModal({
  initialData,
  extendedView,
  modalTitle,
  setData,
}: {
  initialData: ModelCodeList[];
  extendedView?: boolean;
  modalTitle?: string;
  setData: (value: ModelCodeList[]) => void;
}) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);

  if (extendedView) {
    return (
      <>
        <Button
          variant="secondary"
          icon={<IconPlus />}
          onClick={() => setVisible(true)}
          id="add-reference-data-button"
        >
          {t('add-reference-data')}
        </Button>

        <WideModal
          appElementId="__next"
          visible={visible}
          onEscKeyDown={() => setVisible(false)}
          variant={isSmall ? 'smallScreen' : 'default'}
        >
          <CodeListModalContent
            initialData={initialData}
            extendedView={true}
            modalTitle={modalTitle}
            setVisible={setVisible}
            setData={setData}
          />
        </WideModal>
      </>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        icon={<IconPlus />}
        onClick={() => setVisible(true)}
        id="add-reference-data-button"
      >
        {t('add-reference-data')}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <CodeListModalContent
          initialData={initialData}
          modalTitle={modalTitle}
          setVisible={setVisible}
          setData={setData}
        />
      </Modal>
    </>
  );
}

function CodeListModalContent({
  initialData,
  extendedView,
  modalTitle,
  setVisible,
  setData,
}: {
  initialData: ModelCodeList[];
  extendedView?: boolean;
  modalTitle?: string;
  setVisible: (value: boolean) => void;
  setData: (value: ModelCodeList[]) => void;
}) {
  const { t, i18n } = useTranslation('admin');
  const [defaultGroup] = useState({
    name: t('all-groups'),
    labelText: t('all-groups'),
    uniqueItemId: 'all-groups',
  });
  const [filter, setFilter] = useState<FilterType>({
    keyword: '',
    server: 'koodistot.suomi.fi',
    group: '',
    status: '',
  });
  const [selected, setSelected] = useState<string[]>(
    initialData.map((d) => d.id) ?? []
  );
  const [currPage, setCurrPage] = useState(1);
  const { data: codes, isSuccess } = useGetCodesQuery({
    lang: i18n.language ?? 'fi',
    searchTerm: filter.keyword !== '' ? filter.keyword : undefined,
    codeRegistryCodeValue: !['', 'all-groups'].includes(filter.group)
      ? filter.group
      : undefined,
    pageFrom: currPage,
  });
  const { data: codeRegistries } = useGetCodeRegistriesQuery();

  const groups = useMemo(
    () => [
      defaultGroup,
      ...(codeRegistries?.results
        .map((registry) => ({
          name: getLanguageVersion({
            data: registry.prefLabel,
            lang: i18n.language,
            appendLocale: true,
          }),
          labelText: getLanguageVersion({
            data: registry.prefLabel,
            lang: i18n.language,
            appendLocale: true,
          }),
          uniqueItemId: registry.codeValue,
        }))
        .sort((a, b) => (a.labelText > b.labelText ? 1 : -1)) ?? []),
    ],
    [codeRegistries, i18n.language, defaultGroup]
  );

  const handleClose = () => {
    setFilter({
      keyword: '',
      server: 'koodistot.suomi.fi',
      group: '',
      status: '',
    });
    setSelected(initialData.map((d) => d.id));
    setVisible(false);
    setCurrPage(1);
  };

  const handleSubmit = () => {
    if (!codes) {
      return;
    }

    setData(
      codes.results
        .filter((code) => selected.includes(code.uri))
        .map((code) => ({
          prefLabel: code.prefLabel,
          status: code.status,
          id: code.uri,
        }))
    );
    handleClose();
  };

  useEffect(() => {
    setSelected(initialData.map((d) => d.id));
  }, [initialData]);

  return (
    <>
      <ModalContent>
        <ModalTitle>
          {modalTitle ?? t('add-reference-to-reference-data')}
        </ModalTitle>

        <FilterBlock
          filter={filter}
          groups={groups}
          extendedView={extendedView}
          setFilter={setFilter}
          setCurrPage={setCurrPage}
        />

        {selected.length > 0 && (
          <SelectedChipsWrapper>
            {selected.map((select) => {
              const label = getLanguageVersion({
                data: codes?.results.find((code) => code.uri === select)
                  ?.prefLabel,
                lang: i18n.language,
              });
              return (
                <Chip
                  key={`selected-code-${select}`}
                  removable
                  onClick={() =>
                    setSelected(selected.filter((s) => s !== select))
                  }
                >
                  {label !== '' ? label : select}
                </Chip>
              );
            })}
          </SelectedChipsWrapper>
        )}

        <ResultsAndInfoBlock
          codes={codes}
          filter={filter}
          isSuccess={isSuccess}
          selected={selected}
          extendedView={extendedView}
          setSelected={setSelected}
        />

        {codes && codes.meta.totalResults > 20 && (
          <DetachedPagination
            currentPage={currPage}
            maxPages={Math.ceil(codes.meta.totalResults / 20)}
            maxTotal={20}
            setCurrentPage={(e) => setCurrPage(e)}
          />
        )}
      </ModalContent>

      <ModalFooter>
        <Button
          disabled={selected.length < 1}
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
    </>
  );
}
