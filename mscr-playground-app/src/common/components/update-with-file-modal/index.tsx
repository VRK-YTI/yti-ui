import { translateFileUploadError } from '@app/common/utils/translation-helpers';
import { DownloadIndicator } from '@app/modules/new-terminology/new-terminology.styles';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  ExternalLink,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import FileDropArea from 'yti-common-ui/file-drop-area';
import {
  createErrorMessage,
  ExcelError,
  ExcelErrorDetailBlock,
} from '../import/excel.error';
import {
  useGetImportStatusMutation,
  usePostImportExcelMutation,
  usePostImportJsonMutation,
} from '../import/import.slice';
import { useGetAuthenticatedUserMutMutation } from '../login/login.slice';
import {
  ModalContentWrapper,
  SuccessIcon,
  UpdateDescriptionBlock,
} from './update-with-file-modal.styles';

export default function UpdateWithFileModal() {
  const { t } = useTranslation('schema');
  const [visible, setVisible] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [userPosted, setUserPosted] = useState(false);
  const [fileData, setFileData] = useState<File | null>();
  const [getStatusRetries, setGetStatusRetries] = useState(0);
  const [error, setError] = useState<ExcelError | undefined>(undefined);
  const [postImportExcel, importExcel] = usePostImportExcelMutation();
  const [fetchImportStatus, importStatus] = useGetImportStatusMutation();
  const [postImportJson, importJson] = usePostImportJsonMutation();
  const [getAuthenticatedUser, authenticatedUser] =
    useGetAuthenticatedUserMutMutation();

  const handleClose = () => {
    setVisible(false);
    setIsValid(false);
    setUserPosted(false);
    setFileData(null);
  };

  const handleVisible = () => {
    getAuthenticatedUser();
    setVisible(true);
  };

  const handlePost = () => {
    setUserPosted(true);

    if (fileData) {
      const formData = new FormData();
      formData.append('file', fileData);
      setUserPosted(true);
      if (fileData.name.includes('.xlsx')) {
        postImportExcel(formData);
      }
      if (fileData.name.includes('.json')) {
        postImportJson(formData);
      }
    }
  };

  useEffect(() => {
    if (getStatusRetries > 9) {
      return;
    }

    if (importExcel.isError) {
      setError(createErrorMessage(importExcel.error));
    }

    if (importStatus.isError) {
      setGetStatusRetries(getStatusRetries + 1);
    }

    if (!importStatus.isLoading && importStatus.data?.status !== 'SUCCESS') {
      const timerId = setTimeout(() => {
        if (importExcel.data?.jobToken) {
          fetchImportStatus(importExcel.data.jobToken);
        }
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [importExcel, importStatus, fetchImportStatus, getStatusRetries]);

  return (
    <>
      <Button variant="secondary" icon="upload" onClick={() => handleVisible()}>
        {t('schema-file-upload-title')}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
      >
        {!userPosted ? renderSetup() : renderProcess()}
      </Modal>
    </>
  );

  function renderSetup() {
    return (
      <>
        <ModalContent>
          <ModalTitle>{t('schema-file-upload-title')}</ModalTitle>
          <UpdateDescriptionBlock>
            <Paragraph>{t('schema-file-upload-description')} </Paragraph>
          </UpdateDescriptionBlock>
          <FileDropArea
            setFileData={setFileData}
            setIsValid={setIsValid}
            validFileTypes={['xlsx', 'json']}
            translateFileUploadError={translateFileUploadError}
          />
        </ModalContent>
        <ModalFooter>
          {authenticatedUser.data?.anonymous && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-occurred_unauthenticated', { ns: 'alert' })}
            </InlineAlert>
          )}
          <Button disabled={!isValid} onClick={() => handlePost()}>
            {t('upload-file')}
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel')}
          </Button>
        </ModalFooter>
      </>
    );
  }

  function renderProcess() {
    return (
      <ModalContentWrapper>
        <ModalTitle>{t('updating-terminology')}</ModalTitle>

        {(importExcel.isSuccess ||
          (importStatus.isUninitialized && !importExcel.isError)) && (
          <div id="loading-block">
            {importStatus.data?.status !== 'SUCCESS' ? (
              <>
                <DownloadIndicator />
                <Text variant="bold">
                  {t('percent-done', {
                    count:
                      importStatus.data?.processingProgress !== undefined &&
                      importStatus.data?.processingTotal !== undefined &&
                      importStatus.data?.processingTotal !== 0
                        ? Math.floor(
                            (importStatus.data?.processingProgress /
                              importStatus.data?.processingTotal) *
                              100
                          )
                        : 0,
                  })}
                </Text>
              </>
            ) : (
              <>
                <SuccessIcon icon="checkCircleFilled" />
                <Text variant="bold">{t('percent-done', { count: 100 })}</Text>
              </>
            )}
          </div>
        )}

        {importExcel.isError && (
          <div id="error-block">
            <InlineAlert status="error">
              {error ? (
                <>
                  {error.data.message === 'incorrect-sheet-count' ? (
                    <>
                      <Paragraph>
                        {t('import-incorrect-excel-file-1.update-terminology')}{' '}
                        <ExternalLink
                          href="https://wiki.dvv.fi/pages/viewpage.action?pageId=21783347"
                          labelNewWindow={t('site-open-link-new-window')}
                        >
                          {t('import-incorrect-excel-file-link')}
                        </ExternalLink>
                      </Paragraph>
                      <br />
                      <Paragraph>
                        {t('import-incorrect-excel-file-2.update-terminology')}
                      </Paragraph>
                    </>
                  ) : (
                    <>
                      <>{t('terminology-update-failed')}</>
                      <ExcelErrorDetailBlock errorInfo={error} />
                    </>
                  )}
                </>
              ) : (
                <>{t('terminology-update-failed')}</>
              )}
            </InlineAlert>
          </div>
        )}

        {importStatus.isError && (
          <div id="error-block">
            <InlineAlert status="error">
              {t('terminology-update-status-failed')}
            </InlineAlert>
          </div>
        )}

        <div>
          {(importExcel.isError || importStatus.isError) && (
            <Button onClick={() => handlePost()}>{t('try-again')}</Button>
          )}

          <Button
            disabled={
              authenticatedUser.data?.anonymous ||
              importExcel.isLoading ||
              (importExcel.data?.jobToken && importStatus.isUninitialized) ||
              importStatus.isLoading ||
              (importStatus.isSuccess &&
                importStatus.data?.status !== 'SUCCESS')
            }
            variant="secondary"
            onClick={() => handleClose()}
          >
            {t('close')}
          </Button>
        </div>
      </ModalContentWrapper>
    );
  }
}
