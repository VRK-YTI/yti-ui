import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Chip,
  IconPlus,
  Modal,
  ModalContent,
  ModalFooter,
  Text,
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
import FilterBlock, { FilterType } from './filter-block';
import ResultsAndInfoBlock from './results-and-info-block';
import { SelectedChipsWrapper } from './code-list-modal.styles';
import {
  ButtonFooter,
  NarrowModal,
  SimpleModalContent,
} from '../as-file-modal/as-file-modal.styles';
import LargeModal from '@app/common/components/large-modal';

export default function CodeListModal({
  initialData,
  extendedView,
  modalTitle,
  showConfirmModal,
  setData,
  hideAddButton,
  isOpen,
  setOpen,
}: {
  initialData: ModelCodeList[];
  extendedView?: boolean;
  showConfirmModal?: boolean;
  modalTitle?: string;
  setData: (value: ModelCodeList[]) => void;
  hideAddButton?: boolean;
  isOpen?: boolean;
  setOpen?: (open: boolean) => void;
}) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleClose = () => {
    setVisible(false);
    setConfirmed(false);
    if (setOpen) {
      setOpen(false);
    }
  };

  useEffect(() => {
    setVisible(isOpen ? isOpen : false);
  }, [isOpen]);

  const renderConfirmModal = () => (
    <NarrowModal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={handleClose}
      variant={isSmall ? 'smallScreen' : 'default'}
    >
      <SimpleModalContent>
        <ModalTitle>{t('use-codelist-values')}</ModalTitle>
        <Text>{t('manual-input-delete-warning')}</Text>
        <ButtonFooter>
          <Button onClick={() => setConfirmed(true)}>
            {t('continue-selecting-codelists')}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            {t('cancel')}
          </Button>
        </ButtonFooter>
      </SimpleModalContent>
    </NarrowModal>
  );

  const renderWideModal = () => {
    return (
      <LargeModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={handleClose}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <CodeListModalContent
          initialData={initialData}
          extendedView={true}
          modalTitle={modalTitle}
          close={handleClose}
          setData={setData}
        />
      </LargeModal>
    );
  };

  const renderModal = () => {
    return (
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={handleClose}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <CodeListModalContent
          initialData={initialData}
          modalTitle={modalTitle}
          close={handleClose}
          setData={setData}
        />
      </Modal>
    );
  };

  return (
    <>
      {hideAddButton ? (
        <></>
      ) : (
        <Button
          variant="secondary"
          icon={<IconPlus />}
          onClick={() => setVisible(true)}
          id="add-reference-data-button"
        >
          {t('add-reference-data')}
        </Button>
      )}
      {showConfirmModal && !confirmed && renderConfirmModal()}
      {(confirmed || !showConfirmModal) && extendedView && renderWideModal()}
      {(confirmed || !showConfirmModal) && !extendedView && renderModal()}
    </>
  );
}

function CodeListModalContent({
  initialData,
  extendedView,
  modalTitle,
  close,
  setData,
}: {
  initialData: ModelCodeList[];
  extendedView?: boolean;
  modalTitle?: string;
  close: () => void;
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
  const [selected, setSelected] = useState<ModelCodeList[]>(initialData ?? []);
  const [currPage, setCurrPage] = useState(1);
  const { data: codes, isSuccess } = useGetCodesQuery({
    lang: i18n.language ?? 'fi',
    searchTerm: filter.keyword !== '' ? filter.keyword : undefined,
    codeRegistryCodeValue: !['', 'all-groups'].includes(filter.group)
      ? filter.group
      : undefined,
    pageFrom: currPage,
    status: filter.status,
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
    setSelected(initialData);
    close();
    setCurrPage(1);
  };

  const handleSubmit = () => {
    if (!codes) {
      return;
    }

    setData(selected);
    handleClose();
  };

  useEffect(() => {
    setSelected(initialData);
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
                data: select.prefLabel,
                lang: i18n.language,
              });
              return (
                <Chip
                  key={`selected-code-${select.id}`}
                  removable
                  onClick={() =>
                    setSelected(selected.filter((s) => s.id !== select.id))
                  }
                >
                  {label !== '' ? label : select.id}
                </Chip>
              );
            })}
          </SelectedChipsWrapper>
        )}

        <ResultsAndInfoBlock
          codes={codes}
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
          disabled={
            initialData.length === 0
              ? selected.length < 1
              : selected.length === initialData.length &&
                selected.every((s) =>
                  initialData.map((d) => d.id).includes(s.id)
                )
          }
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
