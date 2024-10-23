import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  ButtonFooter,
  NarrowModal,
  SimpleModalContent,
} from '../as-file-modal/as-file-modal.styles';
import { Button, InlineAlert, ModalTitle, Text } from 'suomifi-ui-components';
import { useTranslation } from 'react-i18next';
import {
  resetSelected,
  useCopyModelMutation,
} from '@app/common/components/model/model.slice';
import { useEffect, useState } from 'react';
import Prefix from 'yti-common-ui/form/prefix';
import { MODEL_PREFIX_MAX } from 'yti-common-ui/utils/constants';
import { useGetModelExistsMutation } from '@app/common/components/prefix/prefix.slice';
import { useRouter } from 'next/router';
import SaveSpinner from 'yti-common-ui/save-spinner';
import getApiError from '@app/common/utils/get-api-errors';
import { useDispatch } from 'react-redux';
import { useStoreDispatch } from '@app/store';

interface CopyModalProps {
  modelId: string;
  modelVersion?: string;
  onClose?: () => void;
  visible: boolean;
  hide: () => void;
}

export default function CopyModal({
  modelId,
  modelVersion,
  visible,
  hide,
}: CopyModalProps) {
  const { isSmall } = useBreakpoints();
  const [prefix, setPrefix] = useState('');
  const [valid, setValid] = useState(true);
  const { t } = useTranslation('admin');
  const router = useRouter();
  const [userPosted, setUserPosted] = useState(false);
  const dispatch = useStoreDispatch();
  const [copyModel, copyModelResult] = useCopyModelMutation();

  const handleCopy = () => {
    setUserPosted(true);
    copyModel({ modelId, version: modelVersion, newPrefix: prefix });
  };

  const setNewPrefix = (p: string) => {
    setPrefix(p);
  };

  useEffect(() => {
    if (copyModelResult.isSuccess) {
      router.push(`/model/${prefix}?draft`);
      setUserPosted(false);
      dispatch(resetSelected());
      hide();
    }
  }, [copyModelResult]);

  return (
    <>
      <NarrowModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => hide()}
      >
        <SimpleModalContent>
          <ModalTitle>{t('copy-model-title')}</ModalTitle>

          <Text>{t('copy-model-info')}</Text>
          <Text>
            {modelVersion
              ? t('copy-model-info-version', { modelId, modelVersion })
              : t('copy-model-info-draft', { modelId })}
          </Text>

          <Prefix
            prefix={modelId}
            setPrefix={(p, valid) => {
              setValid(valid !== undefined ? valid : true);
              setNewPrefix(p);
            }}
            inUseMutation={useGetModelExistsMutation}
            typeInUri={'model'}
            error={false}
            translations={{
              errorInvalid: t('error-prefix-invalid'),
              errorTaken: t('error-prefix-taken'),
              hintText: '',
              label: t('copy-model-prefix-field-label'),
              textInputHint: t('input-prefix'),
              textInputLabel: t('copy-model-prefix-field-label'),
              uriPreview: t('uri-preview'),
            }}
            fullWidth
            minLength={2}
            maxLength={MODEL_PREFIX_MAX}
          />

          {copyModelResult.isError && (
            <InlineAlert status="error">
              {getApiError(copyModelResult.error)}
            </InlineAlert>
          )}

          <ButtonFooter>
            <Button
              disabled={!valid || prefix === modelId}
              onClick={handleCopy}
              id="create-copy"
            >
              {t('create-copy')}
            </Button>
            <Button onClick={hide} variant="secondary" id="close-button">
              {t('cancel')}
            </Button>
            {userPosted && <SaveSpinner text={t('copy-model-in-progress')} />}
          </ButtonFooter>
        </SimpleModalContent>
      </NarrowModal>
    </>
  );
}
