import LargeModal from '@app/common/components/large-modal';
import MultiColumnSearch from '@app/common/components/multi-column-search';
import { InternalResourcesSearchParams } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { useGetSearchModelsQuery } from '@app/common/components/search-models/search-models.slice';
import { InternalNamespace } from '@app/common/interfaces/model.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  Chip,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
} from 'suomifi-ui-components';

interface ListFormProps {
  initialData: {
    internalNamespaces: InternalNamespace[];
  };
  modelId: string;
  selected: InternalNamespace[];
  visible: boolean;
  applicationProfile?: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  setExternalVisible: () => void;
  setSelected: (value: InternalNamespace[]) => void;
}

export default function ListForm({
  initialData,
  modelId,
  selected,
  visible,
  applicationProfile,
  handleClose,
  handleSubmit,
  setExternalVisible,
  setSelected,
}: ListFormProps) {
  const { t, i18n } = useTranslation('admin');
  const [contentLanguage, setContentLanguage] = useState(i18n.language);

  const [searchParams, setSearchParams] =
    useState<InternalResourcesSearchParams>({
      groups: [],
      pageFrom: 0,
      pageSize: 50,
      query: '',
      resourceTypes: [],
      sortLang: i18n.language,
      status: ['SUGGESTED', 'VALID'],
    });

  const { data: models } = useGetSearchModelsQuery(
    {
      lang: i18n.language,
      urlState: {
        domain: searchParams.groups ?? [],
        lang: contentLanguage ?? i18n.language,
        organization: '',
        page: searchParams.pageFrom ?? 0,
        q: searchParams.query,
        status: searchParams.status ?? [],
        type: '',
        types:
          applicationProfile && searchParams.limitToModelType
            ? [searchParams.limitToModelType]
            : ['LIBRARY'],
      },
    },
    { skip: searchParams.query === '' }
  );

  const resetToInit = () => {
    setSearchParams({
      groups: [],
      pageFrom: 0,
      pageSize: 50,
      query: '',
      resourceTypes: [],
      sortLang: i18n.language,
      status: ['SUGGESTED', 'VALID'],
    });
    setSelected(initialData.internalNamespaces);
    setContentLanguage(i18n.language);
  };

  const handleRadioButtonClick = (ids: string[]) => {
    if (!models) {
      return;
    }

    setSelected([
      ...models.responseObjects
        .filter((obj) => ids.includes(obj.id))
        .map((obj) => ({
          name: obj.label,
          namespace: obj.id,
          prefix: obj.prefix,
        })),
    ]);
  };

  const handleCloseClick = () => {
    resetToInit();
    handleClose();
  };

  return (
    <LargeModal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleCloseClick()}
    >
      <ModalContent>
        <ModalTitle>{t('add-link-to-data-model')}</ModalTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '15px',
          }}
        >
          <Paragraph>{t('add-link-to-data-model-desc')}</Paragraph>

          <Button
            variant="secondary"
            onClick={() => {
              handleCloseClick();
              setExternalVisible();
            }}
            id="add-external-button"
          >
            {t('add-reference-to-external-data-model')}
          </Button>
        </div>

        <MultiColumnSearch
          modelId={modelId}
          primaryColumnName={t('data-model')}
          searchParams={searchParams}
          result={{
            totalHitCount: models?.totalHitCount ?? 0,
            items:
              models?.responseObjects
                .filter(
                  (obj) =>
                    obj.prefix !== modelId &&
                    !initialData.internalNamespaces.some(
                      (ns) => ns.namespace === obj.uri
                    )
                )
                .map((obj) => ({
                  target: {
                    identifier: obj.id,
                    label: getLanguageVersion({
                      data: obj.label,
                      lang: i18n.language,
                      appendLocale: true,
                    }),
                    linkLabel: '',
                    link: obj.uri,
                    note: getLanguageVersion({
                      data: obj.comment,
                      lang: i18n.language,
                      appendLocale: true,
                    }),
                    status: obj.status,
                  },
                  datamodel: {
                    domains: obj.isPartOf,
                    label: getLanguageVersion({
                      data: obj.label,
                      lang: i18n.language,
                      appendLocale: true,
                    }),
                    status: obj.status,
                    type: obj.type,
                    uri: obj.id,
                    version: obj.version,
                  },
                })) ?? [],
          }}
          setSearchParams={setSearchParams}
          setContentLanguage={(lang: string) => setContentLanguage(lang)}
          setSelectedIds={handleRadioButtonClick}
          selectedIds={selected.map((s) => s.namespace)}
          languageVersioned
          noDataModelPicker
          multiTypeSelection={applicationProfile}
          multiSelect
          noDraftStatus
          extra={
            <div
              style={{
                display: 'flex',
                gap: '5px',
                marginBottom: '20px',
              }}
            >
              {selected.map((s) => (
                <Chip
                  removable
                  onClick={() =>
                    setSelected(
                      selected.filter((i) => i.namespace !== s.namespace)
                    )
                  }
                  key={s.namespace}
                >
                  {getLanguageVersion({
                    data: s.name,
                    lang: i18n.language,
                    appendLocale: true,
                  })}
                </Chip>
              ))}
            </div>
          }
        />
      </ModalContent>

      <ModalFooter>
        <Button
          onClick={() => handleSubmit()}
          disabled={
            (initialData.internalNamespaces.length === 0 &&
              selected.length === 0) ||
            (selected.length === initialData.internalNamespaces.length &&
              selected.every((s) =>
                initialData.internalNamespaces
                  .map((i) => i.namespace)
                  .includes(s.namespace)
              ))
          }
          id="submit-button"
        >
          {t('add-selected')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleCloseClick()}
          id="cancel-button"
        >
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </LargeModal>
  );
}
