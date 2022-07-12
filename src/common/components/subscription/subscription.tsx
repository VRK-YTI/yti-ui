import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Button, Paragraph, Text } from 'suomifi-ui-components';
import { useStoreDispatch } from '@app/store';
import { setAlert } from '../alert/alert.slice';
import {
  subscriptionApi,
  useGetSubscriptionQuery,
  useToggleSubscriptionMutation,
} from './subscription.slice';
import InlineAlert from '../inline-alert';

interface SubscriptionProps {
  uri: string;
}

export default function Subscription({ uri }: SubscriptionProps) {
  const { t } = useTranslation('common');
  const { data, error } = useGetSubscriptionQuery(uri);
  const [toggleSubscription, subscription] = useToggleSubscriptionMutation();
  const [subscribed, setSubscribed] = useState(false);
  const dispatch = useStoreDispatch();

  useEffect(() => {
    setSubscribed(data !== '' && data ? true : false);
  }, [data]);

  useEffect(() => {
    if (subscription.isSuccess) {
      dispatch(subscriptionApi.internalActions.resetApiState());
    } else if (subscription.isError) {
      dispatch(
        setAlert(
          [{ note: subscription.error, displayText: '_subscription' }],
          []
        )
      );
    }
  }, [subscription, dispatch]);

  const handleSubscription = (subscribed: boolean) => {
    if (!error) {
      toggleSubscription({ action: subscribed ? 'DELETE' : 'ADD', uri: uri });
    }
  };

  return (
    <>
      <InlineAlert
        noIcon
        status={subscribed ? 'neutral' : 'warning'}
        style={{ marginBottom: '20px' }}
      >
        <Paragraph>
          <Text smallScreen>
            {subscribed
              ? t('email-subscription-subscribed')
              : t('email-subscription-unsubscribed')}
          </Text>
        </Paragraph>
      </InlineAlert>

      <Button
        variant="secondary"
        icon={subscribed ? 'alertOff' : 'alert'}
        onClick={() => handleSubscription(subscribed)}
      >
        {subscribed
          ? t('email-subscription-delete')
          : t('email-subscription-add')}
      </Button>
    </>
  );
}
