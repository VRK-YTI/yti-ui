import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { BasicBlock, BasicBlockExtraWrapper } from 'yti-common-ui/block';
import {
  SubscriptionsList,
  SubscriptionsListItem,
} from './own-information.styles';
import { Link as SuomiLink } from 'suomifi-ui-components';
import { Subscriptions } from '../../common/interfaces/subscription.interface';
import { useStoreDispatch } from '../../store';
import { useToggleSubscriptionMutation } from '../../common/components/subscription/subscription.slice';
import { setAlert } from '../../common/components/alert/alert.slice';
import { useEffect, useState } from 'react';
import RemoveSubscription from '../../common/components/subscription/remove-subscription';
import getPrefLabel from '../../common/utils/get-preflabel';

interface SubscriptionBlockProps {
  subscriptions: Subscriptions;
  refetchSubscriptions: () => void;
}

export default function SubscriptionBlock({
  subscriptions,
  refetchSubscriptions,
}: SubscriptionBlockProps) {
  const { t, i18n } = useTranslation('own-information');
  const [toggleSubscription, subscription] = useToggleSubscriptionMutation();
  const [unsubscribedItem, setUnsubscribedItem] = useState('');
  const dispatch = useStoreDispatch();

  useEffect(() => {
    if (subscription && subscription.isSuccess) {
      const unsubscribedAll = subscription.data?.uri?.includes(',') ?? false;
      dispatch(
        setAlert(
          [
            {
              note: {
                status: 0,
                data: '',
              },
              displayText: unsubscribedAll
                ? t('subscription-all-notifications-removed')
                : t('subscription-notifications-removed', {
                    item: unsubscribedItem ?? '',
                  }),
            },
          ],
          []
        )
      );

      refetchSubscriptions();
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
      console.error('subscription error', subscription.error);
    }
  }, [subscription, dispatch, unsubscribedItem, t, refetchSubscriptions]);

  return (
    <BasicBlock
      title={<h2>{t('field-subscriptions')}</h2>}
      extra={
        subscriptions.resources.length > 0 && (
          <BasicBlockExtraWrapper $position="right">
            <RemoveSubscription
              resources={subscriptions?.resources}
              toggleSubscription={toggleSubscription}
              setUnsubscribedItem={setUnsubscribedItem}
            />
          </BasicBlockExtraWrapper>
        )
      }
    >
      {subscriptions.resources?.length > 0 ? (
        <SubscriptionsList>
          {subscriptions?.resources.map((resource, idx) => {
            return (
              <SubscriptionsListItem key={`subscription-list-item-${idx}`}>
                <Link
                  passHref
                  href={`/terminology-api/api/v1/resolve?uri=${resource.uri}`}
                  legacyBehavior
                >
                  <SuomiLink href="">
                    {resource.prefLabel
                      ? getPrefLabel({
                          prefLabels: resource.prefLabel,
                          lang: i18n.language,
                        })
                      : resource.uri}
                  </SuomiLink>
                </Link>
                <RemoveSubscription
                  resource={resource}
                  toggleSubscription={toggleSubscription}
                  setUnsubscribedItem={setUnsubscribedItem}
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
}
