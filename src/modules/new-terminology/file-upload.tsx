import { useGetImportStatusMutation } from '@app/common/components/excel/excel.slice';
import { useEffect } from 'react';
import { Button, Text } from 'suomifi-ui-components';
import {
  DownloadIndicator,
  FileUploadWrapper,
  SuccessIndicator,
} from './new-terminology.styles';

interface FileUploadProps {
  importResponse: any;
  handleClose: () => void;
}

export default function FileUpload({ importResponse, handleClose }: FileUploadProps) {
  const [fetchImportStatus, importStatus] = useGetImportStatusMutation();
  console.log('importResponse', importResponse);

  useEffect(() => {
    if (importResponse.data?.message === 'SUCCESS' && (!importStatus.isLoading && importStatus.data?.status !== 'SUCCESS')) {
      const timerId = setTimeout(() => {
        fetchImportStatus(importResponse.data.jobToken);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [importResponse, fetchImportStatus, importStatus]);

  console.log('importStatus', importStatus);
  return (
    <>
      <FileUploadWrapper>
        {importStatus.data?.status === 'SUCCESS'
          ?
          <>
            <SuccessIndicator icon='check' color='white' />
            <Text variant='bold'>
              Valmis
            </Text>

          </>
          :
          <>
            <DownloadIndicator />
            <Text variant='bold'>
              Ladataan...
            </Text>
          </>
        }
      </FileUploadWrapper>
        <Button
          disabled={importStatus.data?.status === 'SUCCESS' ? false : true}
          onClick={() => handleClose()}
        >
          Sulje
        </Button>
    </>
  );
}
