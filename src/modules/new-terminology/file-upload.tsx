import { ExcelError } from '@app/common/components/excel/excel.error';
import { useGetImportStatusMutation } from '@app/common/components/excel/excel.slice';
import { ImportResponse } from '@app/common/interfaces/excel.interface';
import { translateExcelParseError } from '@app/common/utils/translation-helpers';
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
  errorInfo?: ExcelError;
}

export default function FileUpload({
  importResponseData,
  importResponseStatus,
  handlePost,
  handleClose,
  errorInfo,
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
            {errorInfo ? (
              <>
                {translateExcelParseError(errorInfo.data.message, t)}
                <ul>
                  {errorInfo.data.errorDetails?.sheet && (
                    <li>{`${t('excel-sheet')}: ${
                      errorInfo.data.errorDetails?.sheet
                    }`}</li>
                  )}
                  {errorInfo.data.errorDetails?.row != undefined && (
                    <li>{`${t('excel-row')}: ${
                      errorInfo.data.errorDetails?.row
                    }`}</li>
                  )}
                  {errorInfo.data.errorDetails?.column && (
                    <li>{`${t('excel-column')}: ${
                      errorInfo.data.errorDetails?.column
                    }`}</li>
                  )}
                </ul>
              </>
            ) : (
              <>{t('download-failed')}</>
            )}
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
                <Text variant="bold">100% {t('percent-done')}</Text>
              </>
            ) : (
              <>
                <DownloadIndicator />
                <Text variant="bold">
                  {importStatus.data?.processingProgress !== undefined &&
                  importStatus.data?.processingTotal !== undefined &&
                  importStatus.data?.processingTotal !== 0
                    ? Math.floor(
                        (importStatus.data?.processingProgress /
                          importStatus.data?.processingTotal) *
                          100
                      )
                    : 0}
                  % {t('percent-done')}
                </Text>
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
