import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import MultiColumnSearch from '@app/common/components/multi-column-search';
import { LargeModal, OpenModalButton } from './class-modal.styles';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import {
  InternalResourcesSearchParams,
  useGetInternalResourcesMutation,
} from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { ResultType } from '@app/common/components/resource-list';

export interface ClassModalProps {
  modelId: string;
  modalButtonLabel?: string;
  mode?: 'create' | 'select';
  handleFollowUp: (value?: InternalClass, targetIsAppProfile?: boolean) => void;
  applicationProfile?: boolean;
  initialSelected?: string;
}

export default function ClassModal({
  modelId,
  modalButtonLabel,
  mode = 'create',
  handleFollowUp,
  applicationProfile,
  initialSelected,
}: ClassModalProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(initialSelected ?? '');
  const [resultsFormatted, setResultsFormatted] = useState<ResultType[]>([]);
  const [searchInternalResources, result] = useGetInternalResourcesMutation();
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
      resourceTypes: [ResourceType.CLASS],
    });

  const handleOpen = () => {
    setVisible(true);
    handleSearch();
  };

  const handleClose = () => {
    setSelectedId('');
    setSearchParams({
      query: '',
      status: ['VALID', 'DRAFT'],
      groups: [],
      sortLang: i18n.language,
      pageSize: 50,
      pageFrom: 0,
      limitToDataModel: modelId,
      limitToModelType: 'LIBRARY',
      resourceTypes: [ResourceType.CLASS],
    });
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
      setVisible(false);
      handleFollowUp();
      return;
    }

    const target = result.data?.responseObjects.find(
      (r) => r.id === selectedId
    );
    setVisible(false);
    handleFollowUp(
      target,
      searchParams.limitToModelType === 'PROFILE' ?? undefined
    );
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
            label: getLanguageVersion({ data: r.label, lang: i18n.language }),
            linkLabel: getLinkLabel(r.namespace, r.identifier),
            link: r.id,
            status: translateStatus(r.status, t),
            isValid: r.status === 'VALID',
            note: getLanguageVersion({
              data: r.note,
              lang: i18n.language,
              appendLocale: true,
            }),
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
    <>
      <OpenModalButton
        variant="secondary"
        icon={modalButtonLabel ? undefined : 'plus'}
        onClick={() => handleOpen()}
      >
        {modalButtonLabel ? modalButtonLabel : t('add-class')}
      </OpenModalButton>

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
            results={resultsFormatted}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            searchParams={searchParams}
            setSearchParams={handleSearch}
            modelId={modelId}
            applicationProfile={applicationProfile}
            languageVersioned={applicationProfile}
          />
        </ModalContent>
        <ModalFooter>
          {mode === 'create' ? (
            <>
              <Button
                disabled={selectedId === ''}
                onClick={() => handleSubmit()}
              >
                {applicationProfile
                  ? t('select-class')
                  : t('create-subclass-for-selected')}
              </Button>
              {!applicationProfile && (
                <Button
                  icon="plus"
                  disabled={selectedId !== ''}
                  onClick={() => handleSubmit()}
                >
                  {t('create-new-class')}
                </Button>
              )}
              <Button variant="secondaryNoBorder" onClick={() => handleClose()}>
                {t('cancel-variant')}
              </Button>
            </>
          ) : (
            <>
              <Button
                disabled={selectedId === ''}
                onClick={() => handleSubmit()}
              >
                {modalButtonLabel}
              </Button>
              <Button variant="secondaryNoBorder" onClick={() => handleClose()}>
                {t('cancel-variant')}
              </Button>
            </>
          )}
        </ModalFooter>
      </LargeModal>
    </>
  );
}
