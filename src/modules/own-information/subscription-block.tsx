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

export default function SubscriptionBlock() {
  const { t } = useTranslation('own-information');

  return (
    <BasicBlock
      title={<h2>{t('field-subscriptions')}</h2>}
      extra={
        <BasicBlockExtraWrapper position="right">
          <Button variant="secondary" icon="message">
            Poista kaikki ilmoitukset
          </Button>
        </BasicBlockExtraWrapper>
      }
    >
      <SubscriptionsList>
        <SubscriptionsListItem>
          <Link passHref href="/asdf">
            <SuomiLink href="">Aurora AI</SuomiLink>
          </Link>
          <IconButton variant="secondary" icon="message" color="currentColor" />
        </SubscriptionsListItem>
        <SubscriptionsListItem>
          <Link passHref href="/asdf">
            <SuomiLink href="">Aurora AI</SuomiLink>
          </Link>
          <IconButton variant="secondary" icon="message" color="currentColor" />
        </SubscriptionsListItem>
        <SubscriptionsListItem>
          <Link passHref href="/asdf">
            <SuomiLink href="">Aurora AI</SuomiLink>
          </Link>
          <IconButton variant="secondary" icon="message" color="currentColor" />
        </SubscriptionsListItem>
      </SubscriptionsList>
    </BasicBlock>
  );
}
