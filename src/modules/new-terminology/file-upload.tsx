import { useGetImportStatusMutation } from '@app/common/components/excel/excel.slice';
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
  importResponse: any;
  handlePost: () => void;
  handleClose: () => void;
}

export default function FileUpload({
  importResponse,
  handlePost,
  handleClose,
}: FileUploadProps) {
  const { t } = useTranslation('admin');
  const [fetchImportStatus, importStatus] = useGetImportStatusMutation();

  useEffect(() => {
    if (
      importResponse.data?.message === 'SUCCESS' &&
      !importStatus.isLoading &&
      importStatus.data?.status !== 'SUCCESS'
    ) {
      const timerId = setTimeout(() => {
        fetchImportStatus(importResponse.data.jobToken);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [importResponse, fetchImportStatus, importStatus]);

  return (
    <>
      {importResponse.status === 'rejected' ? (
        <>
          <InlineAlert status="error" style={{ marginBottom: '25px' }}>
            {t('download-failed')}
          </InlineAlert>
          <ButtonBlock>
            <Button
              onClick={() => handlePost()}
            >
              {t('try-again')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleClose()}
            >
              {t('close')}
            </Button>
          </ButtonBlock>
        </>
      ) : (
        <>
          <FileUploadWrapper>
            {importStatus.data?.status === 'SUCCESS'
              ?
              <>
                <SuccessIndicator icon="check" color="white" />
                <Text variant="bold">{t('ready')}</Text>
              </>
              :
              <>
                <DownloadIndicator />
                <Text variant="bold">{t('loading')}</Text>
              </>
            }
          </FileUploadWrapper>
          <Button
            disabled={importStatus.data?.status === 'SUCCESS' ? false : true}
            onClick={() => handleClose()}
          >
            {t('close')}
          </Button>
        </>
      )}
    </>
  );
}
