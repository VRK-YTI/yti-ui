import {
  InternalClassesSearchParams,
  useGetInternalClassesMutation,
} from '@app/common/components/search-internal-classes/search-internal-classes.slice';
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
import MultiColumnSearch, {
  ResultType,
} from '@app/common/components/multi-column-search';
import { LargeModal } from './class-modal.styles';
import format from 'yti-common-ui/formatted-date/format';
import { Locale } from 'yti-common-ui//locale-chooser/use-locales';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';

export interface ClassModalProps {
  handleFollowUp: (value?: InternalClass) => void;
}

export default function ClassModal({ handleFollowUp }: ClassModalProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<undefined | string>();
  const [resultsFormatted, setResultsFormatted] = useState<ResultType[]>([]);
  const [searchInternalClasses, result] = useGetInternalClassesMutation();
  const [searchParams, setSearchParams] = useState<InternalClassesSearchParams>(
    {
      query: '',
      status: ['VALID'],
      groups: [],
      sortLang: i18n.language,
      pageSize: 50,
      pageFrom: 0,
    }
  );

  const handleOpen = () => {
    setVisible(true);
    handleSearch();
  };

  const handleClose = () => {
    setSelectedId(undefined);
    setSearchParams({
      query: '',
      status: ['VALID'],
      groups: [],
      sortLang: i18n.language,
      pageSize: 50,
      pageFrom: 0,
    });
    setVisible(false);
  };

  const handleSearch = (obj?: InternalClassesSearchParams) => {
    if (obj) {
      setSearchParams(obj);
    }

    searchInternalClasses(obj ?? searchParams);
  };

  const handleSubmit = () => {
    const target = result.data?.responseObjects.find(
      (r) => r.identifier === selectedId
    );
    handleFollowUp(target);
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
    <>
      <Button variant="secondary" icon="plus" onClick={() => handleOpen()}>
        {t('add-class')}
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
            results={resultsFormatted}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            searchParams={searchParams}
            setSearchParams={handleSearch}
          />
        </ModalContent>
        <ModalFooter>
          <Button disabled={!selectedId} onClick={() => handleSubmit()}>
            {t('create-subclass-for-selected')}
          </Button>
          <Button icon="plus" onClick={() => handleFollowUp()}>
            {t('create-new-class')}
          </Button>
          <Button variant="secondaryNoBorder" onClick={() => handleClose()}>
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </LargeModal>
    </>
  );
}
