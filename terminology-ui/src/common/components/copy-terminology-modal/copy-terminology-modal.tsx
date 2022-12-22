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
import { usePostCreateVersionMutation } from '../vocabulary/vocabulary.slice';
import { v4 } from 'uuid';
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
}

export default function CopyTerminologyModal({
  terminologyId,
  visible,
  setVisible,
}: CopyTerminologyModalProps) {
  const { t } = useTranslation('admin');
  const dispatch = useStoreDispatch();
  const { isSmall } = useBreakpoints();
  const [randomURL] = useState(v4().substring(0, 8));
  const [userPosted, setUserPosted] = useState(false);
  const [newGraphId, setNewGraphId] = useState('');
  const [error, setError] = useState(false);
  const [postCreateVersion, createVersion] = usePostCreateVersionMutation();
  const [newCode, setNewCode] = useState(randomURL);
  const router = useRouter();

  const handleUpdate = ({ key, data }: UpdateTerminology) => {
    if (key === 'prefix') {
      setNewCode((data as [string, boolean])[0]);
      //second value is isValid
      setError(!(data as [string, boolean])[1]);
    }
  };

  const handleClose = useCallback(() => {
    setUserPosted(false);
    setVisible(false);
  }, [setVisible]);

  useEffect(() => {
    if (createVersion.isSuccess) {
      dispatch(terminologySearchApi.util.invalidateTags(['TerminologySearch']));
      dispatch(
        setAlert(
          [
            {
              note: {
                status: 0,
                data: '',
              },
              displayText: t('new-terminology-created'),
            },
          ],
          []
        )
      );

      if (newGraphId) {
        // Using this version of push() params instead of something like this:
        // router.push(`/terminology/${newGraphId}`);
        // Expander on the page wouldn't be closed by default so this
        // version is used to force page refresh.
        router.push({
          pathname: '/terminology/[tId]',
          query: { tId: newGraphId },
        });
        setVisible(false);
      }
    }
  }, [createVersion, newGraphId, dispatch, handleClose, router, t, setVisible]);

  const handlePost = () => {
    setUserPosted(true);
    if (!newCode || error) {
      return;
    }

    const graphId = terminologyId;
    postCreateVersion({ graphId, newCode })
      .unwrap()
      .then((data) => {
        setNewGraphId(data.newGraphId);
      });
  };

  return (
    <Modal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClose()}
      variant={!isSmall ? 'default' : 'smallScreen'}
    >
      <ModalContent>
        <ModalTitle>{t('copy-as-base')}</ModalTitle>
        <DescriptionParagraph>
          <Text>{t('copy-as-base-description')}</Text>
        </DescriptionParagraph>
        <Prefix update={handleUpdate} userPosted={userPosted} />
      </ModalContent>

      <ModalFooter>
        {userPosted && newCode === '' && (
          <InlineAlert status="warning">
            {t('alert-prefix-undefined')}
          </InlineAlert>
        )}
        <FooterBlock>
          <Button
            onClick={() => handlePost()}
            disabled={createVersion.isLoading}
          >
            {t('save')}
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel-variant')}
          </Button>
          {createVersion.isLoading && (
            <SaveSpinner text={t('copying-terminology')} />
          )}
        </FooterBlock>
      </ModalFooter>
    </Modal>
  );
}
