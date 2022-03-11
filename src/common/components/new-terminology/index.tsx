import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, ModalContent, ModalFooter, ModalTitle, Paragraph, RadioButton, RadioButtonGroup, Text } from 'suomifi-ui-components';
import { selectLogin } from '../login/login-slice';
import { useBreakpoints } from '../media-query/media-query-context';
import FileUpload from './file-upload';
import InfoFile from './info-file';
import InfoManual from './info-manual';

export default function NewTerminology() {
  const user = useSelector(selectLogin());
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [showModal, setShowModal] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [inputType, setInputType] = useState('');

  if (!user.superuser) {
    return null;
  }

  const handleClose = () => {
    setIsValid(false);
    setInputType('');
    setShowModal(false);
  };

  return (
    <>
      <Button
        icon='plus'
        variant='secondary'
        fullWidth={isSmall}
        onClick={() => setShowModal(true)}
      >
        {t('add-new-terminology')}
      </Button>
      <Modal
        appElementId='__next'
        visible={showModal}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => handleClose()}
      >
        <ModalContent>
          <ModalTitle>
            {t('add-new-terminology')}
          </ModalTitle>

          <Paragraph marginBottomSpacing='m'>
            <Text>Tiedot ovat pakollisia, jos niitä ei ole merkitty valinnaisiksi.</Text>
          </Paragraph>

          <RadioButtonGroup
            labelText='Miten lisäät tietoja?'
            name='input-type'
            onChange={(e) => setInputType(e)}
          >
            <RadioButton value='self'>
              Täytän tiedot itse
            </RadioButton>
            <RadioButton value='file'>
              Tuon tiedostolla
            </RadioButton>
          </RadioButtonGroup>

          {inputType === 'self' && <InfoManual setIsValid={setIsValid} />}
          {inputType === 'file' && <><InfoFile /><FileUpload /></>}

        </ModalContent>

        <ModalFooter>
          <Button
            disabled={!isValid}
          >
            Lisää sanasto
          </Button>
          <Button
            variant='secondary'
            onClick={() => handleClose()}
          >
            Keskeytä
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
