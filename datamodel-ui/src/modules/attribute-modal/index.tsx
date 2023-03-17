import { useEffect, useState } from 'react';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import MultiColumnSearch, {
  ResultType,
} from '@app/common/components/multi-column-search';
import { LargeModal } from './attribute-modal.styles';
import { useTranslation } from 'next-i18next';
import {
  InternalResourcesSearchParams,
  useGetInternalResourcesMutation,
} from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import format from 'yti-common-ui/formatted-date/format';
import { Locale } from 'yti-common-ui/locale-chooser/use-locales';

interface AttributeModalProps {
  buttonTranslations: {
    useSelected: string;
    createNew?: string;
  };
  handleFollowUp: (value?: { label: string; uri: string }) => void;
  buttonIcon?: boolean;
  modelId: string;
}

export default function AttributeModal({
  buttonTranslations,
  handleFollowUp,
  buttonIcon,
  modelId,
}: AttributeModalProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [resultsFormatted, setResultsFormatted] = useState<ResultType[]>([]);
  const [searchInternalResources, result] = useGetInternalResourcesMutation();
  const [searchParams, setSearchParams] =
    useState<InternalResourcesSearchParams>({
      query: '',
      status: ['VALID'],
      groups: [],
      sortLang: i18n.language,
      pageSize: 50,
      pageFrom: 0,
      resourceTypes: [ResourceType.ATTRIBUTE],
    });

  const handleOpen = () => {
    setVisible(true);
    handleSearch();
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
    const namespace = ns.split('#').at(0)?.split('/').pop();
    return `${namespace}:${id}`;
  };

  useEffect(() => {
    if (result.isSuccess) {
      setResultsFormatted(
        result.data.responseObjects.map((r) => ({
          target: {
            identifier: r.identifier,
            label: getLanguageVersion({ data: r.label, lang: i18n.language }),
            linkLabel: getLinkLabel(r.namespace, r.identifier),
            link: r.id,
            status: translateStatus(r.status, t),
            isValid: r.status === 'VALID',
            modified: format(r.modified, (i18n.language as Locale) ?? 'fi'),
          },
          partOf: {
            label: 'Tietomallin nimi',
            type: 'Tietomallin tyyppi',
            domains: ['Asuminen', 'Elinkeinot'],
          },
          subClass: {
            label: 'Linkki käsitteeseen',
            link: '#',
            partOf: 'Sanaston nimi',
          },
        }))
      );
    }
  }, [result, i18n.language, t]);

  return (
    <div>
      <Button
        variant="secondary"
        icon={buttonIcon ? 'plus' : undefined}
        onClick={() => handleOpen()}
      >
        {t('add-attribute')}
      </Button>
      <LargeModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('add-attribute')}</ModalTitle>
          <MultiColumnSearch
            primaryColumnName={t('attribute-name')}
            results={resultsFormatted}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            searchParams={searchParams}
            setSearchParams={handleSearch}
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

          <Button variant="secondaryNoBorder" onClick={() => setVisible(false)}>
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </LargeModal>
    </div>
  );
}
