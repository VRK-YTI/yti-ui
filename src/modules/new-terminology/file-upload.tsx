import { useGetImportStatusMutation } from '@app/common/components/excel/excel.slice';
import { ImportResponse } from '@app/common/interfaces/excel.interface';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { Button, InlineAlert, Text } from 'suomifi-ui-components';
import {
  ButtonBlock,
  DownloadIndicator,
  FileUploadWrapper,
  SuccessIndicator,
} from './new-terminology.styles';

interface FileUploadProps {
  importResponseData?: ImportResponse;
  importResponseStatus: string;
  handlePost: () => void;
  handleClose: () => void;
}

export default function FileUpload({
  importResponseData,
  importResponseStatus,
  handlePost,
  handleClose,
}: FileUploadProps) {
  const { t } = useTranslation('admin');
  const [fetchImportStatus, importStatus] = useGetImportStatusMutation();

  useEffect(() => {
    if (
      importResponseData?.message === 'SUCCESS' &&
      !importStatus.isLoading &&
      importStatus.data?.status !== 'SUCCESS'
    ) {
      const timerId = setTimeout(() => {
        fetchImportStatus(importResponseData.jobToken);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [importResponseData, fetchImportStatus, importStatus]);

  return (
    <>
      {importResponseStatus === 'rejected' ? (
        <>
          <InlineAlert status="error" style={{ marginBottom: '25px' }}>
            {t('download-failed')}
          </InlineAlert>
          <ButtonBlock>
            <Button onClick={() => handlePost()}>{t('try-again')}</Button>
            <Button variant="secondary" onClick={() => handleClose()}>
              {t('close')}
            </Button>
          </ButtonBlock>
        </>
      ) : (
        <>
          <FileUploadWrapper>
            {importStatus.data?.status.toLowerCase() === 'success' ? (
              <>
                <SuccessIndicator icon="check" color="white" />
                <Text variant="bold">{t('ready')}</Text>
              </>
            ) : (
              <>
                <DownloadIndicator />
                <Text variant="bold">{t('loading')}</Text>
              </>
            )}
          </FileUploadWrapper>
          <Button
            disabled={
              importStatus.data?.status.toLowerCase() === 'success'
                ? false
                : true
            }
            onClick={() => handleClose()}
          >
            {t('close')}
          </Button>
        </>
      )}
    </>
  );
}
