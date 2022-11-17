import FileUpload from '@app/modules/new-terminology/file-upload';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import FileDropArea from '../file-drop-area';
import { createErrorMessage, ExcelError } from '../import/excel.error';
import {
  usePostImportNTRFMutation,
  usePostSimpleImportExcelMutation,
} from '../import/import.slice';
import { useBreakpoints } from 'yti-common-ui/media-query';

interface ConceptImportModalProps {
  terminologyId: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  refetch: () => void;
}

export default function ConceptImportModal({
  terminologyId,
  visible,
  setVisible,
  refetch,
}: ConceptImportModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [fileData, setFileData] = useState<File | null>();
  const [isValid, setIsValid] = useState(false);
  const [userPosted, setUserPosted] = useState(false);
  const [startFileUpload, setStartFileUpload] = useState(false);
  const [error, setError] = useState<ExcelError | undefined>(undefined);
  const [fileType, setFileType] = useState<'xlsx' | 'xml' | null>();
  const [postSimpleImportExcel, simpleImportExcel] =
    usePostSimpleImportExcelMutation();
  const [postImportNTRF, importNTRF] = usePostImportNTRFMutation();

  const handleClose = useCallback(() => {
    setStartFileUpload(false);
    setVisible(false);
    setUserPosted(false);
    if (simpleImportExcel.isSuccess || importNTRF.isSuccess) {
      refetch();
    }
  }, [setVisible, refetch, simpleImportExcel, importNTRF]);

  const handlePost = () => {
    if (fileData) {
      const formData = new FormData();
      formData.append('file', fileData);
      setStartFileUpload(true);
      setUserPosted(true);
      if (fileData.name.includes('.xlsx')) {
        setFileType('xlsx');
        postSimpleImportExcel({ terminologyId: terminologyId, file: formData });
      } else if (fileData.name.includes('.xml')) {
        setFileType('xml');
        postImportNTRF({ terminologyId: terminologyId, file: formData });
      }
    }
  };

  useEffect(() => {
    if (simpleImportExcel.isError) {
      setError(createErrorMessage(simpleImportExcel.error));
    }
  }, [simpleImportExcel]);

  return (
    <Modal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClose()}
      variant={!isSmall ? 'default' : 'smallScreen'}
    >
      <ModalContent style={userPosted ? { paddingBottom: '18px' } : {}}>
        <ModalTitle>
          {!startFileUpload ? t('import-concepts') : t('downloading-file')}
        </ModalTitle>
        {!startFileUpload ? (
          <FileDropArea
            setFileData={setFileData}
            setIsValid={setIsValid}
            validFileTypes={['xlsx', 'xml']}
          />
        ) : (
          <FileUpload
            importResponseData={
              fileType === 'xlsx' ? simpleImportExcel.data : importNTRF.data
            }
            importResponseStatus={
              fileType === 'xlsx' ? simpleImportExcel.status : importNTRF.status
            }
            handlePost={handlePost}
            handleClose={handleClose}
            errorInfo={error}
          />
        )}
      </ModalContent>
      {!userPosted && (
        <ModalFooter id="concept-import-modal-footer">
          <Button disabled={!isValid} onClick={handlePost}>
            {t('import-concepts-to-terminology')}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}
