import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from 'suomifi-ui-components';

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

  return (
    <>
      <Button
        icon="upload"
        variant="secondary"
        onClick={() => setVisible(true)}
      >
        {t('import-concepts')}
      </Button>

      {visible && (
        <ConceptImportModalDynamic
          terminologyId={terminologyId}
          visible={visible}
          setVisible={setVisible}
          refetch={refetch}
        />
      )}
    </>
  );
}
