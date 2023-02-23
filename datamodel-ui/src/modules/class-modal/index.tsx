import { useGetInternalClassesMutation } from '@app/common/components/search-internal-classes/search-internal-classes.slice';
import { ClassType } from '@app/common/interfaces/class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import MultiColumnSearch, {
  ResultType,
} from 'yti-common-ui/multi-column-search';
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
  const [searchParams, setSearchParams] = useState({
    query: '',
    status: [],
    groups: [],
    sortLang: i18n.language,
    pageSize: 50,
    pageFrom: 0,
  });
  const [searchInternalClasses, result] = useGetInternalClassesMutation();

  const [resultsMock, setResultsMock] = useState<InternalClass[]>([
    {
      id: 'http://uri.suomi.fi/datamodel/ns/demo321#uusiluokka',
      label: {
        fi: 'Uusi luokka',
      },
      status: 'VALID',
      modified: '2023-02-22T05:43:40.814Z',
      created: '2023-02-22T05:43:40.814Z',
      isDefinedBy: 'http://uri.suomi.fi/datamodel/ns/demo321',
      note: {
        fi: 'Huomautus',
      },
      identifier: 'uusiluokka',
      namespace: 'http://uri.suomi.fi/datamodel/ns/demo321#',
    },
    {
      id: 'http://uri.suomi.fi/datamodel/ns/demo321#vanhaluokka',
      label: {
        fi: 'Vanha luokka',
        en: 'Old class',
      },
      status: 'DRAFT',
      modified: '2023-02-22T05:43:40.814Z',
      created: '2023-02-22T05:43:40.814Z',
      isDefinedBy: 'http://uri.suomi.fi/datamodel/ns/demo321',
      note: {
        fi: 'Huomautus',
        en: 'Huomautus',
      },
      identifier: 'vanhaluokka',
      namespace: 'http://uri.suomi.fi/datamodel/ns/demo321#',
    },
  ]);

  const resultsFormatted: ResultType[] = useMemo(
    () =>
      resultsMock.map((r) => ({
        target: {
          identifier: r.identifier,
          label: getLanguageVersion({ data: r.label, lang: i18n.language }),
          linkLabel: r.id.split('/').pop()?.replace('#', ':') ?? r.identifier,
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
      })),
    []
  );

  const handleOpen = () => {
    setVisible(true);
    handleSearch();
  };

  const handleClose = () => {
    setSelectedId(undefined);
    setVisible(false);
  };

  const handleSearch = () => {
    searchInternalClasses(searchParams);
  };

  const handleSubmit = () => {
    const target = resultsMock.find((r) => r.identifier === selectedId);
    handleFollowUp(target);
  };

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
          <ModalTitle>Lisää luokka</ModalTitle>
          <MultiColumnSearch
            results={resultsFormatted}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </ModalContent>
        <ModalFooter>
          <Button disabled={!selectedId} onClick={() => handleSubmit()}>
            Luo valitulle alaluokka
          </Button>
          <Button icon="plus" onClick={() => handleFollowUp()}>
            Luo uusi luokka
          </Button>
          <Button variant="secondaryNoBorder" onClick={() => handleClose()}>
            Peruuta
          </Button>
        </ModalFooter>
      </LargeModal>
    </>
  );
}
