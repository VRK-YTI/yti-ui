import { useState } from 'react';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import MultiColumnSearch from '@app/common/components/multi-column-search';
import { LargeModal } from './association-modal.styles';
import { InternalClassesSearchParams } from '@app/common/components/search-internal-classes/search-internal-classes.slice';
import { useTranslation } from 'next-i18next';

interface AttributeModal {
  buttonTranslations: {
    useSelected: string;
    createNew?: string;
  };
  handleFollowUp: () => void;
  buttonIcon?: boolean;
}

export default function AttributeModal({
  buttonTranslations,
  handleFollowUp,
  buttonIcon,
}: AttributeModal) {
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
      <Button
        variant="secondary"
        icon={buttonIcon ? 'plus' : undefined}
        onClick={() => setVisible(true)}
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
            results={[]}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            languageVersioned
          />
        </ModalContent>
        <ModalFooter>
          <Button disabled={selectedId === ''} onClick={() => handleFollowUp()}>
            {buttonTranslations.useSelected}
          </Button>

          {buttonTranslations.createNew && (
            <Button
              variant="secondary"
              icon="plus"
              onClick={() => handleFollowUp()}
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
