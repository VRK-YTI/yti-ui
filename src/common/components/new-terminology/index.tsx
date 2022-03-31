import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  RadioButton,
  RadioButtonGroup,
  Text,
} from 'suomifi-ui-components';
import { selectLogin } from '@app/common/components/login/login.slice';
import { useBreakpoints } from '../media-query/media-query-context';
import FileUpload from './file-upload';
import InfoFile from './info-file';
import InfoManual from './info-manual';
import generateNewTerminology from './generate-new-terminology';
import { useDeleteVocabularyMutation, usePostNewVocabularyMutation } from '../vocabulary/vocabulary.slice';

export default function NewTerminology() {
  const user = useSelector(selectLogin());
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [showModal, setShowModal] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [inputType, setInputType] = useState('');
  const [startFileUpload, setStartFileUpload] = useState(false);
  const [manualData, setManualData] = useState({});
  const [postNewVocabulary, newVocabulary] = usePostNewVocabularyMutation();

  if (!user.superuser) {
    return null;
  }

  const handleClose = () => {
    setIsValid(false);
    setInputType('');
    setShowModal(false);
    setStartFileUpload(false);
  };

  const handlePost = (manualData) => {
    const newTerminology = generateNewTerminology({ data: manualData });
    const templateGraphID = newTerminology.type.graph.id;
    const prefix = manualData.prefix[0];
    console.log(newTerminology);
    postNewVocabulary({ templateGraphID, prefix, newTerminology });
  };

  return (
    <>
      <Button
        icon="plus"
        variant="secondary"
        fullWidth={isSmall}
        onClick={() => setShowModal(true)}
      >
        {t('add-new-terminology')}
      </Button>
      <Modal
        appElementId="__next"
        visible={showModal}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => handleClose()}
      >
        <ModalContent>
          <ModalTitle>
            {!startFileUpload ? t('add-new-terminology') : 'Tiedostoa ladataan'}
          </ModalTitle>

          {!startFileUpload ? renderInfoInput() : <FileUpload />}
        </ModalContent>

        <ModalFooter>
          {/* <Button disabled={!isValid} onClick={() => setStartFileUpload(true)}> */}
          <Button disabled={!isValid} onClick={() => handlePost(manualData)}>
            Lisää sanasto
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            Keskeytä
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  function renderInfoInput() {
    return (
      <>
        <Paragraph marginBottomSpacing="m">
          <Text>
            Tiedot ovat pakollisia, jos niitä ei ole merkitty valinnaisiksi.
          </Text>
        </Paragraph>

        <RadioButtonGroup
          labelText="Miten lisäät tietoja?"
          name="input-type"
          onChange={(e) => setInputType(e)}
        >
          <RadioButton value="self">Täytän tiedot itse</RadioButton>
          <RadioButton value="file">Tuon tiedostolla</RadioButton>
        </RadioButtonGroup>

        {inputType === 'self' && <InfoManual setIsValid={setIsValid} setManualData={setManualData} />}
        {inputType === 'file' && <InfoFile setIsValid={setIsValid} />}
      </>
    );
  }
}
