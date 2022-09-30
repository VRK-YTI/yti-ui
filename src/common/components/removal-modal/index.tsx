import { Collection } from '@app/common/interfaces/collection.interface';
import { Concept } from '@app/common/interfaces/concept.interface';
import {
  translateRemovalModalConfirmation,
  translateRemovalModalDescription,
  translateRemovalModalProcessing,
  translateRemovalModalRemoved,
  translateRemovalModalTitle,
} from '@app/common/utils/translation-helpers';
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
import { useDeleteTargetMutation } from '../remove/remove.slice';
import SaveSpinner from '../save-spinner';
import { terminologySearchApi } from '../terminology-search/terminology-search.slice';
import { useDeleteVocabularyMutation } from '../vocabulary/vocabulary.slice';
import {
  generateCollectionData,
  generateConceptData,
} from './generate-removal-data';
import {
  FooterBlock,
  RemoveModal,
  RemoveModalContent,
} from './removal-modal.styles';

interface RemovalModalProps {
  removalData?: Concept | Collection;
  targetId: string;
  targetName: string;
  type: 'terminology' | 'concept' | 'collection';
}

export default function RemovalModal({
  removalData,
  targetId,
  targetName,
  type,
}: RemovalModalProps) {
  const { t } = useTranslation('admin');
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [deleteVocabulary, terminology] = useDeleteVocabularyMutation();
  const [deleteTarget, target] = useDeleteTargetMutation();

  const handleClick = () => {
    if (type === 'terminology') {
      deleteVocabulary(targetId);
    }

    if (
      type === 'concept' &&
      removalData &&
      'references.prefLabelXl' in removalData
    ) {
      const data = generateConceptData(removalData);

      if (data.length < 2) {
        return null;
      }

      deleteTarget(data);
    }

    if (
      type === 'collection' &&
      removalData &&
      'properties.prefLabel' in removalData
    ) {
      const data = generateCollectionData(removalData);

      if (data.length < 1) {
        return null;
      }

      deleteTarget(data);
    }
  };

  const handleReturn = () => {
    if (type === 'terminology') {
      router.push('/');
      dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));
    }

    if (removalData) {
      router.push(`/terminology/${removalData.type.graph.id}`);
    }
  };

  const isUninitialized = () => {
    return terminology.isUninitialized && target.isUninitialized;
  };

  const isLoading = () => {
    return terminology.isLoading || target.isLoading;
  };

  const isSuccess = () => {
    return terminology.isSuccess || target.isSuccess;
  };

  const isError = () => {
    return terminology.isError || target.isError;
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
