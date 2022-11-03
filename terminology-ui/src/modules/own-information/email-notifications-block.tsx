import { useTranslation } from 'next-i18next';
import { BasicBlock, BasicBlockExtraWrapper } from '@common/components/block';
import InlineAlert from '../../common/components/inline-alert';
import { ToggleButton } from 'suomifi-ui-components';
import { useToggleSubscriptionsMutation } from '../../common/components/subscription/subscription.slice';
import { useEffect, useState } from 'react';
import { Subscriptions } from '../../common/interfaces/subscription.interface';

interface EmailNotificationsBlockProps {
  subscriptions?: Subscriptions;
  refetchSubscriptions: () => void;
}

export default function EmailNotificationsBlock({
  subscriptions,
  refetchSubscriptions,
}: EmailNotificationsBlockProps) {
  const { t } = useTranslation('own-information');
  const [toggleSubscriptions, subscription] = useToggleSubscriptionsMutation();
  const [checked, setChecked] = useState(
    subscriptions?.subscriptionType === 'DAILY' ? true : false
  );

  useEffect(() => {
    if (subscriptions) {
      setChecked(subscriptions.subscriptionType === 'DAILY' ? true : false);
    }
  }, [subscriptions]);

  useEffect(() => {
    if (subscription.isSuccess) {
      refetchSubscriptions();
    }
  }, [subscription, refetchSubscriptions]);

  const handleClick = () => {
    toggleSubscriptions(
      subscriptions?.subscriptionType === 'DAILY' ? 'DISABLED' : 'DAILY'
    );
    setChecked(!checked);
  };

  return (
    <BasicBlock
      title={
        <h2 style={{ fontSize: '18px' }}>{t('field-email-notifications')}</h2>
      }
      extra={
        <>
          <BasicBlockExtraWrapper id="email-notifications">
            <ToggleButton
              checked={checked}
              onClick={() => handleClick()}
              id="email-notifications-toggle"
            >
              {t('field-email-notifications')}
            </ToggleButton>
          </BasicBlockExtraWrapper>
          <BasicBlockExtraWrapper>
            {checked ? (
              <InlineAlert noIcon id="notifications-on">
                {t('subscription-notifications-on')}
              </InlineAlert>
            ) : (
              <InlineAlert status="warning" id="notifications-off">
                {t('subscription-notifications-off')}
              </InlineAlert>
            )}
          </BasicBlockExtraWrapper>
        </>
      }
      largeGap
    >
      {t('field-email-notifications-description')}
    </BasicBlock>
  );
}
