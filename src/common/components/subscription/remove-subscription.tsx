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
// import IconButton from '../icon-button/icon-button';
import { Icon } from '../suomifi-7-tweaks/icon';
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
    toggleSubscription({ action: 'DELETE', uri: resource.uri.replace(/\/terminological[\w-]+/g, '/') });
  };

  const handleUnsubscribeAll = () => {
    if (!resources) {
      return;
    }

    const uris = resources.map((resource) => resource.uri.replace(/\/terminological[\w-]+/g, '/')).join(',');
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
          // message="alertOff"
          onClick={() => setVisible(true)}
        >
          <Icon
            icon="alertOff"
            mousePointer
            color="currentColor"
            className="fi-button_icon"
          />
          {t('subscription-remove-all-notifications')}
        </Button>
      )}

      {/* Added styling here before current suomifi can be imported */}
      {resource && (
        <Button
          variant="secondary"
          onClick={() => setVisible(true)}
          style={{ height: '40px', width: '40px', padding: 0 }}
        >
          <Icon
            icon="alertOff"
            mousePointer
            color="currentColor"
            className="fi-button_icon"
            style={{ margin: '0' }}
          />
        </Button>

        // <IconButton
        //   variant="secondary"
        //   icon="alertOff"
        //   color="currentColor"
        //   onClick={() => setVisible(true)}
        // />
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
