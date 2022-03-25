import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { Resource } from '../../interfaces/subscription.interface';
import getPrefLabel from '../../utils/get-preflabel';
import IconButton from '../icon-button/icon-button';
import { useBreakpoints } from '../media-query/media-query-context';
import {
  RemoveModal,
  RemoveModalContent,
  RemoveModalUl,
} from './subscription.styles';

interface RemoveSubscriptionProps {
  resources?: Resource[];
  resource?: Resource;
  toggleSubscription: (value: {
    action: 'DELETE' | 'ADD';
    uri: string;
  }) => void;
  setUnsubscribedItem: (value: string) => void;
}

export default function RemoveSubscription({
  resources,
  resource,
  toggleSubscription,
  setUnsubscribedItem,
}: RemoveSubscriptionProps) {
  const { t, i18n } = useTranslation('own-information');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);

  const handleUnsubscribe = () => {
    if (!resource) {
      return;
    }

    setUnsubscribedItem(
      getPrefLabel({ prefLabels: resource.prefLabel, lang: i18n.language })
    );
    setVisible(false);
    toggleSubscription({ action: 'DELETE', uri: resource.uri });
  };

  const handleUnsubscribeAll = () => {
    if (!resources) {
      return;
    }

    const uris = resources.map((resource) => resource.uri).join(',');
    setUnsubscribedItem(
      getPrefLabel({ prefLabels: resources[0].prefLabel, lang: i18n.language })
    );
    setVisible(false);
    toggleSubscription({ action: 'DELETE', uri: uris });
  };

  return (
    <>
      {resources && (
        <Button
          variant="secondary"
          icon="message"
          onClick={() => setVisible(true)}
        >
          {t('subscription-remove-all-notifications')}
        </Button>
      )}
      {resource && (
        <IconButton
          variant="secondary"
          icon="message"
          color="currentColor"
          onClick={() => setVisible(true)}
        />
      )}

      <RemoveModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <RemoveModalContent>
          <ModalTitle>
            {t('subscription-remove-email-notifications')}
          </ModalTitle>

          <Paragraph marginBottomSpacing="m">
            <Text>{t('subscription-remove-email-description')}</Text>
          </Paragraph>

          <Paragraph>
            <Text smallScreen variant="bold">
              {resources
                ? t('subscription-resources-to-be-removed')
                : t('subscription-resource-to-be-removed')}
            </Text>
            {resources && (
              <RemoveModalUl>
                {resources.map((resource, idx) => (
                  <li key={`resource-${idx}`}>
                    <Text smallScreen>
                      {getPrefLabel({
                        prefLabels: resource.prefLabel,
                        lang: i18n.language,
                      })}
                    </Text>
                  </li>
                ))}
              </RemoveModalUl>
            )}
            {resource && (
              <>
                <br />
                <Text smallScreen>
                  {getPrefLabel({
                    prefLabels: resource.prefLabel,
                    lang: i18n.language,
                  })}
                </Text>
              </>
            )}
          </Paragraph>
        </RemoveModalContent>

        <ModalFooter>
          <Button
            onClick={() =>
              resources ? handleUnsubscribeAll() : handleUnsubscribe()
            }
          >
            {t('subscription-remove')}
          </Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            {t('subscription-cancel')}
          </Button>
        </ModalFooter>
      </RemoveModal>
    </>
  );
}
