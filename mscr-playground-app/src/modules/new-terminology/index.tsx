import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import HasPermission from '@app/common/utils/has-permission';
import { useGetAuthenticatedUserMutMutation } from '@app/common/components/login/login.slice';

const NewTerminologyModal = dynamic(() => import('./new-terminology-modal'));

export default function NewTerminology() {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [showModal, setShowModal] = useState(false);
  const [getAuthenticatedUser, authenticatedUser] =
    useGetAuthenticatedUserMutMutation();

  if (!HasPermission({ actions: 'CREATE_TERMINOLOGY' })) {
    return null;
  }

  const handleClick = () => {
    setShowModal(true);
    getAuthenticatedUser();
  };

  return (
    <>
      <Button
        icon="plus"
        variant="secondary"
        fullWidth={isSmall}
        onClick={() => handleClick()}
        style={{ whiteSpace: 'nowrap' }}
        id="new-terminology-button"
      >
        {t('add-new-terminology')}
      </Button>

      {showModal && (
        <NewTerminologyModal
          showModal={showModal}
          setShowModal={setShowModal}
          unauthenticatedUser={authenticatedUser.data?.anonymous}
        />
      )}
    </>
  );
}
