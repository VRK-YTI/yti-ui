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
import FileDropArea from '../file-drop-area';
import {
  useGetImportStatusMutation,
  usePostImportExcelMutation,
} from '../import/import.slice';
import {
  ModalContentWrapper,
  SuccessIcon,
  UpdateDescriptionBlock,
} from './update-with-file-modal.styles';

export default function UpdateWithFileModal() {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [userPosted, setUserPosted] = useState(false);
  const [fileData, setFileData] = useState<File | null>();
  const [getStatusRetries, setGetStatusRetries] = useState(0);
  const [postImportExcel, importExcel] = usePostImportExcelMutation();
  const [fetchImportStatus, importStatus] = useGetImportStatusMutation();

  const handleClose = () => {
    setVisible(false);
    setIsValid(false);
    setUserPosted(false);
    setFileData(null);
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
    }
  };

  useEffect(() => {
    if (getStatusRetries > 9) {
      return;
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
      <Button
        variant="secondary"
        icon="upload"
        onClick={() => setVisible(true)}
      >
        {t('update-terminology-with-file')}
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
          <ModalTitle>{t('update-terminology-with-file')}</ModalTitle>
          <UpdateDescriptionBlock>
            <Paragraph>
              {t('update-terminology-description-1')}{' '}
              <ExternalLink
                href="https://wiki.dvv.fi/pages/viewpage.action?pageId=21783347"
                labelNewWindow={t('link-opens-new-window-external', {
                  ns: 'common',
                })}
              >
                {t('from-terminology-manual')}
              </ExternalLink>
            </Paragraph>
            <Paragraph>{t('update-terminology-description-2')}</Paragraph>
          </UpdateDescriptionBlock>
          <FileDropArea
            setFileData={setFileData}
            setIsValid={setIsValid}
            validFileTypes={['xlsx']}
          />
        </ModalContent>
        <ModalFooter>
          <Button disabled={!isValid} onClick={() => handlePost()}>
            {t('update-terminology')}
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
              {t('terminology-update-failed')}
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
