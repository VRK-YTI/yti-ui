import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
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
import { usePostNewVocabularyMutation } from '../vocabulary/vocabulary.slice';
import { useStoreDispatch } from '@app/store';
import { terminologySearchApi } from '../terminology-search/terminology-search.slice';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import MissingInfoAlert from './missing-info-alert';

export default function NewTerminology() {
  const user = useSelector(selectLogin());
  const dispatch = useStoreDispatch();
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [showModal, setShowModal] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [inputType, setInputType] = useState('');
  const [startFileUpload, setStartFileUpload] = useState(false);
  const [manualData, setManualData] = useState<NewTerminologyInfo>();
  const [userPosted, setUserPosted] = useState(false);
  const [postNewVocabulary, newVocabulary] = usePostNewVocabularyMutation();

  useEffect(() => {
    if (newVocabulary.isSuccess) {
      setShowModal(false);
      dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));
    }
  }, [newVocabulary]);

  if (!user.superuser) {
    return null;
  }

  const handleClose = () => {
    setUserPosted(false);
    setIsValid(false);
    setInputType('');
    setShowModal(false);
    setStartFileUpload(false);
  };

  const handlePost = (manualData?: NewTerminologyInfo) => {
    setUserPosted(true);
    if (!isValid || !manualData) {
      console.error('Data not valid');
      return;
    }

    const newTerminology = generateNewTerminology({ data: manualData });

    if (!newTerminology) {
      console.error('Main organization missing');
      return;
    }

    const templateGraphID = newTerminology.type.graph.id;
    const prefix = manualData.prefix[0];
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
            {!startFileUpload ? t('add-new-terminology') : t('downloading-file')}
          </ModalTitle>

          {!startFileUpload ? renderInfoInput() : <FileUpload />}
        </ModalContent>

        <ModalFooter>
          {/* <Button disabled={!isValid} onClick={() => setStartFileUpload(true)}> */}

          {
            (userPosted && manualData)
            &&
            <MissingInfoAlert data={manualData} />
          }
          <Button onClick={() => handlePost(manualData)}>
            {t('add-terminology')}
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel')}
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
            {t('info-input-description')}
          </Text>
        </Paragraph>

        <RadioButtonGroup
          labelText="Miten lisäät tietoja?"
          name="input-type"
          onChange={(e) => setInputType(e)}
        >
          <RadioButton value="self">{t('by-hand')}</RadioButton>
          <RadioButton value="file">{t('by-file')}</RadioButton>
        </RadioButtonGroup>

        {inputType === 'self'
          &&
          <InfoManual setIsValid={setIsValid} setManualData={setManualData} userPosted={userPosted} />}
        {inputType === 'file' && <InfoFile setIsValid={setIsValid} />}
      </>
    );
  }
}
