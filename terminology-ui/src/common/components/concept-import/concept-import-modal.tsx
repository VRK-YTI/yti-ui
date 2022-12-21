import FileUpload from '@app/modules/new-terminology/file-upload';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  ExternalLink,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
} from 'suomifi-ui-components';
import FileDropArea from '../file-drop-area';
import { createErrorMessage, ExcelError } from '../import/excel.error';
import {
  usePostImportNTRFMutation,
  usePostSimpleImportExcelMutation,
} from '../import/import.slice';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { ImportDescriptionBlock } from './concept-import.styles';

interface ConceptImportModalProps {
  terminologyId: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  refetch: () => void;
  unauthenticatedUser?: boolean;
}

export default function ConceptImportModal({
  terminologyId,
  visible,
  setVisible,
  refetch,
  unauthenticatedUser,
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
          <>
            <ImportDescriptionBlock>
              <Paragraph>
                {t('import-concepts-description-1')}{' '}
                <ExternalLink
                  href="https://wiki.dvv.fi/pages/viewpage.action?pageId=21783347"
                  labelNewWindow={t('link-opens-new-window-external', {
                    ns: 'common',
                  })}
                >
                  {t('from-terminology-manual')}
                </ExternalLink>
              </Paragraph>
              <Paragraph>{t('import-concepts-description-2')}</Paragraph>
            </ImportDescriptionBlock>
            <FileDropArea
              setFileData={setFileData}
              setIsValid={setIsValid}
              validFileTypes={['xlsx', 'xml']}
            />
          </>
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
          {unauthenticatedUser && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-occurred_unauthenticated', { ns: 'alert' })}
            </InlineAlert>
          )}
          <Button
            disabled={!isValid || unauthenticatedUser}
            onClick={handlePost}
          >
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
