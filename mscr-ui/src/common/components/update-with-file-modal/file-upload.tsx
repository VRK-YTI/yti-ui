import {
  ExcelError,
  ExcelErrorDetailBlock,
} from '@app/common/components/import/excel.error';
import { ImportResponse } from '@app/common/interfaces/import.interface';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  ExternalLink,
  InlineAlert,
  Paragraph,
} from 'suomifi-ui-components';
import { ButtonBlock, DownloadIndicator } from './update-with-file-modal.styles';
import { translateExcelParseError } from '@app/common/utils/translation-helpers copy';

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
  const [getStatusRetries, setGetStatusRetries] = useState(0);

  const handleTryAgain = () => {
    setGetStatusRetries(0);
    handlePost();
  };

  useEffect(() => {
    if (getStatusRetries > 9) {
      return;
    }

    if (importResponseData?.jobtoken || importResponseData?.jobToken) {
      const timerId = setTimeout(() => {
        if (importResponseData.jobToken) {
          // console.log(importResponseData.jobToken);
        }
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [importResponseData, getStatusRetries]);

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
          <Button onClick={() => handleClose()}>{t('close')}</Button>
        </>
      )}
    </>
  );
}
