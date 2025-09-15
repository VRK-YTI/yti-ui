import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Text,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { useCreateVersionMutation } from '../vocabulary/vocabulary.slice';
import { useStoreDispatch } from '@app/store';
import { terminologySearchApi } from '../terminology-search/terminology-search.slice';
import Prefix from '../terminology-components/prefix';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { setAlert } from '../alert/alert.slice';
import { useRouter } from 'next/router';
import {
  DescriptionParagraph,
  FooterBlock,
} from './copy-terminology-modal.styles';
import SaveSpinner from 'yti-common-ui/save-spinner';

interface CopyTerminologyModalProps {
  terminologyId: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  unauthenticatedUser?: boolean;
}

export default function CopyTerminologyModal({
  terminologyId,
  visible,
  setVisible,
  unauthenticatedUser,
}: CopyTerminologyModalProps) {
  const { t } = useTranslation('admin');
  const dispatch = useStoreDispatch();
  const { isSmall } = useBreakpoints();
  const [userPosted, setUserPosted] = useState(false);
  const [error, setError] = useState(false);
  const [postCreateVersion, createVersion] = useCreateVersionMutation();
  const [newTerminologyId, setNewTerminologyId] = useState('');
  const router = useRouter();

  const handleUpdate = ({ key, data }: UpdateTerminology) => {
    if (key === 'prefix') {
      setNewTerminologyId((data as [string, boolean])[0]);
      //second value is isValid
      setError(!(data as [string, boolean])[1]);
    }
  };

  const handleFinish = () => {
    handleClose();
    router.push({
      pathname: '/terminology/[tId]',
      query: { tId: newTerminologyId },
    });
  };

  const handleClose = useCallback(() => {
    setUserPosted(false);
    setVisible(false);
  }, [setVisible]);

  useEffect(() => {
    if (createVersion.isSuccess) {
      dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));
    }
  }, [
    createVersion,
    dispatch,
    newTerminologyId,
    handleClose,
    router,
    t,
    setVisible,
  ]);

  const handlePost = () => {
    if (!newTerminologyId) {
      setError(true);
    } else if (!error) {
      setUserPosted(true);
      postCreateVersion({ prefix: terminologyId, newPrefix: newTerminologyId });
    }
  };

  function renderProcess() {
    return (
      <>
        <ModalContent>
          <ModalTitle>{t('copy-as-base')}</ModalTitle>

          {createVersion.isLoading && (
            <SaveSpinner text={t('copying-terminology')} />
          )}
          {createVersion.isError && (
            <InlineAlert status="error">
              {t('error-occured', { ns: 'alert' })}
            </InlineAlert>
          )}
          {createVersion.isSuccess && (
            <DescriptionParagraph>
              <Text>{t('done')}</Text>
            </DescriptionParagraph>
          )}
        </ModalContent>

        <ModalFooter>
          <FooterBlock>
            <Button
              onClick={() =>
                createVersion.isSuccess ? handleFinish() : handleClose()
              }
              disabled={createVersion.isLoading}
            >
              {t('close')}
            </Button>
          </FooterBlock>
        </ModalFooter>
      </>
    );
  }

  function renderModal() {
    return (
      <>
        <ModalContent>
          <ModalTitle>{t('copy-as-base')}</ModalTitle>
          <DescriptionParagraph>
            <Text>{t('copy-as-base-description')}</Text>
          </DescriptionParagraph>
          <Prefix
            update={handleUpdate}
            userPosted={false}
            disabled={unauthenticatedUser}
          />
        </ModalContent>

        <ModalFooter>
          {unauthenticatedUser && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-occurred_unauthenticated', { ns: 'alert' })}
            </InlineAlert>
          )}
          {error && newTerminologyId === '' && (
            <InlineAlert status="warning">
              {t('alert-prefix-undefined')}
            </InlineAlert>
          )}
          <FooterBlock>
            <Button
              onClick={() => handlePost()}
              disabled={createVersion.isLoading || unauthenticatedUser}
            >
              {t('save')}
            </Button>
            <Button variant="secondary" onClick={() => handleClose()}>
              {t('cancel-variant')}
            </Button>
          </FooterBlock>
        </ModalFooter>
      </>
    );
  }

  return (
    <Modal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClose()}
      variant={!isSmall ? 'default' : 'smallScreen'}
    >
      {!userPosted ? renderModal() : renderProcess()}
    </Modal>
  );
}
