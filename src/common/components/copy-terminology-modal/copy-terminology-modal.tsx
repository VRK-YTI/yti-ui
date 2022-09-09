import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import { usePostCreateVersionMutation } from '../vocabulary/vocabulary.slice';
import { v4 } from 'uuid';
import { useStoreDispatch } from '@app/store';
import { terminologySearchApi } from '../terminology-search/terminology-search.slice';
import Prefix from '../terminology-components/prefix';
import { UpdateTerminology } from '@app/modules/new-terminology/update-terminology.interface';
import { setAlert } from '../alert/alert.slice';
import { useRouter } from 'next/router';

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
    if (createVersion.isSuccess && newGraphId) {
      handleClose();
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
      router.push(`/terminology/${newGraphId}`);
    }
  }, [createVersion, newGraphId, dispatch, handleClose, router, t]);

  const handlePost = () => {
    if (!newCode || error) {
      return;
    }
    setUserPosted(true);
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
        <Paragraph>
          <Text>{t('copy-as-base-description')}</Text>
        </Paragraph>
        <Prefix update={handleUpdate} userPosted={userPosted} />
      </ModalContent>

      <ModalFooter>
        <Button onClick={(e) => handlePost()}>{t('save')}</Button>
        <Button variant="secondary" onClick={() => handleClose()}>
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
