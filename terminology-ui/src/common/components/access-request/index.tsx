import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useStoreDispatch } from '../../../store';
import { OrganizationSearchResult } from '../../interfaces/terminology.interface';
import { setAlert } from '../alert/alert.slice';
import {
  useGetRequestsQuery,
  usePostRequestMutation,
} from './access-request.slice';
import {
  AccessRequestDescription,
  ModalButton,
  Title,
} from './access-request.styles';
import { AccessRequestModalProps } from './access-request-modal';
import { IconMessage } from 'suomifi-ui-components';

const AccessRequestModal = dynamic<AccessRequestModalProps>(() =>
  import('./access-request-modal').then((module) => module.default)
);

interface AccessRequestProps {
  organizations?: OrganizationSearchResult[];
}

export default function AccessRequest({ organizations }: AccessRequestProps) {
  const { t } = useTranslation('own-information');
  const {
    data: requests,
    error: requestsError,
    refetch,
  } = useGetRequestsQuery();
  const [postRequest, request] = usePostRequestMutation();
  const [visible, setVisible] = useState(false);

  const dispatch = useStoreDispatch();

  useEffect(() => {
    if (request.isSuccess) {
      dispatch(
        setAlert(
          [
            {
              note: { status: 0, data: '' },
              displayText: t('access-request-sent'),
            },
          ],
          []
        )
      );
      refetch();
      handleClose();
    } else if (request.isError) {
      dispatch(
        setAlert(
          [
            {
              note: request.error,
              displayText: t('error-occured_access-request', { ns: 'alert' }),
            },
          ],
          []
        )
      );
      refetch();
      handleClose();
    }
  }, [request, dispatch, refetch, t]);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Title>{t('access-request')}</Title>

      <AccessRequestDescription>
        {t('access-description')}
      </AccessRequestDescription>

      <ModalButton
        variant="secondary"
        icon={<IconMessage />}
        onClick={() => setVisible(true)}
        disabled={requestsError ? true : false}
        id="access-request-button"
      >
        {t('access-request-access')}
      </ModalButton>

      {visible && (
        <AccessRequestModal
          visible={visible}
          handleClose={handleClose}
          organizations={organizations}
          postRequest={postRequest}
          requests={requests}
        />
      )}
    </>
  );
}
