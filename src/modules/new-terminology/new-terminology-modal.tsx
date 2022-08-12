import { usePostImportExcelMutation } from '@app/common/components/excel/excel.slice';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { terminologySearchApi } from '@app/common/components/terminology-search/terminology-search.slice';
import { usePostNewVocabularyMutation } from '@app/common/components/vocabulary/vocabulary.slice';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { useStoreDispatch } from '@app/store';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
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
import FileUpload from './file-upload';
import generateNewTerminology from './generate-new-terminology';
import InfoFile from './info-file';
import InfoManual from './info-manual';
import MissingInfoAlert from './missing-info-alert';
import { ModalTitleAsH1 } from './new-terminology.styles';

interface NewTerminologyModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

export default function NewTerminologyModal({
  showModal,
  setShowModal,
}: NewTerminologyModalProps) {
  const dispatch = useStoreDispatch();
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [isValid, setIsValid] = useState(false);
  const [inputType, setInputType] = useState('');
  const [startFileUpload, setStartFileUpload] = useState(false);
  const [fileData, setFileData] = useState<File | null>();
  const [userPosted, setUserPosted] = useState(false);
  const [manualData, setManualData] = useState<NewTerminologyInfo>();

  const [postNewVocabulary, newVocabulary] = usePostNewVocabularyMutation();
  const [postImportExcel, importExcel] = usePostImportExcelMutation();

  const handleClose = useCallback(() => {
    setUserPosted(false);
    setIsValid(false);
    setInputType('');
    setShowModal(false);
    setStartFileUpload(false);
  }, [setShowModal]);

  useEffect(() => {
    if (newVocabulary.isSuccess) {
      handleClose();
      dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));
    }
  }, [newVocabulary, dispatch, handleClose]);

  const handleCloseRequest = () => {
    handleClose();
    dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));
  };

  const handleSetInputType = (type: string) => {
    setInputType(type);
    setUserPosted(false);
    setIsValid(false);
    setStartFileUpload(false);
  };

  const handlePost = () => {
    if (inputType === 'self') {
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
    }

    if (inputType === 'file' && fileData) {
      const formData = new FormData();
      formData.append('file', fileData);
      setStartFileUpload(true);
      postImportExcel(formData);
      setUserPosted(true);
    }
  };

  return (
    <Modal
      appElementId="__next"
      visible={showModal}
      variant={isSmall ? 'smallScreen' : 'default'}
      onEscKeyDown={() => handleClose()}
      className="new-terminology-modal"
    >
      <ModalContent
        style={
          inputType === 'file' && userPosted ? { paddingBottom: '18px' } : {}
        }
      >
        <ModalTitleAsH1 as={'h1'}>
          {!startFileUpload ? t('add-new-terminology') : t('downloading-file')}
        </ModalTitleAsH1>

        {!startFileUpload ? (
          renderInfoInput()
        ) : (
          <FileUpload
            importResponseData={importExcel.data}
            importResponseStatus={importExcel.status}
            handlePost={handlePost}
            handleClose={handleCloseRequest}
          />
        )}
      </ModalContent>

      {!(inputType === 'file' && userPosted) && (
        <ModalFooter id="new-terminology-modal-footer">
          {userPosted && manualData && <MissingInfoAlert data={manualData} />}
          <Button
            onClick={() => handlePost()}
            disabled={!inputType}
            id="submit-button"
          >
            {t('add-terminology')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleClose()}
            id="cancel-button"
          >
            {t('cancel')}
          </Button>
        </ModalFooter>
      )}
    </Modal>
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
          onChange={(e) => handleSetInputType(e)}
          id="new-terminology-input-type"
        >
          <RadioButton value="self" id="new-terminology-input-type-hand">
            {t('by-hand')}
          </RadioButton>
          <RadioButton value="file" id="new-terminology-input-type-file">
            {t('by-file')}
          </RadioButton>
        </RadioButtonGroup>

        {inputType === 'self' && (
          <InfoManual
            setIsValid={setIsValid}
            setManualData={setManualData}
            userPosted={userPosted}
          />
        )}
        {inputType === 'file' && (
          <InfoFile setIsValid={setIsValid} setFileData={setFileData} />
        )}
      </>
    );
  }
}
