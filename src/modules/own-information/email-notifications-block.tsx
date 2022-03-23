import { useTranslation } from 'next-i18next';
import { BasicBlock } from '../../common/components/block';
import InlineAlert from '../../common/components/inline-alert';
import { ToggleButton } from 'suomifi-ui-components';
import { BasicBlockExtraWrapper } from '../../common/components/block/block.styles';
import { useToggleSubscriptionMutation } from '../../common/components/subscription/subscription-slice';
import { useEffect, useState } from 'react';

interface EmailNotificationsBlockProps {
  subscriptions: any;
  refetchSubscriptions: () => void;
}

export default function EmailNotificationsBlock({ subscriptions, refetchSubscriptions }: EmailNotificationsBlockProps) {
  const { t } = useTranslation('own-information');
  const [toggleSubscription, subscription] = useToggleSubscriptionMutation();
  const [checked, setChecked] = useState(subscriptions?.subscriptionType === 'DAILY' ? true : false);
  console.log('checked', checked, subscriptions?.subscriptionType === 'DAILY');

  useEffect(() => {
    if (subscription.isSuccess) {
      refetchSubscriptions();
    };
  }, [subscription, refetchSubscriptions]);

  const handleClick = () => {
    toggleSubscription(subscriptions?.subscriptionType === 'DAILY' ? 'DISABLED' : 'DAILY');
    setChecked(!checked);
  };

  return (
    <BasicBlock
      title={<h2>{t('field-email-notifications')}</h2>}
      extra={
        <>
          <BasicBlockExtraWrapper>
            <ToggleButton
              checked={checked}
              onClick={() => handleClick()}
            >
              {t('field-email-notifications')}
            </ToggleButton>
          </BasicBlockExtraWrapper>
          <BasicBlockExtraWrapper>
            <InlineAlert noIcon>Sähköposti-ilmoitukset päällä</InlineAlert>
          </BasicBlockExtraWrapper>
        </>
      }
      largeGap
    >
      {t('field-email-notifications-description')}
    </BasicBlock>
  );
}
