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
  const [userSubscribed, setUserSubscribed] = useState(false);
  const dispatch = useStoreDispatch();

  useEffect(() => {
    setSubscribed(data !== '' && data ? true : false);
  }, [data]);

  useEffect(() => {
    if (subscribed) {
      const notificationTimer = setTimeout(() => {
        setUserSubscribed(false);
      }, 5000);

      return () => {
        clearTimeout(notificationTimer);
      };
    }
  }, [subscribed]);

  useEffect(() => {
    if (subscription.isSuccess) {
      dispatch(subscriptionApi.internalActions.resetApiState());
    } else if (subscription.isError) {
      dispatch(setAlert([subscription.error], []));
    }
  }, [subscription, dispatch]);

  const handleSubscription = (subscribed: boolean) => {
    if (!error) {
      toggleSubscription({ action: subscribed ? 'DELETE' : 'ADD', uri: uri });
      setUserSubscribed(subscribed ? false : true);
    }
  };

  return (
    <>
      {subscribed && userSubscribed ? (
        <InlineAlert noIcon style={{ marginBottom: '20px' }}>
          <Paragraph>
            <Text variant="bold">{t('email-subscription-subscribed')}</Text>
          </Paragraph>
          <Paragraph>
            <Text smallScreen>
              {t('email-subscription-subscribed-description')}
            </Text>
          </Paragraph>
        </InlineAlert>
      ) : (
        <></>
      )}

      <Button
        variant="secondary"
        // This is still commented because suomifi-components beta 7.x.1
        // does not yet have these icons
        // icon={subscribed ? 'alertOff' : 'alert'}
        onClick={() => handleSubscription(subscribed)}
      >
        {subscribed
          ? t('email-subscription-delete')
          : t('email-subscription-add')}
      </Button>
    </>
  );
}
