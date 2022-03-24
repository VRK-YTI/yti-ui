import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { BasicBlock } from '../../common/components/block';
import {
  SubscriptionsList,
  SubscriptionsListItem,
} from './own-information.styles';
import { Button, Link as SuomiLink } from 'suomifi-ui-components';
import IconButton from '../../common/components/icon-button/icon-button';
import { BasicBlockExtraWrapper } from '../../common/components/block/block.styles';
import { Subscriptions } from '../../common/interfaces/subscription.interface';
import { useStoreDispatch } from '../../store';
import { subscriptionApi, useToggleSubscriptionMutation } from '../../common/components/subscription/subscription-slice';
import { setAlert } from '../../common/components/alert/alert.slice';
import { useEffect, useState } from 'react';
import { Error } from '../../common/interfaces/error.interface';

interface SubscriptionBlockProps {
  subscriptions: Subscriptions;
  refetchSubscriptions?: () => void;
}

export default function SubscriptionBlock({ subscriptions }: SubscriptionBlockProps) {
  const { t } = useTranslation('own-information');
  const [toggleSubscription, subscription] = useToggleSubscriptionMutation();
  const [unsubscribedItem, setUnsubscribedItem] = useState('');
  const dispatch = useStoreDispatch();

  useEffect(() => {
    if (subscription.isSuccess) {
      dispatch(subscriptionApi.internalActions.resetApiState());
      dispatch(setAlert([{status: 0, data: `Ilmoitukset poistettu sanastolta ${unsubscribedItem}`}]));
    } else if (subscription.isError) {
      dispatch(setAlert([subscription.error as Error]));
      console.error('subscription error', subscription.error);
    }
  }, [subscription, dispatch, unsubscribedItem]);

  const handleUnsubscribe = (uri: string, label: string) => {
    setUnsubscribedItem(label);
    toggleSubscription({action: 'DELETE', uri: uri});
  };

  return (
    <BasicBlock
      title={<h2>{t('field-subscriptions')}</h2>}
      extra={
        subscriptions.resources.length > 0 &&
        <BasicBlockExtraWrapper position="right">
          <Button variant="secondary" icon="message">
            Poista kaikki ilmoitukset
          </Button>
        </BasicBlockExtraWrapper>
      }
    >
      <SubscriptionsList>
        {subscriptions.resources.map((resource, idx) => {
          return (
            <SubscriptionsListItem key={`subscription-list-item-${idx}`}>
              <Link passHref href={`/terminology-api/api/v1/resolve?uri=${resource.uri}`}>
                <SuomiLink href="">{resource.prefLabel.fi}</SuomiLink>
              </Link>
              <IconButton
                variant="secondary"
                icon="message"
                color="currentColor"
                onClick={() => handleUnsubscribe(resource.uri, resource.prefLabel.fi)}
              />
            </SubscriptionsListItem>
          );
        })}
      </SubscriptionsList>
    </BasicBlock>
  );
}
