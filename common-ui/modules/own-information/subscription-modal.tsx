import { useEffect, useState } from 'react';
import {
  Button,
  IconAlertOff,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { BasicBlock } from '../../components/block';
import { NarrowModal } from './own-information.styles';
import { Subscription } from 'interfaces/subscription.interface';
import { useTranslation } from 'next-i18next';

interface SubscriptionModalProps {
  resourceIds: string[];
  singular?: boolean;
  toggleSubscriptionResult: {
    isSuccess: boolean;
    isError: boolean;
    isLoading: boolean;
    data?: Subscription;
  };
  refetchSubscriptions: () => void;
  toggleSubscription: (value: {
    action: 'DELETE' | 'ADD';
    uri: string;
  }) => void;
}

export default function SubscriptionModal({
  resourceIds,
  singular,
  toggleSubscriptionResult,
  refetchSubscriptions,
  toggleSubscription,
}: SubscriptionModalProps) {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    toggleSubscription({
      action: 'DELETE',
      uri: resourceIds.join(','),
    });
  };

  useEffect(() => {
    if (toggleSubscriptionResult.isSuccess) {
      setVisible(false);
      refetchSubscriptions();
    }
  }, [toggleSubscriptionResult, refetchSubscriptions]);

  return (
    <>
      <Button
        variant="secondary"
        icon={<IconAlertOff />}
        onClick={() => setVisible(true)}
        id="remove-all-subscriptions-button"
      >
        {!singular ? t('remove-all-subscriptions') : ''}
      </Button>

      <NarrowModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
      >
        <ModalContent>
          <ModalTitle>{t('remove-email-subscriptions')}</ModalTitle>

          <Paragraph>
            <Text>{t('remove-email-subscriptions-description')}</Text>
          </Paragraph>

          <BasicBlock
            title={t('items-to-be-unscribed-from', {
              count: resourceIds.length,
            })}
          >
            {resourceIds.map((id) => (
              <div key={id}>{id}</div>
            ))}
          </BasicBlock>
        </ModalContent>

        <ModalFooter>
          <Button
            onClick={() => handleClick()}
            disabled={toggleSubscriptionResult.isLoading}
          >
            {t('remove')}
          </Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            {t('cancel')}
          </Button>
        </ModalFooter>
      </NarrowModal>
    </>
  );
}
