import { translateRemovalModalConfirmation, translateRemovalModalDescription, translateRemovalModalProcessing, translateRemovalModalRemoved, translateRemovalModalTitle } from '@app/common/utils/translation-helpers';
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
import { useDeleteConceptMutation } from '../remove/remove.slice';
import SaveSpinner from '../save-spinner';
import { terminologySearchApi } from '../terminology-search/terminology-search.slice';
import { useDeleteVocabularyMutation } from '../vocabulary/vocabulary.slice';
import {
  FooterBlock,
  RemoveModal,
  RemoveModalContent,
} from './removal-modal.styles';

interface RemovalModalProps {
  targetId: string;
  targetName: string;
  type: 'terminology' | 'concept' | 'collection';
}

export default function RemovalModal({ targetId, targetName, type }: RemovalModalProps) {
  const { t } = useTranslation('admin');
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [deleteVocabulary, terminology] = useDeleteVocabularyMutation();
  const [deleteConcept, concept] = useDeleteConceptMutation();

  const handleClick = () => {
    if (type === 'terminology') {
      deleteVocabulary(targetId);
    }

    if (type === 'concept') {
      deleteConcept(null);
    }
  };

  const handleReturn = () => {
    if (type === 'terminology') {
      router.push('/');
      dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));
    }
  };

  const isUninitialized = () => {
    return terminology.isUninitialized && concept.isUninitialized;
  };

  const isLoading = () => {
    return terminology.isLoading || concept.isLoading;
  };

  const isSuccess = () => {
    return terminology.isSuccess || concept.isSuccess;
  };

  const isError = () => {
    return terminology.isError || concept.isError;
  };

  return (
    <>
      <BasicBlock
        title={translateRemovalModalTitle(type, t)}
        extra={
          <BasicBlockExtraWrapper>
            <Button
              variant="secondary"
              icon="remove"
              id={`open-remove-${type}-modal`}
              onClick={() => setVisible(true)}
            >
              {translateRemovalModalTitle(type, t)}
            </Button>
          </BasicBlockExtraWrapper>
        }
      >
        {translateRemovalModalDescription(type, t)}
      </BasicBlock>

      <RemoveModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
      >
        <RemoveModalContent>
          <ModalTitle>{translateRemovalModalTitle(type, t)}</ModalTitle>
          {renderConfirmation()}
          {renderProcessing()}
          {renderFinished()}
        </RemoveModalContent>
        <FooterBlock>{renderFooter()}</FooterBlock>
      </RemoveModal>
    </>
  );

  function renderConfirmation() {
    if (!isUninitialized()) {
      return null;
    }

    return (
      <>
        <Paragraph>
          <Text>{translateRemovalModalConfirmation(type, targetName, t)}</Text>
        </Paragraph>
      </>
    );
  }

  function renderProcessing() {
    if (!isLoading()) {
      return null;
    }

    return <SaveSpinner text={translateRemovalModalProcessing(type, t)} />;
  }

  function renderFinished() {
    if (isSuccess()) {
      return (
        <>
          <Paragraph>
            <Text>{translateRemovalModalRemoved(type, targetName, t)}</Text>
          </Paragraph>
        </>
      );
    }

    if (isError()) {
      return <InlineAlert status="error">Virhe</InlineAlert>;
    }

    return null;
  }

  function renderFooter() {
    if (isUninitialized()) {
      return (
        <>
          <Button onClick={() => handleClick()}>{t('remove')}</Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            {t('cancel')}
          </Button>
        </>
      );
    }

    if (isSuccess()) {
      return (
        <>
          <Button onClick={() => handleReturn()}>{t('remove')}</Button>
        </>
      );
    }

    if (isError()) {
      return (
        <>
          <Button onClick={() => handleClick()}>{t('try-again')}</Button>
        </>
      );
    }

    return null;
  }
}
