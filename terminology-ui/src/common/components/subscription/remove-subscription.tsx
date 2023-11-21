import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  IconAlertOff,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { Resource } from '../../interfaces/subscription.interface';
import getPrefLabel from '../../utils/get-preflabel';
import IconButton from 'yti-common-ui/icon-button';
import { useBreakpoints } from 'yti-common-ui/media-query';
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
      resource.prefLabel
        ? getPrefLabel({ prefLabels: resource.prefLabel, lang: i18n.language })
        : resource.uri
    );
    setVisible(false);
    toggleSubscription({
      action: 'DELETE',
      uri: resource.uri.replace(/\/terminological[\w-]+/g, '/'),
    });
  };

  const handleUnsubscribeAll = () => {
    if (!resources) {
      return;
    }

    const uris = resources
      .map((resource) => resource.uri.replace(/\/terminological[\w-]+/g, '/'))
      .join(',');
    setUnsubscribedItem(
      resources[0].prefLabel
        ? getPrefLabel({
            prefLabels: resources[0].prefLabel,
            lang: i18n.language,
          })
        : resources[0].uri
    );
    setVisible(false);
    toggleSubscription({ action: 'DELETE', uri: uris });
  };

  return (
    <>
      {resources && (
        <Button
          variant="secondary"
          icon={<IconAlertOff />}
          onClick={() => setVisible(true)}
          id="remove-all-notifications-button"
        >
          {t('subscription-remove-all-notifications')}
        </Button>
      )}

      {resource && (
        <IconButton
          variant="secondary"
          icon={<IconAlertOff />}
          color="currentColor"
          onClick={() => setVisible(true)}
        />
      )}

      <RemoveModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
        scrollable={false}
        className="remove-subscriptions-modal"
      >
        <RemoveModalContent>
          <ModalTitle>
            {t('subscription-remove-email-notifications')}
          </ModalTitle>

          <Paragraph mb="m">
            <Text>{t('subscription-remove-email-description')}</Text>
          </Paragraph>

          <Text smallScreen variant="bold">
            {resources
              ? t('subscription-resources-to-be-removed')
              : t('subscription-resource-to-be-removed')}
          </Text>
          {resources && (
            <RemoveModalUl id="to-be-removed-subscriptions-ul">
              {resources.map((resource, idx) => (
                <li key={`resource-${idx}`}>
                  <Text smallScreen className="to-be-removed-subscription">
                    {resource.prefLabel
                      ? getPrefLabel({
                          prefLabels: resource.prefLabel,
                          lang: i18n.language,
                        })
                      : resource.uri}
                  </Text>
                </li>
              ))}
            </RemoveModalUl>
          )}
          {resource && (
            <Paragraph>
              <Text smallScreen>
                {resource.prefLabel
                  ? getPrefLabel({
                      prefLabels: resource.prefLabel,
                      lang: i18n.language,
                    })
                  : resource.uri}
              </Text>
            </Paragraph>
          )}
        </RemoveModalContent>

        <ModalFooter>
          <Button
            onClick={() =>
              resources ? handleUnsubscribeAll() : handleUnsubscribe()
            }
            id="submit-button"
          >
            {t('subscription-remove')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setVisible(false)}
            id="cancel-button"
          >
            {t('subscription-cancel')}
          </Button>
        </ModalFooter>
      </RemoveModal>
    </>
  );
}
