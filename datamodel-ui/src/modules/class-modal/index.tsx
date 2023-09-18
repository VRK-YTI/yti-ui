import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  IconPlus,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { LargeModal } from './class-modal.styles';
import MultiColumnSearch from '@app/common/components/multi-column-search';
import { InternalClassInfo } from '@app/common/interfaces/internal-class.interface';
import {
  InternalResourcesSearchParams,
  initialSearchData,
  useGetInternalResourcesInfoMutation,
} from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { ResultType } from '@app/common/components/resource-list';

export interface ClassModalProps {
  modelId: string;
  modalButtonLabel?: string;
  mode?: 'create' | 'select';
  handleFollowUp: (
    value?: InternalClassInfo,
    targetIsAppProfile?: boolean
  ) => void;
  applicationProfile?: boolean;
  initialSelected?: string;
  plusIcon?: boolean;
  limitToModelType?: 'LIBRARY' | 'PROFILE';
}

export default function ClassModal({
  modelId,
  modalButtonLabel,
  mode = 'create',
  handleFollowUp,
  applicationProfile,
  initialSelected,
  plusIcon,
  limitToModelType,
}: ClassModalProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(initialSelected ?? '');
  const [resultsFormatted, setResultsFormatted] = useState<ResultType[]>([]);
  const [contentLanguage, setContentLanguage] = useState<string>();
  const [searchInternalResources, result] =
    useGetInternalResourcesInfoMutation();
  const [searchParams, setSearchParams] =
    useState<InternalResourcesSearchParams>(
      initialSearchData(
        i18n.language,
        modelId,
        ResourceType.CLASS,
        limitToModelType
      )
    );

  const handleOpen = () => {
    setVisible(true);
    handleSearch();

    if (initialSelected && initialSelected !== 'selectedId') {
      setSelectedId(initialSelected);
    }
  };

  const handleClose = () => {
    setSelectedId('');
    setSearchParams(
      initialSearchData(
        i18n.language,
        modelId,
        ResourceType.CLASS,
        limitToModelType
      )
    );
    setContentLanguage(undefined);
    setVisible(false);
  };

  const handleSearch = (obj?: InternalResourcesSearchParams) => {
    if (obj) {
      setSearchParams(obj);
    }

    searchInternalResources(obj ?? searchParams);
  };

  const handleSubmit = () => {
    if (selectedId === '') {
      handleClose();
      handleFollowUp();
      return;
    }

    const target = result.data?.responseObjects.find(
      (r) => r.id === selectedId
    );
    handleClose();
    handleFollowUp(
      target,
      searchParams.limitToModelType === 'PROFILE' ?? undefined
    );
  };

  useEffect(() => {
    if (result.isSuccess) {
      setResultsFormatted(
        result.data.responseObjects.map((r) => ({
          target: {
            identifier: r.id,
            label: getLanguageVersion({
              data: r.label,
              lang: contentLanguage ?? i18n.language,
              appendLocale: true,
            }),
            linkLabel: r.curie,
            link: r.id,
            status: translateStatus(r.status, t),
            isValid: r.status === 'VALID',
            note: getLanguageVersion({
              data: r.note,
              lang: contentLanguage ?? i18n.language,
              appendLocale: true,
            }),
          },
          partOf: {
            label: getLanguageVersion({
              data: r.dataModelInfo.label,
              lang: contentLanguage ?? i18n.language,
              appendLocale: true,
            }),
            type: r.dataModelInfo.modelType,
            domains: r.dataModelInfo.groups,
            uri: r.dataModelInfo.uri,
          },
          concept: {
            label: getLanguageVersion({
              data: r.conceptInfo?.conceptLabel,
              lang: contentLanguage ?? i18n.language,
              appendLocale: true,
            }),
            link: r.conceptInfo?.conceptURI,
            partOf: getLanguageVersion({
              data: r.conceptInfo?.terminologyLabel,
              lang: contentLanguage ?? i18n.language,
              appendLocale: true,
            }),
          },
        }))
      );
    }
  }, [result, i18n.language, t, contentLanguage]);

  return (
    <>
      <Button
        variant="secondary"
        icon={modalButtonLabel && !plusIcon ? undefined : <IconPlus />}
        onClick={() => handleOpen()}
        id="add-class-button"
      >
        {modalButtonLabel ? modalButtonLabel : t('add-class')}
      </Button>

      <LargeModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('add-class')}</ModalTitle>
          <MultiColumnSearch
            primaryColumnName={t('class-name')}
            result={{
              totalHitCount: result.data?.totalHitCount ?? 0,
              items: resultsFormatted,
            }}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            searchParams={searchParams}
            setSearchParams={handleSearch}
            setContentLanguage={setContentLanguage}
            modelId={modelId}
            languageVersioned
            multiTypeSelection={applicationProfile}
          />
        </ModalContent>
        <ModalFooter>
          {mode === 'create' ? (
            <>
              <Button
                disabled={selectedId === ''}
                onClick={() => handleSubmit()}
                id={
                  applicationProfile
                    ? 'select-class-button'
                    : 'create-subclass-button'
                }
              >
                {applicationProfile
                  ? t('select-class')
                  : t('create-subclass-for-selected')}
              </Button>
              {!applicationProfile && (
                <Button
                  icon={<IconPlus />}
                  disabled={selectedId !== ''}
                  onClick={() => handleSubmit()}
                  id="create-class-button"
                >
                  {t('create-new-class')}
                </Button>
              )}
              <Button
                variant="secondaryNoBorder"
                onClick={() => handleClose()}
                id="cancel-button"
              >
                {t('cancel-variant')}
              </Button>
            </>
          ) : (
            <>
              <Button
                disabled={selectedId === ''}
                onClick={() => handleSubmit()}
                id="submit-button"
              >
                {modalButtonLabel}
              </Button>
              <Button
                variant="secondaryNoBorder"
                onClick={() => handleClose()}
                id="cancel-button"
              >
                {t('cancel-variant')}
              </Button>
            </>
          )}
        </ModalFooter>
      </LargeModal>
    </>
  );
}
