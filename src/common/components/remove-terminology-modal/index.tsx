import { useStoreDispatch } from '@app/store';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Button,
  InlineAlert,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { BasicBlock } from '../block';
import { BasicBlockExtraWrapper } from '../block/block.styles';
import SaveSpinner from '../save-spinner';
import Separator from '../separator';
import { terminologySearchApi } from '../terminology-search/terminology-search.slice';
import { useDeleteVocabularyMutation } from '../vocabulary/vocabulary.slice';
import {
  FooterBlock,
  RemoveModal,
  RemoveModalContent,
} from './remove-terminology-modal.syles';

interface RemoveTerminologyModalProps {
  terminologyId: string;
  terminologyName: string;
  disabled: boolean;
}

export default function RemoveTerminologyModal({
  terminologyId,
  terminologyName,
  disabled,
}: RemoveTerminologyModalProps) {
  const { t } = useTranslation('admin');
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [deleteVocabulary, data] = useDeleteVocabularyMutation();

  const handleClick = () => {
    deleteVocabulary(terminologyId);
  };

  const handleReturn = () => {
    router.push('/');
    dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));
  };

  return (
    <>
      <Separator isLarge />

      <BasicBlock
        title={t('remove-terminology')}
        extra={
          <BasicBlockExtraWrapper>
            <Button
              variant="secondary"
              icon="remove"
              onClick={() => setVisible(true)}
              disabled={disabled}
            >
              {t('remove-terminology')}
            </Button>
          </BasicBlockExtraWrapper>
        }
      >
        {t('remove-terminology-description')}
      </BasicBlock>

      <RemoveModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
      >
        {data.isUninitialized && renderConfirmation()}
        {data.isLoading && renderProcessing()}
        {(data.isSuccess || data.isError) && renderFinished()}
      </RemoveModal>
    </>
  );

  function renderConfirmation() {
    return (
      <>
        <RemoveModalContent>
          <ModalTitle>{t('remove-terminology')}</ModalTitle>
          <Paragraph>
            <Text>
              {t('remove-terminology-confirmation', {
                terminologyName: terminologyName,
              })}
            </Text>
          </Paragraph>
        </RemoveModalContent>
        <FooterBlock>
          <Button onClick={() => handleClick()} disabled={data.isLoading}>
            {t('remove')}
          </Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            {t('cancel')}
          </Button>
        </FooterBlock>
      </>
    );
  }

  function renderProcessing() {
    return (
      <>
        <RemoveModalContent>
          <ModalTitle>{t('remove-terminology')}</ModalTitle>
          <SaveSpinner text={t('remove-terminology-processing')} />
        </RemoveModalContent>
      </>
    );
  }

  function renderFinished() {
    return (
      <>
        <RemoveModalContent>
          <ModalTitle>{t('remove-terminology')}</ModalTitle>
          <Paragraph>
            {data.isSuccess ? (
              <Text>
                {t('remove-terminology-removed', {
                  terminologyName: terminologyName,
                })}
              </Text>
            ) : (
              <InlineAlert status="error">
                {t('error-occurred_remove-terminology', { ns: 'alert' })}
              </InlineAlert>
            )}
          </Paragraph>
        </RemoveModalContent>
        <FooterBlock>
          {data.isSuccess ? (
            <Button onClick={() => handleReturn()}>
              {t('return-to-front-page')}
            </Button>
          ) : (
            <Button onClick={() => handleClick()}>{t('try-again')}</Button>
          )}
        </FooterBlock>
      </>
    );
  }
}
