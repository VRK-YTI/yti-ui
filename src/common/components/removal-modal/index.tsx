import { Collection } from '@app/common/interfaces/collection.interface';
import { Concept } from '@app/common/interfaces/concept.interface';
import {
  translateRemovalModalConfirmation,
  translateRemovalModalDescription,
  translateRemovalModalError,
  translateRemovalModalProcessing,
  translateRemovalModalRemoved,
  translateRemovalModalTitle,
  translateRemovalModalWarning,
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
import { useBreakpoints } from '../media-query/media-query-context';
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
  isDisabled: boolean;
  nonDescriptive?: boolean;
  removalData:
    | {
        type: 'terminology';
      }
    | {
        type: 'concept';
        data?: Concept;
      }
    | {
        type: 'collection';
        data?: Collection;
      };
  targetId: string;
  targetName: string;
}

export default function RemovalModal({
  isDisabled,
  nonDescriptive,
  removalData,
  targetId,
  targetName,
}: RemovalModalProps) {
  const { t } = useTranslation('admin');
  const dispatch = useStoreDispatch();
  const { isSmall } = useBreakpoints();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [deleteVocabulary, terminology] = useDeleteVocabularyMutation();
  const [deleteTarget, target] = useDeleteTargetMutation();

  const handleClick = () => {
    if (removalData.type === 'terminology') {
      deleteVocabulary(targetId);
    }

    if (removalData.type === 'concept' && removalData.data) {
      const data = generateConceptData(removalData.data);

      if (data.length < 2) {
        return null;
      }

      deleteTarget(data);
    }

    if (removalData.type === 'collection' && removalData.data) {
      const data = generateCollectionData(removalData.data);

      if (data.length < 1) {
        return null;
      }

      deleteTarget(data);
    }
  };

  const handleReturn = () => {
    if (removalData.type === 'terminology') {
      router.push('/');
      dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));
      return;
    }

    if (removalData.data) {
      router.push(`/terminology/${removalData.data.type.graph.id}`);
      return;
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
      {!nonDescriptive ? (
        <BasicBlock
          title={translateRemovalModalTitle(removalData.type, t)}
          extra={
            <BasicBlockExtraWrapper>
              <Button
                variant="secondary"
                icon="remove"
                id={`open-remove-${removalData.type}-modal`}
                onClick={() => setVisible(true)}
                disabled={isDisabled}
              >
                {translateRemovalModalTitle(removalData.type, t)}
              </Button>
              {isDisabled && removalData.type === 'terminology' && (
                <Paragraph style={{ marginTop: '10px' }}>
                  <Text smallScreen variant="bold">
                    {t('remove-modal.remove-disabled')}
                  </Text>
                </Paragraph>
              )}
            </BasicBlockExtraWrapper>
          }
        >
          {translateRemovalModalDescription(removalData.type, t)}
        </BasicBlock>
      ) : (
        <>
          <Button
            variant="secondary"
            icon="remove"
            id={`open-remove-${removalData.type}-modal`}
            onClick={() => setVisible(true)}
            disabled={isDisabled}
          >
            {translateRemovalModalTitle(removalData.type, t)}
          </Button>
          {isDisabled && removalData.type === 'terminology' && (
            <Paragraph style={{ marginTop: '10px' }}>
              <Text smallScreen variant="bold">
                {t('remove-modal.remove-disabled')}
              </Text>
            </Paragraph>
          )}
        </>
      )}

      <RemoveModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => !isSuccess() && setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <RemoveModalContent>
          <ModalTitle>
            {translateRemovalModalTitle(removalData.type, t)}
          </ModalTitle>
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
          <Text>
            {translateRemovalModalConfirmation(removalData.type, targetName, t)}
          </Text>
        </Paragraph>
        <Paragraph>
          <Text>{translateRemovalModalWarning(removalData.type, t)}</Text>
        </Paragraph>
      </>
    );
  }

  function renderProcessing() {
    if (!isLoading()) {
      return null;
    }

    return (
      <SaveSpinner
        text={translateRemovalModalProcessing(removalData.type, t)}
      />
    );
  }

  function renderFinished() {
    if (isSuccess()) {
      return (
        <>
          <Paragraph>
            <Text>
              {translateRemovalModalRemoved(removalData.type, targetName, t)}
            </Text>
          </Paragraph>
        </>
      );
    }

    if (isError()) {
      return (
        <InlineAlert status="error">
          {translateRemovalModalError(removalData.type, t)}
        </InlineAlert>
      );
    }

    return null;
  }

  function renderFooter() {
    if (isUninitialized()) {
      return (
        <>
          <Button onClick={() => handleClick()}>{t('remove')}</Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            {t('cancel-variant')}
          </Button>
        </>
      );
    }

    if (isSuccess()) {
      return (
        <>
          <Button onClick={() => handleReturn()}>
            {removalData.type === 'terminology'
              ? t('return-to-front-page')
              : t('return-to-terminology-page')}
          </Button>
        </>
      );
    }

    if (isError()) {
      return (
        <>
          <Button onClick={() => handleClick()}>{t('try-again')}</Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            {t('cancel-variant')}
          </Button>
        </>
      );
    }

    return null;
  }
}
