import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Button } from 'suomifi-ui-components';
import { useStoreDispatch } from '../../../store';
import { setAlert } from '../alert/alert.slice';
import { subscriptionApi, useGetSubscriptionQuery } from './subscription-slice';

interface SubscriptionProps {
  uri: string;
}

export default function Subscription({ uri }: SubscriptionProps) {
  const { t } = useTranslation('common');
  const { data, error } = useGetSubscriptionQuery(uri);
  const [subscribed, setSubscribed] = useState(false);
  const dispatch = useStoreDispatch();

  useEffect(() => {
    setSubscribed(data !== '' && data ? true : false);
  }, [data]);

  const handleSubscription = (subscribed: boolean) => {
    if (!error) {
      const url =
        process.env.NODE_ENV !== 'development'
          ? uri
          : // This terminology can be found in dev, so change if dev data is changed
            'http://uri.suomi.fi/terminology/demo/terminological-vocabulary-0';

      axios
        .post(getURL(), {
          action: subscribed ? 'DELETE' : 'ADD',
          type: 'terminology',
          uri: url,
        })
        .then(() => {
          dispatch(subscriptionApi.internalActions.resetApiState());

          if (!subscribed) {
            dispatch(
              setAlert([
                {
                  status: 0,
                  data: t('email-subscription-subscribed'),
                },
              ])
            );
          }
        })
        .catch((err) => {
          dispatch(setAlert([err]));
        });
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

function getURL() {
  if (process.env.NODE_ENV === 'development') {
    return '/messaging-api/api/v1/subscriptions?fake.login.mail=admin@localhost';
  }

  return '/messaging-api/api/v1/subscriptions';
}
