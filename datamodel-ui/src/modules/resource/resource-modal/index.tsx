import MultiColumnSearch from '@app/common/components/multi-column-search';
import { ResultType } from '@app/common/components/resource-list';
import {
  InternalResourcesSearchParams,
  initialSearchData,
  useGetInternalResourcesInfoMutation,
} from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import WideModal from '@app/common/components/wide-modal';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import {
  translateResourceAddition,
  translateResourceName,
  translateStatus,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  IconPlus,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import format from 'yti-common-ui/formatted-date/format';
import { Locale } from 'yti-common-ui/locale-chooser/use-locales';
import { useBreakpoints } from 'yti-common-ui/media-query';

interface ResourceModalProps {
  modelId: string;
  type: ResourceType;
  buttonTranslations: {
    useSelected: string;
    createNew?: string;
    openButton?: string;
  };
  handleFollowUp: (value?: { label: string; uri: string }) => void;
  defaultSelected?: string;
  buttonIcon?: boolean;
  applicationProfile?: boolean;
}

export default function ResourceModal({
  modelId,
  type,
  buttonTranslations,
  handleFollowUp,
  defaultSelected,
  buttonIcon,
  applicationProfile,
}: ResourceModalProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(
    defaultSelected ? defaultSelected : ''
  );
  const [contentLanguage, setContentLanguage] = useState<string>();
  const [resultsFormatted, setResultsFormatted] = useState<ResultType[]>([]);
  const [searchParams, setSearchParams] =
    useState<InternalResourcesSearchParams>(
      initialSearchData(i18n.language, modelId, type)
    );
  const [searchInternalResources, result] =
    useGetInternalResourcesInfoMutation();

  const handleSearch = (obj?: InternalResourcesSearchParams) => {
    if (obj) {
      setSearchParams(obj);
    }

    searchInternalResources(obj ?? searchParams);
  };

  const handleOpen = () => {
    setVisible(true);
    handleSearch();

    if (defaultSelected && defaultSelected !== selectedId) {
      setSelectedId(defaultSelected);
    }
  };

  const handleClose = () => {
    setSearchParams(initialSearchData(i18n.language, modelId, type));
    setContentLanguage(undefined);
    setVisible(false);
    setSelectedId('');
  };

  const handleSubmit = () => {
    if (!selectedId || selectedId === '' || !result.data) {
      handleFollowUp();
      handleClose();
      return;
    }

    const selectedObj = result.data.responseObjects.find(
      (obj) => obj.id === selectedId
    );

    if (selectedObj) {
      handleFollowUp({
        label: selectedObj.curie,
        uri: selectedObj.id,
      });
    }
    handleClose();
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
            modified: format(r.modified, (i18n.language as Locale) ?? 'fi'),
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
  }, [result, i18n.language, contentLanguage, t]);

  return (
    <div>
      <Button
        variant="secondary"
        icon={buttonIcon ? <IconPlus /> : undefined}
        onClick={() => handleOpen()}
        id="add-resource-button"
      >
        {buttonTranslations.openButton ??
          translateResourceAddition(type, t, applicationProfile)}
      </Button>

      <WideModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => setVisible(false)}
      >
        <ModalContent>
          <ModalTitle>{translateResourceAddition(type, t)}</ModalTitle>
          <MultiColumnSearch
            primaryColumnName={translateResourceName(
              type,
              t,
              applicationProfile
            )}
            result={{
              totalHitCount: result.data?.totalHitCount ?? 0,
              items: resultsFormatted,
            }}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            searchParams={searchParams}
            setSearchParams={handleSearch}
            setContentLanguage={setContentLanguage}
            applicationProfile={applicationProfile}
            resourceRestriction
            languageVersioned
            modelId={modelId}
          />
        </ModalContent>

        <ModalFooter>
          <Button
            disabled={selectedId === ''}
            onClick={() => handleSubmit()}
            id="use-selected-button"
          >
            {buttonTranslations.useSelected}
          </Button>

          {buttonTranslations.createNew && (
            <Button
              variant="secondary"
              icon={<IconPlus />}
              disabled={selectedId !== ''}
              onClick={() => handleSubmit()}
              id="create-new-button"
            >
              {buttonTranslations.createNew}
            </Button>
          )}

          <Button
            variant="secondaryNoBorder"
            onClick={() => handleClose()}
            id="cancel-button"
          >
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </WideModal>
    </div>
  );
}
