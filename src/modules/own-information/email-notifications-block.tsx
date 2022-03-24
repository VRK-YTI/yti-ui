import { useTranslation } from 'next-i18next';
import { BasicBlock } from '../../common/components/block';
import InlineAlert from '../../common/components/inline-alert';
import { ToggleButton } from 'suomifi-ui-components';
import { BasicBlockExtraWrapper } from '../../common/components/block/block.styles';
import { useToggleSubscriptionsMutation } from '../../common/components/subscription/subscription-slice';
import { useEffect, useState } from 'react';
import { Subscriptions } from '../../common/interfaces/subscription.interface';

interface EmailNotificationsBlockProps {
  subscriptions: Subscriptions;
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
    setChecked(subscriptions?.subscriptionType === 'DAILY' ? true : false);
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
      title={<h2>{t('field-email-notifications')}</h2>}
      extra={
        <>
          <BasicBlockExtraWrapper>
            <ToggleButton checked={checked} onClick={() => handleClick()}>
              {t('field-email-notifications')}
            </ToggleButton>
          </BasicBlockExtraWrapper>
          <BasicBlockExtraWrapper>
            {checked ? (
              <InlineAlert noIcon>
                {t('subscription-notifications-on')}
              </InlineAlert>
            ) : (
              <InlineAlert status="warning">
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
