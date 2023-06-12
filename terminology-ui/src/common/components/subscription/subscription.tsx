import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  IconAlert,
  IconAlertOff,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { useStoreDispatch } from '@app/store';
import { setAlert } from '../alert/alert.slice';
import {
  subscriptionApi,
  useGetSubscriptionQuery,
  useToggleSubscriptionMutation,
} from './subscription.slice';
import InlineAlert from 'yti-common-ui/inline-alert';

interface SubscriptionProps {
  uri: string;
}

export default function Subscription({ uri }: SubscriptionProps) {
  const { t } = useTranslation('common');
  const { data, error } = useGetSubscriptionQuery(uri);
  const [toggleSubscription, subscription] = useToggleSubscriptionMutation();
  const [subscribed, setSubscribed] = useState(
    data !== '' && data ? true : false
  );
  const dispatch = useStoreDispatch();

  const setSubscribedState = useCallback(() => {
    setSubscribed(() => !subscribed);
  }, [subscribed]);

  useEffect(() => {
    if (subscription.isSuccess) {
      setSubscribedState();
      dispatch(subscriptionApi.internalActions.resetApiState());
    } else if (subscription.isError) {
      dispatch(
        setAlert(
          [
            {
              note: subscription.error,
              displayText: t('error-occured_subscription', { ns: 'alert' }),
            },
          ],
          []
        )
      );
    }
  }, [subscription, dispatch, t, setSubscribedState]);

  const handleSubscription = (subscribed: boolean) => {
    if (!error) {
      toggleSubscription({ action: subscribed ? 'DELETE' : 'ADD', uri: uri });
    }
  };

  return (
    <>
      {subscribed && (
        <InlineAlert noIcon status={'neutral'} style={{ marginBottom: '20px' }}>
          <Paragraph>
            <Text smallScreen>{t('email-subscription-subscribed')}</Text>
          </Paragraph>
        </InlineAlert>
      )}

      <Button
        variant="secondary"
        icon={subscribed ? <IconAlertOff /> : <IconAlert />}
        onClick={() => handleSubscription(subscribed)}
        id="toggle-subscription-button"
      >
        {subscribed
          ? t('email-subscription-delete')
          : t('email-subscription-add')}
      </Button>
    </>
  );
}
