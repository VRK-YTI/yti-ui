import {
  translateErrroMessage,
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
  IconRemove,
  InlineAlert,
  ModalTitle,
  Notification,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { BasicBlock, BasicBlockExtraWrapper } from 'yti-common-ui/block';
import { ApiError } from 'yti-common-ui/interfaces/error.interface';
import { useBreakpoints } from 'yti-common-ui/media-query';
import SaveSpinner from 'yti-common-ui/save-spinner';
import { terminologySearchApi } from '../terminology-search/terminology-search.slice';
import {
  FooterBlock,
  RemoveModal,
  RemoveModalContent,
} from './removal-modal.styles';
import { useGetAuthenticatedUserMutMutation } from '../login/login.slice';
import { useDeleteConceptMutation } from '../concept/concept.slice';
import { useDeleteCollectionMutation } from '../collection/collection.slice';
import { useDeleteTerminologyMutation } from '../vocabulary/vocabulary.slice';

interface RemovalModalProps {
  nonDescriptive?: boolean;
  dataType: 'terminology' | 'concept' | 'collection';
  status?: string;
  targetPrefix?: string;
  targetId: string;
  targetName: string;
}

export default function RemovalModal({
  nonDescriptive,
  dataType,
  status,
  targetId,
  targetName,
  targetPrefix,
}: RemovalModalProps) {
  const { t } = useTranslation('admin');
  const dispatch = useStoreDispatch();
  const { isSmall, isMedium } = useBreakpoints();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const [deleteTerminology, terminology] = useDeleteTerminologyMutation();
  const [deleteConcept, concept] = useDeleteConceptMutation();
  const [deleteCollection, collection] = useDeleteCollectionMutation();
  const [getAuthenticatedUser, authenticatedUser] =
    useGetAuthenticatedUserMutMutation();

  const handleClick = () => {
    if (dataType === 'terminology') {
      deleteTerminology(targetId);
    }

    if (dataType === 'concept' && targetPrefix) {
      deleteConcept({ prefix: targetPrefix, conceptId: targetId });
    }

    if (dataType === 'collection' && targetPrefix) {
      deleteCollection({ prefix: targetPrefix, collectionId: targetId });
    }
  };

  const handleReturn = () => {
    if (dataType === 'terminology') {
      router.push('/');
      dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));
      return;
    }

    if (targetPrefix) {
      router.push(`/terminology/${targetPrefix}`);
      return;
    }
  };

  const handleVisibility = () => {
    if (dataType === 'terminology' && status === 'VALID') {
      setShowError(true);
      return;
    }

    setVisible(true);
    getAuthenticatedUser();
  };

  const isUninitialized = () => {
    return (
      terminology.isUninitialized &&
      concept.isUninitialized &&
      collection.isUninitialized
    );
  };

  const isLoading = () => {
    return terminology.isLoading || concept.isLoading || collection.isLoading;
  };

  const isSuccess = () => {
    return terminology.isSuccess || concept.isSuccess || collection.isSuccess;
  };

  const isError = () => {
    return terminology.isError || concept.isError || collection.isError;
  };

  return (
    <>
      {!nonDescriptive ? (
        <BasicBlock
          title={translateRemovalModalTitle(dataType, t)}
          extra={
            <BasicBlockExtraWrapper>
              <Button
                variant="secondary"
                icon={<IconRemove />}
                id={`open-remove-${dataType}-modal`}
                onClick={() => handleVisibility()}
              >
                {translateRemovalModalTitle(dataType, t)}
              </Button>
            </BasicBlockExtraWrapper>
          }
        >
          {translateRemovalModalDescription(dataType, t)}
        </BasicBlock>
      ) : (
        <>
          <Button
            variant="secondary"
            icon={<IconRemove />}
            id={`open-remove-${dataType}-modal`}
            onClick={() => handleVisibility()}
          >
            {translateRemovalModalTitle(dataType, t)}
          </Button>
        </>
      )}

      {showError && (
        <div
          style={{ width: isSmall || isMedium ? '100%' : 'calc(100% * 1.5)' }}
        >
          <Notification
            closeText={t('close')}
            status="error"
            headingText={t('remove-modal.remove-disabled-title')}
            onCloseButtonClick={() => setShowError(false)}
            smallScreen={isSmall}
          >
            {t('remove-modal.remove-disabled')}
          </Notification>
        </div>
      )}

      <RemoveModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => !isSuccess() && setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <RemoveModalContent>
          <ModalTitle>{translateRemovalModalTitle(dataType, t)}</ModalTitle>
          {renderConfirmation()}
          {renderProcessing()}
          {renderFinished()}
          {authenticatedUser.data?.anonymous && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-occurred_unauthenticated', { ns: 'alert' })}
            </InlineAlert>
          )}
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
            {translateRemovalModalConfirmation(dataType, targetName, t)}
          </Text>
        </Paragraph>
        <Paragraph>
          <Text>{translateRemovalModalWarning(dataType, t)}</Text>
        </Paragraph>
      </>
    );
  }

  function renderProcessing() {
    if (!isLoading()) {
      return null;
    }

    return <SaveSpinner text={translateRemovalModalProcessing(dataType, t)} />;
  }

  function renderFinished() {
    if (isSuccess()) {
      return (
        <>
          <Paragraph>
            <Text>{translateRemovalModalRemoved(dataType, targetName, t)}</Text>
          </Paragraph>
        </>
      );
    }

    if (isError()) {
      //es-lint no-unsafe-optional-chaining
      if (concept?.error) {
        /*const data = concept.error.data as ApiError;
        return (
          <InlineAlert status="error">
            {translateErrroMessage(data.message, t)}
            {data.details && (
              <div>
                {data.details?.split(',').map((d) => {
                  return (
                    <>
                      {d} <br />
                    </>
                  );
                })}
              </div>
            )}
          </InlineAlert>
        );*/
      }

      return (
        <InlineAlert status="error">
          {translateRemovalModalError(dataType, t)}
        </InlineAlert>
      );
    }

    return null;
  }

  function renderFooter() {
    if (isUninitialized()) {
      return (
        <>
          <Button
            onClick={() => handleClick()}
            disabled={authenticatedUser.data?.anonymous}
          >
            {t('remove')}
          </Button>
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
            {dataType === 'terminology'
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
