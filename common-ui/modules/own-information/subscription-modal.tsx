import { useEffect, useState } from 'react';
import {
  Button,
  IconAlertOff,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { BasicBlock } from '../../components/block';
import { NarrowModal } from './own-information.styles';
import { Subscription } from 'interfaces/subscription.interface';

interface SubscriptionModalProps {
  resourceIds: string[];
  singular?: boolean;
  toggleSubscriptionResult: {
    isSuccess: boolean;
    isError: boolean;
    isLoading: boolean;
    data?: Subscription;
  };
  refetchSubscriptions: () => void;
  toggleSubscription: (value: {
    action: 'DELETE' | 'ADD';
    uri: string;
  }) => void;
}

export default function SubscriptionModal({
  resourceIds,
  singular,
  toggleSubscriptionResult,
  refetchSubscriptions,
  toggleSubscription,
}: SubscriptionModalProps) {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    toggleSubscription({
      action: 'DELETE',
      uri: resourceIds.join(','),
    });
  };

  useEffect(() => {
    if (toggleSubscriptionResult.isSuccess) {
      setVisible(false);
      refetchSubscriptions();
    }
  }, [toggleSubscriptionResult, refetchSubscriptions]);

  return (
    <>
      <Button
        variant="secondary"
        icon={<IconAlertOff />}
        onClick={() => setVisible(true)}
        id="remove-all-subscriptions-button"
      >
        {!singular ? 'Poista kaikki ilmoitukset' : ''}
      </Button>

      <NarrowModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
      >
        <ModalContent>
          <ModalTitle>Poista sähköposti-ilmoitukset</ModalTitle>

          <Paragraph>
            <Text>
              Kun poistat sähköposti-ilmoitukset, aineistoa ei enää näytetä
              listalla. Voit lisätä aineistoon ilmoitukset aineiston omalta
              sivulta.
            </Text>
          </Paragraph>

          <BasicBlock title="Aineisto, josta poistetaan ilmoitukset">
            {resourceIds.map((id) => (
              <div key={id}>{id}</div>
            ))}
          </BasicBlock>
        </ModalContent>

        <ModalFooter>
          <Button onClick={() => handleClick()}>Poista</Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            Peruuta
          </Button>
        </ModalFooter>
      </NarrowModal>
    </>
  );
}
