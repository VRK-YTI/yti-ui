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
import {
  subscriptionApi,
  useToggleSubscriptionMutation,
} from '../../common/components/subscription/subscription-slice';
import { setAlert } from '../../common/components/alert/alert.slice';
import { useEffect, useState } from 'react';
import { Error } from '../../common/interfaces/error.interface';

interface SubscriptionBlockProps {
  subscriptions: Subscriptions;
  refetchSubscriptions?: () => void;
}

export default function SubscriptionBlock({
  subscriptions,
}: SubscriptionBlockProps) {
  const { t, i18n } = useTranslation('own-information');
  const [toggleSubscription, subscription] = useToggleSubscriptionMutation();
  const [unsubscribedItem, setUnsubscribedItem] = useState('');
  const dispatch = useStoreDispatch();

  useEffect(() => {
    if (subscription.isSuccess) {
      const unsubscribedAll = subscription.data.uri.split(',').length > 1;
      dispatch(subscriptionApi.internalActions.resetApiState());
      dispatch(
        setAlert([
          {
            status: 0,
            data: unsubscribedAll
              ? t('subscription-all-notifications-removed')
              : t('subscription-notifications-removed', {
                  item: unsubscribedItem ?? '',
                }),
          },
        ])
      );
    } else if (subscription.isError) {
      dispatch(setAlert([subscription.error as Error]));
      console.error('subscription error', subscription.error);
    }
  }, [subscription, dispatch, unsubscribedItem, t]);

  const handleUnsubscribe = (uri: string, label: string) => {
    setUnsubscribedItem(label);
    toggleSubscription({ action: 'DELETE', uri: uri });
  };

  const handleUnsubscribeAll = () => {
    const uris = subscriptions.resources
      .map((resource) => resource.uri)
      .join(',');
    setUnsubscribedItem(getPrefLabel(subscriptions.resources[0].prefLabel));
    toggleSubscription({ action: 'DELETE', uri: uris });
  };

  return (
    <BasicBlock
      title={<h2>{t('field-subscriptions')}</h2>}
      extra={
        subscriptions.resources.length > 0 && (
          <BasicBlockExtraWrapper position="right">
            <Button
              variant="secondary"
              icon="message"
              onClick={() => handleUnsubscribeAll()}
            >
              {t('subscription-remove-all-notifications')}
            </Button>
          </BasicBlockExtraWrapper>
        )
      }
    >
      {subscriptions.resources.length > 0 ? (
        <SubscriptionsList>
          {subscriptions.resources.map((resource, idx) => {
            return (
              <SubscriptionsListItem key={`subscription-list-item-${idx}`}>
                <Link
                  passHref
                  href={`/terminology-api/api/v1/resolve?uri=${resource.uri}`}
                >
                  <SuomiLink href="">
                    {getPrefLabel(resource.prefLabel)}
                  </SuomiLink>
                </Link>
                <IconButton
                  variant="secondary"
                  icon="message"
                  color="currentColor"
                  onClick={() =>
                    handleUnsubscribe(resource.uri, resource.prefLabel.fi)
                  }
                />
              </SubscriptionsListItem>
            );
          })}
        </SubscriptionsList>
      ) : (
        t('subscription-no-subscribed-items')
      )}
    </BasicBlock>
  );

  function getPrefLabel(prefLabels: { [value: string]: string }): string {
    return (
      prefLabels[i18n.language] ??
      prefLabels['fi'] + ' (fi)' ??
      prefLabels[Object.keys(prefLabels)[0]] +
        ` (${Object.keys(prefLabels)[0]})`
    );
  }
}
