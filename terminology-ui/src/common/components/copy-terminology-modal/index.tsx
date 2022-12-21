import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from 'suomifi-ui-components';
import { BasicBlock, BasicBlockExtraWrapper } from 'yti-common-ui/block';
import Separator from 'yti-common-ui/separator';
import { useGetAuthenticatedUserMutMutation } from '@app/common/components/login/login.slice';

const CopyTerminologyModalDynamic = dynamic(
  () => import('./copy-terminology-modal')
);

interface CopyTerminologyModalProps {
  terminologyId: string;
  noWrap?: boolean;
}

export default function CopyTerminologyModal({
  terminologyId,
  noWrap,
}: CopyTerminologyModalProps) {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);
  const [getAuthenticatedUser, authenticatedUser] =
    useGetAuthenticatedUserMutMutation();

  const handleClick = () => {
    getAuthenticatedUser();
    setVisible(true);
  };

  if (noWrap) {
    return (
      <>
        <Button icon="copy" variant="secondary" onClick={() => handleClick()}>
          {t('copy-as-base')}
        </Button>
        {visible && (
          <CopyTerminologyModalDynamic
            terminologyId={terminologyId}
            visible={visible}
            setVisible={setVisible}
            unauthenticatedUser={authenticatedUser.data?.anonymous}
          />
        )}
      </>
    );
  }

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
              onClick={() => handleClick()}
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
          unauthenticatedUser={authenticatedUser.data?.anonymous}
        />
      )}
    </>
  );
}
