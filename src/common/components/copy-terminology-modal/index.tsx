import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from 'suomifi-ui-components';
import { BasicBlock } from '../block';
import { BasicBlockExtraWrapper } from '../block/block.styles';
import Separator from '../separator';

const CopyTerminologyModalDynamic = dynamic(
  () => import('./copy-terminology-modal')
);

interface CopyTerminologyModalProps {
  terminologyId: string;
}

export default function CopyTerminologyModal({
  terminologyId,
}: CopyTerminologyModalProps) {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Separator isLarge />

      <BasicBlock
        title={t('copy-from-terminology-as-base')}
        extra={
          <BasicBlockExtraWrapper>
            <Button
              icon="copy"
              variant="secondary"
              onClick={() => setVisible(true)}
            >
              {t('copy-as-base')}
            </Button>
          </BasicBlockExtraWrapper>
        }
      >
        {t('you-can-copy')}
      </BasicBlock>

      {visible && (
        <CopyTerminologyModalDynamic
          terminologyId={terminologyId}
          visible={visible}
          setVisible={setVisible}
        />
      )}
    </>
  );
}
