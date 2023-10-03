import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  ButtonFooter,
  NarrowModal,
  SimpleModalContent,
} from '../as-file-modal/as-file-modal.styles';
import {
  Button,
  InlineAlert,
  ModalTitle,
  RadioButton,
  RadioButtonGroup,
  TextInput,
} from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { useCallback, useEffect, useState } from 'react';
import SaveSpinner from 'yti-common-ui/save-spinner';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';
import { useCreateReleaseMutation } from '@app/common/components/model/model.slice';
import { useRouter } from 'next/router';
import getApiError from '@app/common/utils/get-api-errors';

interface CreateReleaseModalProps {
  hide: () => void;
  visible: boolean;
  modelId: string;
}

export default function CreateReleaseModal({
  hide,
  visible,
  modelId,
}: CreateReleaseModalProps) {
  const { isSmall } = useBreakpoints();
  const { t } = useTranslation('admin');
  const router = useRouter();
  const [releaseStatus, setReleaseStatus] = useState('VALID');
  const [releaseVersion, setReleaseVersion] = useState('');
  const [userPosted, setUserPosted] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [createRelease, createReleaseResult] = useCreateReleaseMutation();

  const handleReleaseVersionChange = (e: string) => {
    if (e.match(/[0-9]+\.[0-9]+\.[0-9]+/)) {
      setVersionError(false);
    }
    setReleaseVersion(e);
  };

  const handleCreateRelease = () => {
    if (!releaseVersion.match(/[0-9]+\.[0-9]+\.[0-9]+/)) {
      setVersionError(true);
      return;
    }

    setUserPosted(true);
    createRelease({
      modelId: modelId,
      status: releaseStatus,
      version: releaseVersion,
    });
  };

  const handleClose = useCallback(() => {
    setReleaseStatus('VALID');
    setUserPosted(false);
    setVersionError(false);
    hide();
  }, [hide]);

  useEffect(() => {
    if (createReleaseResult.isSuccess) {
      router.push({
        pathname: `/model/${modelId}`,
        query: { ver: releaseVersion },
      });
      handleClose();
    }

    if (createReleaseResult.isError) {
      setUserPosted(false);
    }
  }, [createReleaseResult, handleClose, router, modelId, releaseVersion]);

  return (
    <NarrowModal
      appElementId="__next"
      visible={visible}
      variant={isSmall ? 'smallScreen' : 'default'}
      onEscKeyDown={() => handleClose()}
    >
      <SimpleModalContent>
        <ModalTitle>{t('create-release')}</ModalTitle>
        <RadioButtonGroup
          name="create-release-status"
          labelText={t('create-release-status')}
          onChange={(e) => setReleaseStatus(e)}
          id="create-release-status-field"
          defaultValue="VALID"
        >
          <RadioButton value="VALID">{translateStatus('VALID', t)}</RadioButton>
          <RadioButton value="SUGGESTED">
            {`${translateStatus('SUGGESTED', t)} (${t('commentable-version')})`}
          </RadioButton>
        </RadioButtonGroup>
        <TextInput
          labelText={t('release-version-number')}
          hintText={t('release-version-number-hint')}
          placeholder={t('write-version-number')}
          onChange={(e) => handleReleaseVersionChange(e?.toString() ?? '')}
          id="release-version-number-field"
          maxLength={TEXT_INPUT_MAX}
          fullWidth
          status={versionError ? 'error' : 'default'}
          statusText={versionError ? t('version-number-error') : ''}
        />
        {createReleaseResult.isError && (
          <InlineAlert status="error">
            {getApiError(createReleaseResult.error)[0]}
          </InlineAlert>
        )}
        <ButtonFooter>
          <Button
            disabled={userPosted || !releaseVersion || versionError}
            onClick={handleCreateRelease}
            id="release-button"
          >
            {t('release')}
          </Button>
          <Button
            disabled={userPosted}
            variant="secondary"
            onClick={handleClose}
            id="cancel-button"
          >
            {t('cancel-variant')}
          </Button>
          {userPosted && <SaveSpinner text={t('creating-release')} />}
        </ButtonFooter>
      </SimpleModalContent>
    </NarrowModal>
  );
}
