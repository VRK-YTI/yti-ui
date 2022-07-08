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

const AccessRequestModal = dynamic(() => import('./access-request-modal'));

interface AccessRequestProps {
  organizations?: OrganizationSearchResult[];
}

export default function AccessRequest({ organizations }: AccessRequestProps) {
  const { t } = useTranslation('own-information');
  const {
    data: requests,
    error: requestsError,
    refetch,
  } = useGetRequestsQuery(null);
  const [postRequest, request] = usePostRequestMutation();
  const [visible, setVisible] = useState(false);

  const dispatch = useStoreDispatch();

  useEffect(() => {
    if (request.isSuccess) {
      dispatch(
        setAlert(
          [
            {
              error: { status: 0, data: '' },
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
        setAlert([{ error: request.error, displayText: '_access-request' }], [])
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
        icon="message"
        onClick={() => setVisible(true)}
        disabled={requestsError ? true : false}
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
