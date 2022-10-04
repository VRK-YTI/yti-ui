import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button } from 'suomifi-ui-components';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import HasPermission from '@app/common/utils/has-permission';

const NewTerminologyModal = dynamic(() => import('./new-terminology-modal'));

export default function NewTerminology() {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [showModal, setShowModal] = useState(false);

  if (!HasPermission({ actions: 'CREATE_TERMINOLOGY' })) {
    return null;
  }

  return (
    <>
      <Button
        icon="plus"
        variant="secondary"
        fullWidth={isSmall}
        onClick={() => setShowModal(true)}
        style={{ whiteSpace: 'nowrap' }}
        id="new-terminology-button"
      >
        {t('add-new-terminology')}
      </Button>

      {showModal && (
        <NewTerminologyModal
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
}
