import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Button } from 'suomifi-ui-components';
import { useStoreDispatch } from '../../../store';
import { Error } from '../../interfaces/error.interface';
import { setAlert } from '../alert/alert.slice';
import {
  subscriptionApi,
  useGetSubscriptionQuery,
  useToggleSubscriptionMutation,
} from './subscription-slice';

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
      dispatch(
        setAlert([
          {
            status: 0,
            data: t('email-subscription-subscribed'),
          },
        ])
      );
    } else if (subscription.isError) {
      dispatch(setAlert([subscription.error as Error]));
      console.error('subscription error', subscription.error);
    }
  });

  const handleSubscription = (subscribed: boolean) => {
    if (!error) {
      toggleSubscription({ action: subscribed ? 'DELETE' : 'ADD', uri: uri });
    }
  };

  return (
    <Button variant="secondary" onClick={() => handleSubscription(subscribed)}>
      {subscribed
        ? t('email-subscription-delete')
        : t('email-subscription-add')}
    </Button>
  );
}
