import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button, IconPlus } from 'suomifi-ui-components';
import { useGetAuthenticatedUserMutMutation } from '../login/login.slice';
import { compareLocales } from 'yti-common-ui/utils/compare-locales';

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
        icon={<IconPlus />}
        variant="secondary"
        onClick={() => handleClick()}
        id="new-concept-button"
      >
        {t('add-new-concept')}
      </Button>

      {visible && (
        <NewConceptModalDynamic
          terminologyId={terminologyId}
          languages={languages.slice().sort(compareLocales)}
          visible={visible}
          setVisible={setVisible}
          unauthenticatedUser={authenticatedUser.data?.anonymous}
        />
      )}
    </>
  );
}
