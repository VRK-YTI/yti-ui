import { useState } from 'react';
import { Block, Button, Checkbox, Dropdown, DropdownItem, Modal, ModalContent, ModalFooter, ModalTitle, Paragraph, Text } from 'suomifi-ui-components';
import { AccessRequestDescription, AccessRequestModal, AccessRequestModalFooter, ModalButton, ModalContentBlock, Title } from './access-request.styles';

export default function AccessRequest() {
  const [visible, setVisible] = useState(false);


  return (
    <>
      <Title>
        Käyttöoikeuspyyntö
      </Title>

      <AccessRequestDescription>
        Jos haluat muokkausoikeudet sisältöihin, tee käyttöoikeuspyyntö. Pyynnön käsittelee organisaation pääkäyttäjä.
      </AccessRequestDescription>

      <ModalButton
        variant='secondary'
        icon='message'
        onClick={() => setVisible(true)}
      >
        Tee käyttöoikeuspyyntö
      </ModalButton>

      <AccessRequestModal
        appElementId='__next'
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
      >
        <ModalContent>
          <ModalTitle>
            Tee käyttöoikeuspyyntö
          </ModalTitle>
          <Paragraph>
            <Text>
              Valitse organisaatio, jonka aineistoihin haluat tehdä käyttöoikeuspyynnön. Saat ilmoituksen sähköpostilla kun käyttöoikeuspyyntö on käsitelty.
            </Text>
          </Paragraph>

          <ModalContentBlock>
            <Dropdown
              labelText='Organisaatio'
              visualPlaceholder='Valitse organisaatio'
            >
              <DropdownItem
                value='1'
              >
                Organisaatio 1
              </DropdownItem>
              <DropdownItem
                value='2'
              >
                Organisaatio 2
              </DropdownItem>
            </Dropdown>
          </ModalContentBlock>

          <ModalContentBlock>
            <Checkbox>
              Sanastot
            </Checkbox>
            <Checkbox>
              Koodistot
            </Checkbox>
            <Checkbox>
              Tietomallit
            </Checkbox>
          </ModalContentBlock>

        </ModalContent>

        <AccessRequestModalFooter>
          <Button>Lähetä pyyntö</Button>
          <Button
            variant='secondary'
            onClick={() => setVisible(false)}
          >
            Peruuta
          </Button>
        </AccessRequestModalFooter>
      </AccessRequestModal>
    </>
  );
};
