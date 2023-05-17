import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from 'suomifi-ui-components';
import { useGetAuthenticatedUserMutMutation } from '../login/login.slice';

const ConceptImportModalDynamic = dynamic(
  () => import('./concept-import-modal')
);

interface ConceptImportProps {
  terminologyId: string;
  refetch: () => void;
}

export default function ConceptImportModal({
  terminologyId,
  refetch,
}: ConceptImportProps) {
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
      <Button icon="upload" variant="secondary" onClick={() => handleClick()}>
        {t('import-concepts')}
      </Button>

      {visible && (
        <ConceptImportModalDynamic
          terminologyId={terminologyId}
          visible={visible}
          setVisible={setVisible}
          refetch={refetch}
          unauthenticatedUser={authenticatedUser.data?.anonymous}
        />
      )}
    </>
  );
}
