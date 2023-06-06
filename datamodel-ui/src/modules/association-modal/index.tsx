import { useEffect, useState } from 'react';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import MultiColumnSearch from '@app/common/components/multi-column-search';
import { LargeModal } from './association-modal.styles';
import { useTranslation } from 'next-i18next';
import {
  InternalResourcesSearchParams,
  useGetInternalResourcesInfoMutation,
} from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import format from 'yti-common-ui/formatted-date/format';
import { Locale } from 'yti-common-ui/locale-chooser/use-locales';
import { ResultType } from '@app/common/components/resource-list';

interface AssociationModalProps {
  buttonTranslations: {
    useSelected: string;
    createNew?: string;
  };
  handleFollowUp: (value?: { label: string; uri: string }) => void;
  buttonIcon?: boolean;
  modelId: string;
}

export default function AssociationModal({
  buttonTranslations,
  handleFollowUp,
  buttonIcon,
  modelId,
}: AssociationModalProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [resultsFormatted, setResultsFormatted] = useState<ResultType[]>([]);
  const [searchInternalResources, result] =
    useGetInternalResourcesInfoMutation();
  const [contentLanguage, setContentLanguage] = useState<string>();
  const [searchParams, setSearchParams] =
    useState<InternalResourcesSearchParams>({
      query: '',
      status: ['VALID', 'DRAFT'],
      groups: [],
      sortLang: i18n.language,
      pageSize: 50,
      pageFrom: 0,
      resourceTypes: [ResourceType.ASSOCIATION],
    });

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
      resourceTypes: [ResourceType.ASSOCIATION],
    });
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
    if (!selectedId || selectedId === '' || !result.data) {
      handleFollowUp();
      return;
    }

    const selectedObj = result.data.responseObjects.find(
      (obj) => obj.identifier === selectedId
    );

    selectedObj
      ? handleFollowUp({
          label: `${selectedObj.namespace.split('/').pop()?.replace('#', '')}:${
            selectedObj.identifier
          }`,
          uri: selectedObj.id,
        })
      : handleFollowUp();
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
            identifier: r.identifier,
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
        icon={buttonIcon ? 'plus' : undefined}
        onClick={() => handleOpen()}
      >
        {t('add-association')}
      </Button>
      <LargeModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('add-association')}</ModalTitle>
          <MultiColumnSearch
            primaryColumnName={t('association-name')}
            results={resultsFormatted}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            searchParams={searchParams}
            setSearchParams={handleSearch}
            setContentLanguage={setContentLanguage}
            languageVersioned
            modelId={modelId}
          />
        </ModalContent>
        <ModalFooter>
          <Button disabled={selectedId === ''} onClick={() => handleSubmit()}>
            {buttonTranslations.useSelected}
          </Button>

          {buttonTranslations.createNew && (
            <Button
              variant="secondary"
              icon="plus"
              disabled={selectedId !== ''}
              onClick={() => handleSubmit()}
            >
              {buttonTranslations.createNew}
            </Button>
          )}

          <Button variant="secondaryNoBorder" onClick={() => handleClose()}>
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </LargeModal>
    </div>
  );
}
