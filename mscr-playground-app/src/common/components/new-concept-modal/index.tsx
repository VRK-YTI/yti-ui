import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from 'suomifi-ui-components';
import { useGetAuthenticatedUserMutMutation } from '../login/login.slice';

const NewConceptModalDynamic = dynamic(() => import('./new-concept-modal'));

interface NewConceptModalProps {
  terminologyId: string;
  languages: string[];
}

export default function NewConceptModal({
  terminologyId,
  languages,
}: NewConceptModalProps) {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);

  const [getAuthenticatedUser, authenticatedUser] =
    useGetAuthenticatedUserMutMutation();

  const handleClick = () => {
    getAuthenticatedUser();
    setVisible(true);
  };

  return (
    <>
      <Button
        icon="plus"
        variant="secondary"
        onClick={() => handleClick()}
        id="new-concept-button"
      >
        {t('add-new-concept')}
      </Button>

      {visible && (
        <NewConceptModalDynamic
          terminologyId={terminologyId}
          languages={languages}
          visible={visible}
          setVisible={setVisible}
          unauthenticatedUser={authenticatedUser.data?.anonymous}
        />
      )}
    </>
  );
}
