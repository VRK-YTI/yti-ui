import { useState } from 'react';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import MultiColumnSearch from '@app/common/components/multi-column-search';
import { LargeModal } from './attribute-modal.styles';
import { InternalClassesSearchParams } from '@app/common/components/search-internal-classes/search-internal-classes.slice';
import { useTranslation } from 'next-i18next';

export default function AttributeModal() {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
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

  return (
    <div>
      <Button variant="secondary" onClick={() => setVisible(true)}>
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
            results={[]}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            languageVersioned
          />
        </ModalContent>
        <ModalFooter>
          <Button disabled={selectedId === ''}>{t('use-as-is')}</Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </LargeModal>
    </div>
  );
}
