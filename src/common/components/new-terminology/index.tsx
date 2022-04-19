import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  Paragraph,
  RadioButton,
  RadioButtonGroup,
  Text,
} from 'suomifi-ui-components';
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
import { ModalTitleAsH1 } from './new-terminology.styles';
import HasPermission from '@app/common/utils/has-permission';

export default function NewTerminology() {
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
      handleClose();
      dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));
    }
  }, [newVocabulary, dispatch]);

  if (!HasPermission({ actions: 'CREATE_TERMINOLOGY' })) {
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
        style={{ whiteSpace: 'nowrap' }}
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
          <ModalTitleAsH1 as={'h1'}>
            {!startFileUpload
              ? t('add-new-terminology')
              : t('downloading-file')}
          </ModalTitleAsH1>

          {!startFileUpload ? renderInfoInput() : <FileUpload />}
        </ModalContent>

        <ModalFooter>
          {userPosted && manualData && <MissingInfoAlert data={manualData} />}
          <Button onClick={() => handlePost(manualData)} disabled={!inputType}>
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
          <Text>{t('info-input-description')}</Text>
        </Paragraph>

        <RadioButtonGroup
          labelText={t('which-input')}
          name="input-type"
          onChange={(e) => setInputType(e)}
        >
          <RadioButton value="self">{t('by-hand')}</RadioButton>
          <RadioButton value="file">{t('by-file')}</RadioButton>
        </RadioButtonGroup>

        {inputType === 'self' && (
          <InfoManual
            setIsValid={setIsValid}
            setManualData={setManualData}
            userPosted={userPosted}
          />
        )}
        {inputType === 'file' && <InfoFile setIsValid={setIsValid} />}
      </>
    );
  }
}
