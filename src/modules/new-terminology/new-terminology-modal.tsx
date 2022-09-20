import { usePostImportExcelMutation } from '@app/common/components/excel/excel.slice';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import SaveSpinner from '@app/common/components/save-spinner';
import { terminologySearchApi } from '@app/common/components/terminology-search/terminology-search.slice';
import { usePostNewVocabularyMutation } from '@app/common/components/vocabulary/vocabulary.slice';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import useConfirmBeforeLeavingPage from '@app/common/utils/hooks/use-confirm-before-leaving-page';
import { translateHttpError } from '@app/common/utils/translation-helpers';
import { useStoreDispatch } from '@app/store';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  InlineAlert,
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
import { FooterBlock, ModalTitleAsH1 } from './new-terminology.styles';

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
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [inputType, setInputType] = useState('');
  const [startFileUpload, setStartFileUpload] = useState(false);
  const [fileData, setFileData] = useState<File | null>();
  const [userPosted, setUserPosted] = useState(false);
  const [manualData, setManualData] = useState<NewTerminologyInfo>();
  const { enableConfirmation, disableConfirmation } =
    useConfirmBeforeLeavingPage('disabled');

  const [postNewVocabulary, newVocabulary] = usePostNewVocabularyMutation();
  const [postImportExcel, importExcel] = usePostImportExcelMutation();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState(false);

  const handleClose = useCallback(() => {
    setUserPosted(false);
    setIsValid(false);
    setIsCreating(false);
    setError(false);
    setInputType('');
    setShowModal(false);
    setStartFileUpload(false);
    disableConfirmation();
  }, [setShowModal, disableConfirmation]);

  useEffect(() => {
    if (newVocabulary.isSuccess) {
      dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));

      // API should return ID of new terminology but just in case if
      // create is succesful and ID is missing then just close the modal
      if (newVocabulary.data.length > 0) {
        disableConfirmation();
        router.push(`/terminology/${newVocabulary.data}`);
      } else {
        handleClose();
      }
    } else if (newVocabulary.isError) {
      setIsCreating(false);
      setError(true);
    }
  }, [t, newVocabulary, dispatch, handleClose, router, disableConfirmation]);

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

      setIsCreating(true);
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
      setIsCreating(true);
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
        <ModalTitleAsH1 as={'h1'} id="new-terminology-title">
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
          {newVocabulary.isError && (
            <InlineAlert status="error" role="alert" id="api-error-alert">
              {translateHttpError(
                'status' in newVocabulary.error
                  ? newVocabulary.error.status
                  : 'GENERIC_ERROR',
                t
              )}
            </InlineAlert>
          )}
          <FooterBlock>
            <Button
              onClick={() => handlePost()}
              disabled={!inputType || isCreating || error}
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
            {isCreating && <SaveSpinner text={t('adding-terminology')} />}
          </FooterBlock>
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
          <RadioButton
            disabled={error}
            value="self"
            id="new-terminology-input-type-hand"
          >
            {t('by-hand')}
          </RadioButton>
          <RadioButton
            disabled={error}
            value="file"
            id="new-terminology-input-type-file"
          >
            {t('by-file')}
          </RadioButton>
        </RadioButtonGroup>

        {inputType === 'self' && (
          <InfoManual
            disabled={error}
            setIsValid={setIsValid}
            setManualData={setManualData}
            userPosted={userPosted}
            onChange={enableConfirmation}
          />
        )}
        {inputType === 'file' && (
          <InfoFile setIsValid={setIsValid} setFileData={setFileData} />
        )}
      </>
    );
  }
}
