import { selectLogin } from '@app/common/components/login/login.slice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import ModelForm from '.';

export default function ModelFormModal() {
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const user = useSelector(selectLogin());

  console.log('user', user);

  const handleClose = () => {
    setVisible(false);
  };

  if (user.anonymous) {
    return null;
  }

  return (
    <>
      <Button
        icon="plus"
        style={{ height: 'min-content' }}
        onClick={() => setVisible(true)}
      >
        Lisää tietomalli
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>Lisää uusi tietomalli</ModalTitle>
          <Paragraph style={{ marginBottom: '30px' }}>
            Tiedot ovat pakollisia, jos niitä ei ole merkitty valinnaisiksi.
          </Paragraph>
          <ModelForm />
        </ModalContent>
        <ModalFooter>
          <Button>Luo tietomalli</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            Keskeytä
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
