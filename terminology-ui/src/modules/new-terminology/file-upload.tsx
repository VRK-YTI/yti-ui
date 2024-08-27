import {
  ExcelError,
  ExcelErrorDetailBlock,
} from '@app/common/components/import/excel.error';
import { ImportResponse } from '@app/common/interfaces/import.interface';
import { translateExcelParseError } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import {
  Button,
  ExternalLink,
  InlineAlert,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import {
  ButtonBlock,
  FileUploadWrapper,
  SuccessIndicator,
} from './new-terminology.styles';
import SaveSpinner from 'yti-common-ui/save-spinner';

interface FileUploadProps {
  importResponseData?: ImportResponse;
  importResponseStatus: string;
  handlePost: () => void;
  handleClose: () => void;
  errorInfo?: ExcelError;
}

export default function FileUpload({
  importResponseStatus,
  handlePost,
  handleClose,
  errorInfo,
}: FileUploadProps) {
  const { t } = useTranslation('admin');

  const handleTryAgain = () => {
    handlePost();
  };

  return (
    <>
      {importResponseStatus === 'rejected' ? (
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
            <>
              {importResponseStatus !== 'fulfilled' ? (
                <SaveSpinner text={t('import-concepts-in-progress')} />
              ) : (
                <>
                  <SuccessIndicator color="white" />
                  <Text variant="bold">{t('finished')}</Text>
                </>
              )}
            </>
          </FileUploadWrapper>
          <Button
            disabled={importResponseStatus !== 'fulfilled'}
            onClick={() => handleClose()}
          >
            {t('close')}
          </Button>
        </>
      )}
    </>
  );
}
