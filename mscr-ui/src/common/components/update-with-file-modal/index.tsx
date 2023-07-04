import { translateFileUploadError } from '@app/common/utils/translation-helpers';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
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
import fakeableUserSlice, {
  getFakeableUsers,
  useGetFakeableUsersQuery,
} from '../fakeable-users/fakeable-users.slice';

import { usePostImportJsonMutation } from '../import/import.slice';
import { useGetAuthenticatedUserMutMutation } from '../login/login.slice';
import {
  DownloadIndicator,
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

  const sampleSchema = {
    format: 'JSONSCHEMA',
    status: 'INCOMPLETE',
    label: {
      en: 'string',
    },
    description: {
      en: 'string',
    },
    languages: ['en'],
    organizations: ['7d3a3c00-5a6b-489b-a3ed-63bb58c26a63'],
  };

  const handlePost = () => {
    setUserPosted(true);

    console.log(getAuthenticatedUser());

    if (fileData) {
      const formData = new FormData();
      formData.append('file', fileData);
      setUserPosted(true);
      if (fileData.name.includes('.json')) {
        console.log('start posting');
        postImportJson(formData);
        //postSchema(formData);
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
            validFileTypes={['json', 'xslt']}
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
        <ModalTitle>{t('updating-schema')}</ModalTitle>

        <Button
          disabled={authenticatedUser.data?.anonymous}
          variant="secondary"
          onClick={() => handleClose()}
        >
          {t('close')}
        </Button>
      </ModalContentWrapper>
    );
  }
}