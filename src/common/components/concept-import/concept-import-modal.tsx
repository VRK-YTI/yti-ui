import FileUpload from '@app/modules/new-terminology/file-upload';
import InfoFile from '@app/modules/new-terminology/info-file';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { createErrorMessage, ExcelError } from '../excel/excel.error';
import { usePostSimpleImportExcelMutation } from '../excel/excel.slice';
import { useBreakpoints } from '../media-query/media-query-context';

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
  const [postSimpleImportExcel, simpleImportExcel] =
    usePostSimpleImportExcelMutation();

  const handleClose = useCallback(() => {
    setStartFileUpload(false);
    setVisible(false);
    setUserPosted(false);
    if (simpleImportExcel.isSuccess) {
      refetch();
    }
  }, [setVisible, refetch, simpleImportExcel]);

  const handlePost = () => {
    if (fileData) {
      const formData = new FormData();
      formData.append('file', fileData);
      setStartFileUpload(true);
      setUserPosted(true);
      postSimpleImportExcel({ terminologyId: terminologyId, file: formData });
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
      <ModalContent>
        <ModalTitle>{t('import-concepts')}</ModalTitle>
        {!startFileUpload ? (
          <InfoFile setFileData={setFileData} setIsValid={setIsValid} />
        ) : (
          <FileUpload
            importResponseData={simpleImportExcel.data}
            importResponseStatus={simpleImportExcel.status}
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
