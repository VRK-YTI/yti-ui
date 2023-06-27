import {
  ExcelError,
  ExcelErrorDetailBlock,
} from '@app/common/components/import/excel.error';
import { useGetImportStatusMutation } from '@app/common/components/import/import.slice';
import { ImportResponse } from '@app/common/interfaces/import.interface';
import { translateExcelParseError } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  ExternalLink,
  InlineAlert,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
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
  const [getStatusRetries, setGetStatusRetries] = useState(0);

  const handleTryAgain = () => {
    setGetStatusRetries(0);
    handlePost();
  };

  useEffect(() => {
    if (getStatusRetries > 9) {
      return;
    }

    if (importStatus.isError) {
      setGetStatusRetries(getStatusRetries + 1);
    }

    if (
      (importResponseData?.jobtoken || importResponseData?.jobToken) &&
      !importStatus.isLoading &&
      importStatus.data?.status !== 'SUCCESS'
    ) {
      const timerId = setTimeout(() => {
        if (importResponseData.jobtoken) {
          fetchImportStatus(importResponseData.jobtoken);
        }
        if (importResponseData.jobToken) {
          fetchImportStatus(importResponseData.jobToken);
        }
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [importResponseData, fetchImportStatus, importStatus, getStatusRetries]);

  return (
    <>
      {importResponseStatus === 'rejected' || getStatusRetries > 3 ? (
        <>
          <InlineAlert status="error" style={{ marginBottom: '25px' }}>
            {errorInfo ? (
              <>
                {errorInfo.data.message === 'incorrect-sheet-count' ? (
                  <>
                    <Paragraph>
                      {t('import-incorrect-excel-file-1.concept-import')}{' '}
                      <ExternalLink
                        href="https://wiki.dvv.fi/pages/viewpage.action?pageId=21783347"
                        labelNewWindow={t('site-open-link-new-window')}
                      >
                        {t('import-incorrect-excel-file-link')}
                      </ExternalLink>
                    </Paragraph>
                    <br />
                    <Paragraph>
                      {t('import-incorrect-excel-file-2.concept-import')}
                    </Paragraph>
                  </>
                ) : (
                  <>
                    {translateExcelParseError(errorInfo.data.message, t)}
                    <ExcelErrorDetailBlock errorInfo={errorInfo} />
                  </>
                )}
              </>
            ) : (
              <>{t('download-failed')}</>
            )}
          </InlineAlert>
          <ButtonBlock>
            <Button onClick={() => handleTryAgain()}>{t('try-again')}</Button>
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
                <SuccessIndicator color="white" />
                <Text variant="bold">{t('percent-done', { count: 100 })}</Text>
              </>
            ) : (
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
