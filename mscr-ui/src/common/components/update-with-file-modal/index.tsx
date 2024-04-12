/**This will be used if uploading file from detail page */
import { translateFileUploadError } from '@app/common/utils/translation-helpers';
import { IconUpload} from 'suomifi-ui-components';
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

import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  usePostCrosswalkFileMutation,
  usePostSchemaFileMutation,
} from '../import/import.slice';
import { useGetAuthenticatedUserMutMutation } from '../login/login.slice';
import FileUpload from './file-upload';
import {
  UpdateDescriptionBlock,
  ImportDescriptionBlock,
} from './update-with-file-modal.styles';
import FileDropAreaMscr from '@app/common/components/file-drop-area-mscr';

interface UpdateWithFileModalProps {
  pid: string;
  unauthenticatedUser?: boolean;
  refetch: () => void;
}

export default function UpdateWithFileModal({
  pid,
  unauthenticatedUser,
  refetch,
}: UpdateWithFileModalProps) {
  const { t } = useTranslation('schema');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [userPosted, setUserPosted] = useState(false);
  const [fileData, setFileData] = useState<File | null>();
  const [fileType, setFileType] = useState<'csv' | 'json' | null>();
  const [getStatusRetries, setGetStatusRetries] = useState(0);
  const [startFileUpload, setStartFileUpload] = useState(false);
  const [postSchemaFile, ImportResponse] = usePostSchemaFileMutation();
  const [postCrosswalkFile, CrosswalkImportResponse] =
    usePostCrosswalkFileMutation();
  const [getAuthenticatedUser, authenticatedUser] =
    useGetAuthenticatedUserMutMutation();

  const handleClose = () => {
    setVisible(false);
    setIsValid(false);
    setUserPosted(false);
    setFileData(null);
    setStartFileUpload(false);
    if (ImportResponse.isSuccess) {
      alert('File Uploading finished');
    }
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
      // console.log('in file modal' + formData);
      //We need the file upload status to set the progress indication
      //setStartFileUpload(true);
      setUserPosted(true);
      if (fileData.name.includes('.json')) {
        setFileType('json');
        // console.log('start posting');
        postSchemaFile({ pid: pid, file: formData });
      } else if (fileData.name.includes('.csv')) {
        setFileType('csv');
        // console.log('start posting');
        postCrosswalkFile({ pid: pid, file: formData });
      }
    }
  };

  useEffect(() => {
    if (getStatusRetries > 9) {
      return;
    }
  });

  return (
    <>
      <Button variant="secondary" icon={<IconUpload />} onClick={() => handleVisible()}>
        {'Add a file'}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
      >
        {renderWithStatus()}
      </Modal>
    </>
  );

  function renderWithStatus() {
    return (
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={!isSmall ? 'default' : 'smallScreen'}
      >
        <ModalContent style={userPosted ? { paddingBottom: '18px' } : {}}>
          <ModalTitle>
            {!startFileUpload ? 'upload file' : t('downloading-file')}
          </ModalTitle>
          {!startFileUpload ? (
            <>
              <ImportDescriptionBlock>
                <Paragraph>{'import file description'} </Paragraph>
              </ImportDescriptionBlock>

              <FileDropAreaMscr
                setFileData={setFileData}
                setIsValid={setIsValid}
                validFileTypes={['csv', 'json']}
                translateFileUploadError={translateFileUploadError}
              />
            </>
          ) : (
            <FileUpload
              importResponseStatus={
                fileType === 'json'
                  ? ImportResponse.status
                  : ImportResponse.status
              }
              handlePost={handlePost}
              handleClose={handleClose}
            />
          )}
        </ModalContent>
        <ModalFooter id="file-import-modal-footer">
          {unauthenticatedUser && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-occurred_unauthenticated', { ns: 'alert' })}
            </InlineAlert>
          )}
          <Button
            disabled={!isValid || unauthenticatedUser}
            onClick={handlePost}
          >
            {'upload file'}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            {'cancel'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
