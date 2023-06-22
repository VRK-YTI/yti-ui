import MultiColumnSearch from '@app/common/components/multi-column-search';
import { ResultType } from '@app/common/components/resource-list';
import {
  InternalResourcesSearchParams,
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
  };
  handleFollowUp: (value?: { label: string; uri: string }) => void;
  buttonIcon?: boolean;
  applicationProfile?: boolean;
}

export default function ResourceModal({
  modelId,
  type,
  buttonTranslations,
  handleFollowUp,
  buttonIcon,
  applicationProfile,
}: ResourceModalProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [contentLanguage, setContentLanguage] = useState<string>();
  const [resultsFormatted, setResultsFormatted] = useState<ResultType[]>([]);
  const [searchParams, setSearchParams] =
    useState<InternalResourcesSearchParams>({
      query: '',
      status: ['VALID', 'DRAFT'],
      groups: [],
      sortLang: i18n.language,
      pageSize: 50,
      pageFrom: 0,
      limitToDataModel: modelId,
      limitToModelType: 'LIBRARY',
      fromAddedNamespaces: true,
      resourceTypes: [type],
    });
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
  };

  const handleClose = () => {
    setSearchParams({
      query: '',
      status: ['VALID', 'DRAFT'],
      groups: [],
      sortLang: i18n.language,
      pageSize: 50,
      pageFrom: 0,
      limitToDataModel: modelId,
      limitToModelType: 'LIBRARY',
      resourceTypes: [type],
    });
    setContentLanguage(undefined);
    setVisible(false);
  };

  const handleSubmit = () => {
    if (!selectedId || selectedId === '' || !result.data) {
      handleFollowUp();
      return;
    }

    const selectedObj = result.data.responseObjects.find(
      (obj) => obj.identifier === selectedId
    );

    if (selectedObj) {
      const domain =
        selectedObj.namespace[selectedObj.namespace.length - 1] === '/'
          ? selectedObj.namespace.slice(0, -1)?.split('/').pop()
          : selectedObj.namespace.split('/').pop();
      handleFollowUp({
        label: `${domain}:${selectedObj.identifier}`,
        uri: selectedObj.id,
      });
    } else {
      handleClose();
    }
  };

  const getLinkLabel = (ns: string, id: string) => {
    const namespace =
      ns
        .split('/')
        .filter((val) => val !== '')
        .pop()
        ?.replace('#', '') ?? ns;
    return `${namespace}:${id}`;
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
            linkLabel: getLinkLabel(r.namespace, r.identifier),
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
          subClass: {
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
        {translateResourceAddition(type, t)}
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
            primaryColumnName={translateResourceName(type, t)}
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
