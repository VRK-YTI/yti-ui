import { useTranslation } from 'next-i18next';
import { useStoreDispatch } from '@app/store';
import { createTheme, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  selectModal,
  setConfirmModalState,
  setFormModalState
} from '@app/common/components/actionmenu/actionmenu.slice';
import {
  useDeleteCrosswalkMutation, useGetCrosswalkWithRevisionsQuery,
  usePatchCrosswalkMutation
} from '@app/common/components/crosswalk/crosswalk.slice';
import HasPermission from '@app/common/utils/has-permission';
import { useEffect } from 'react';
import { updateActionMenu } from '@app/common/components/schema-and-crosswalk-actionmenu/update-action-menu';
import { Type } from '@app/common/interfaces/search.interface';
import { State } from '@app/common/interfaces/state.interface';
import { setIsEditContentActive } from '@app/common/components/content-view/content-view.slice';
import { NotificationKeys } from '@app/common/interfaces/notifications.interface';
import { mscrSearchApi } from '@app/common/components/mscr-search/mscr-search.slice';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import { Text } from 'suomifi-ui-components';
import Tabmenu from '@app/common/components/tabmenu';
import MetadataStub from '@app/modules/form/metadata-form/metadata-stub';
import MetadataAndFiles from '@app/modules/crosswalk-editor/tabs/metadata-and-files';
import * as React from 'react';
import VersionHistory from '@app/common/components/version-history';
import ConfirmModal from '@app/common/components/confirmation-modal';
import FormModal, { ModalType } from '@app/modules/form';
import { Format } from '@app/common/interfaces/format.interface';
import CrosswalkEditor from '@app/modules/crosswalk-editor';

