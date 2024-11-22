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
  useCreateDraftMutation,
  useGetModelQuery,
} from '@app/common/components/model/model.slice';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SaveSpinner from 'yti-common-ui/save-spinner';
import getApiError from '@app/common/utils/get-api-errors';
import { useStoreDispatch } from '@app/store';
import { AxiosBaseQueryError } from 'yti-common-ui/interfaces/axios-base-query.interface';

interface CreateDraftModalProps {
  modelId: string;
  modelVersion: string;
  label: string;
  onClose?: () => void;
  visible: boolean;
  hide: () => void;
}

export default function CreateDraftModal({
  modelId,
  modelVersion,
  label,
  visible,
  hide,
}: CreateDraftModalProps) {
  const { isSmall } = useBreakpoints();
  const { t } = useTranslation('admin');
  const router = useRouter();
  const [userPosted, setUserPosted] = useState(false);
  const [createEnabled, setCreateEnabled] = useState(false);
  const dispatch = useStoreDispatch();
  const [createDraft, createDraftResult] = useCreateDraftMutation();
  const { isLoading, error } = useGetModelQuery(
    {
      modelId: modelId,
      draft: true,
    },
    { skip: !visible }
  );

  const handleCreateNewDraft = () => {
    setUserPosted(true);
    createDraft({ modelId: modelId, version: modelVersion });
  };

  useEffect(() => {
    if (createDraftResult.isSuccess) {
      router.push(`/model/${modelId}?draft`);
      setUserPosted(false);
      dispatch(resetSelected());
      hide();
    }
  }, [createDraftResult]);

  useEffect(() => {
    if (error) {
      setCreateEnabled((error as AxiosBaseQueryError).status === 404);
    }
  }, [error]);

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <NarrowModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => hide()}
      >
        <SimpleModalContent>
          <ModalTitle>{t('create-draft-title')}</ModalTitle>

          <Text>
            {createEnabled
              ? t('create-draft-info', { label: label, version: modelVersion })
              : t('create-draft-existing')}
          </Text>

          {createDraftResult.isError && (
            <InlineAlert status="error">
              {getApiError(createDraftResult.error)}
            </InlineAlert>
          )}

          <ButtonFooter>
            <Button
              disabled={userPosted || !createEnabled}
              onClick={handleCreateNewDraft}
              id="create-draft"
            >
              {t('continue')}
            </Button>
            <Button onClick={hide} variant="secondary" id="close-button">
              {t('cancel')}
            </Button>
            {userPosted && <SaveSpinner text={t('craete-draft-in-progress')} />}
          </ButtonFooter>
        </SimpleModalContent>
      </NarrowModal>
    </>
  );
}
