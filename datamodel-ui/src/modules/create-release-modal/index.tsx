import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  ButtonFooter,
  NarrowModal,
  SimpleModalContent,
} from '../as-file-modal/as-file-modal.styles';
import {
  Button,
  Heading,
  InlineAlert,
  ModalTitle,
  RadioButton,
  RadioButtonGroup,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { useCallback, useEffect, useState } from 'react';
import SaveSpinner from 'yti-common-ui/save-spinner';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';
import {
  useCreateReleaseMutation,
  useGetValidationErrorsQuery,
} from '@app/common/components/model/model.slice';
import { useRouter } from 'next/router';
import getApiError from '@app/common/utils/get-api-errors';
import UriInfo from '@app/common/components/uri-info';
import { ReleaseValidationErrors } from './release-model-styles';
import { translateValidationError } from '@app/common/utils/translation-helpers';

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
  const { t, i18n } = useTranslation('admin');
  const router = useRouter();
  const [releaseStatus, setReleaseStatus] = useState('VALID');
  const [releaseVersion, setReleaseVersion] = useState('');
  const [userPosted, setUserPosted] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [createRelease, createReleaseResult] = useCreateReleaseMutation();
  const { data: validationErrors } = useGetValidationErrorsQuery(
    { modelId },
    { skip: !visible }
  );
  const [skipValidationErrors, setSkipValidationErrors] = useState(false);

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
    createReleaseResult.reset();
    hide();
    setSkipValidationErrors(false);
  }, [hide, createReleaseResult]);

  const handleContinue = () => {
    setSkipValidationErrors(true);
  };

  useEffect(() => {
    if (!userPosted) {
      return;
    }
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
  }, [
    userPosted,
    createReleaseResult,
    handleClose,
    router,
    modelId,
    releaseVersion,
  ]);

  if (!validationErrors) {
    return <></>;
  }

  return (
    <NarrowModal
      appElementId="__next"
      visible={visible}
      variant={isSmall ? 'smallScreen' : 'default'}
      onEscKeyDown={() => handleClose()}
    >
      {!skipValidationErrors &&
      validationErrors &&
      Object.keys(validationErrors).length > 0 ? (
        <SimpleModalContent>
          <ModalTitle>{t('validation-errors-title')}</ModalTitle>

          <Text>{t('release-errors-general-info')}</Text>

          {Object.entries(validationErrors).map(([key, resources]) => {
            return (
              <ReleaseValidationErrors key={key}>
                <Heading variant="h4">
                  {translateValidationError(key, t)}
                </Heading>
                <Text>{translateValidationError(`${key}-info`, t)}</Text>
                <ul>
                  {resources.map((uri) => (
                    <li key={uri.uri}>
                      <UriInfo uri={uri} lang={i18n.language} />
                    </li>
                  ))}
                </ul>
              </ReleaseValidationErrors>
            );
          })}
          <ButtonFooter>
            <Button id="skip-errors-continue-button" onClick={handleContinue}>
              {t('continue')}
            </Button>
            <Button
              id="skip-errors-cancel-button"
              variant="secondary"
              onClick={handleClose}
            >
              {t('cancel')}
            </Button>
          </ButtonFooter>
        </SimpleModalContent>
      ) : (
        <SimpleModalContent>
          <ModalTitle>{t('create-release')}</ModalTitle>
          <RadioButtonGroup
            name="create-release-status"
            labelText={t('create-release-status')}
            onChange={(e) => setReleaseStatus(e)}
            id="create-release-status-field"
            defaultValue="VALID"
          >
            <RadioButton value="VALID">
              {translateStatus('VALID', t)}
            </RadioButton>
            <RadioButton value="SUGGESTED">
              {`${translateStatus('SUGGESTED', t)} (${t(
                'commentable-version'
              )})`}
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
      )}
    </NarrowModal>
  );
}