export default function CrosswalkView({ crosswalkId }: { crosswalkId: string }) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const confirmModalIsOpen = useSelector(selectModal()).confirm;
  const formModalIsOpen = useSelector(selectModal()).form;
  const [patchCrosswalk] = usePatchCrosswalkMutation();
  const [deleteCrosswalk] = useDeleteCrosswalkMutation();

  const {
    data: crosswalkData,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetCrosswalkWithRevisionsQuery(crosswalkId);

  const hasEditPermission = HasPermission({
    action: 'EDIT_CONTENT',
    owner: crosswalkData?.owner,
  });

  useEffect(() => {
    updateActionMenu(dispatch, Type.Crosswalk, crosswalkData, hasEditPermission);
  }, [dispatch, crosswalkData, hasEditPermission]);

  interface StatePayload {
    versionLabel?: string;
    state?: State;
  }
  const payloadBase: StatePayload = {
    versionLabel: crosswalkData?.versionLabel,
  };

  const publishCrosswalk = () => {
    const publishPayload = {...payloadBase, state: State.Published};
    dispatch(setIsEditContentActive(false));
    changeCrosswalkState(publishPayload, 'CROSSWALK_PUBLISH');
  };

  const deprecateCrosswalk = () => {
    const deprecatePayload = {...payloadBase, state: State.Deprecated};
    changeCrosswalkState(deprecatePayload, 'CROSSWALK_DEPRECATE');
  };

  const invalidateCrosswalk = () => {
    const invalidatePayload = {...payloadBase, state: State.Invalid};
    changeCrosswalkState(invalidatePayload, 'CROSSWALK_INVALIDATE');
  };

  const removeCrosswalk = () => {
    const removePayload = {...payloadBase, state: State.Removed};
    changeCrosswalkState(removePayload, 'CROSSWALK_DELETE');
  };

  const changeCrosswalkState = (payload: StatePayload, notificationKey: NotificationKeys) => {
    if (!crosswalkData) return;
    patchCrosswalk({ payload: payload, pid: crosswalkData.pid })
      .unwrap()
      .then(() => {
        dispatch(
          mscrSearchApi.util.invalidateTags([
            'PersonalContent',
            'OrgContent',
            'MscrSearch',
          ])
        );
        dispatch(setNotification(notificationKey));
      });
  };

  const deleteCrosswalkDraft = () => {
    if (!crosswalkData) return;
    deleteCrosswalk(crosswalkData.pid)
      .unwrap()
      .then(() => {
        dispatch(
          mscrSearchApi.util.invalidateTags([
            'MscrSearch',
            'OrgContent',
            'PersonalContent',
          ])
        );
        dispatch(setNotification('CROSSWALK_DELETE'));
      });
    // ToDo: handle an exception
  };

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Source Sans Pro',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ].join(','),
    },
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else if (isError) {
    if ('status' in error && error.status === 404) {
      return <Text>{t('error.not-found')}</Text>;
    }
  } else if (isSuccess) {
    return (
      <ThemeProvider theme={theme}>
        {crosswalkData.state === State.Removed ? ( // Return stub if crosswalk is removed
          <Tabmenu
            contentType={Type.Crosswalk}
            isRemoved={true}
            tabPanels={[
              {
                tabIndex: 0,
                tabText: 'metadata-and-files-tab',
                content: (
                  <MetadataStub metadata={crosswalkData} type={Type.Crosswalk} />
                )
              }
            ]}
          />
        ) : (
          <Tabmenu
            contentType={Type.Crosswalk}
            tabPanels={[
              {
                tabIndex: 0,
                tabText: 'metadata-and-files-tab',
                content: (
                  <MetadataAndFiles
                    crosswalkData={crosswalkData}
                    refetch={refetch}
                  />
                )
              },
              {
                tabIndex: 1,
                tabText: 'content-and-editor-tab',
                content: (
                  <CrosswalkEditor crosswalkId={crosswalkId} crosswalkData={crosswalkData} hasEditPermission={hasEditPermission} />
                )
              },
              {
                tabIndex: 2,
                tabText: 'history-tab',
                content: (
                  <VersionHistory
                    revisions={crosswalkData.revisions}
                    contentType={Type.Crosswalk}
                    currentRevision={crosswalkId}
                  />
                )
              }
            ]}
          />
        )}
        {confirmModalIsOpen.deleteDraft && (
          <ConfirmModal
            actionText={t('actionmenu.delete-crosswalk')}
            cancelText={t('action.cancel')}
            confirmAction={deleteCrosswalkDraft}
            onClose={() => dispatch(setConfirmModalState({key: 'deleteDraft', value: false}))}
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.delete-draft')}
            text2={t('confirm-modal.delete-draft-info')}
          />
        )}
        {confirmModalIsOpen.remove && (
          <ConfirmModal
            actionText={t('actionmenu.delete-crosswalk')}
            cancelText={t('action.cancel')}
            confirmAction={removeCrosswalk}
            onClose={() => dispatch(setConfirmModalState({key: 'remove', value: false}))}
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.delete-crosswalk')}
            text2={t('confirm-modal.delete-info')}
          />
        )}
        {confirmModalIsOpen.publish && (
          <ConfirmModal
            actionText={t('action.publish')}
            cancelText={t('action.cancel')}
            confirmAction={publishCrosswalk}
            onClose={() => dispatch(setConfirmModalState({key: 'publish', value: false}))}
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.publish-crosswalk1')}
            text2={t('confirm-modal.publish-crosswalk2')}
          />
        )}
        {confirmModalIsOpen.invalidate && (
          <ConfirmModal
            actionText={t('action.invalidate')}
            cancelText={t('action.cancel')}
            confirmAction={invalidateCrosswalk}
            onClose={() => dispatch(setConfirmModalState({key: 'invalidate', value: false}))}
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.invalidate-crosswalk')}
          />
        )}
        {confirmModalIsOpen.deprecate && (
          <ConfirmModal
            actionText={t('action.deprecate')}
            cancelText={t('action.cancel')}
            confirmAction={deprecateCrosswalk}
            onClose={() => dispatch(setConfirmModalState({key: 'deprecate', value: false}))}
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.deprecate-crosswalk')}
          />
        )}
        <FormModal
          modalType={
            crosswalkData?.format === Format.Mscr
              ? ModalType.RevisionMscr
              : ModalType.RevisionFull
          }
          contentType={Type.Crosswalk}
          visible={formModalIsOpen.version}
          setVisible={(value) => dispatch(setFormModalState({key: 'version', value: value}))}
          initialData={crosswalkData}
        />
      </ThemeProvider>
    );
  }

  // TODO: What to return if data fetching doesn't work?
  return <Text>{t('error.not-found')}</Text>;
}
