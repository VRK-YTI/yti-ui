import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import {
  useDeleteSchemaMutation,
  useGetSchemaWithRevisionsQuery,
  usePatchSchemaMutation,
} from '@app/common/components/schema/schema.slice';
import MetadataAndFiles from './metadata-and-files';
import { createTheme, ThemeProvider } from '@mui/material';
import VersionHistory from 'src/common/components/version-history';
import SchemaVisualization from '@app/modules/schema-view/schema-visualization';
import { State } from '@app/common/interfaces/state.interface';
import { Type } from '@app/common/interfaces/search.interface';
import { Text } from 'suomifi-ui-components';
import HasPermission from '@app/common/utils/has-permission';
import { Format, formatsAvailableForMscrCopy } from '@app/common/interfaces/format.interface';
import { useStoreDispatch } from '@app/store';
import {
  selectConfirmModalState,
  selectFormModalState,
  setConfirmModalState,
  setFormModalState,
} from '@app/common/components/actionmenu/actionmenu.slice';
import { useSelector } from 'react-redux';
import { updateActionMenu } from '@app/common/components/schema-and-crosswalk-actionmenu/update-action-menu';
import { mscrSearchApi } from '@app/common/components/mscr-search/mscr-search.slice';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import { NotificationKeys } from '@app/common/interfaces/notifications.interface';
import ConfirmModal from '@app/common/components/confirmation-modal';
import FormModal, { ModalType } from '@app/modules/form';
import Tabmenu from '@app/common/components/tabmenu';
import MetadataStub from '@app/modules/form/metadata-form/metadata-stub';
import { selectIsEditContentActive } from '@app/common/components/content-view/content-view.slice';

export default function SchemaView({ schemaId }: { schemaId: string }) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const confirmModalIsOpen = useSelector(selectConfirmModalState());
  const formModalIsOpen = useSelector(selectFormModalState());
  const isEditContentActive = useSelector(selectIsEditContentActive());
  const [patchSchema] = usePatchSchemaMutation();
  const [deleteSchema] = useDeleteSchemaMutation();

  const {
    data: schemaData,
    isLoading,
    isSuccess,
    refetch,
    isError,
    error,
  } = useGetSchemaWithRevisionsQuery(schemaId);

  const hasEditPermission = HasPermission({
    action: 'EDIT_CONTENT',
    owner: schemaData?.owner,
  });
  const isNodeEditable = isEditContentActive && hasEditPermission && schemaData?.format === Format.Mscr;
  const hasCopyPermission = HasPermission({ action: 'MAKE_MSCR_COPY' });
  const isMscrCopyAvailable =
    hasCopyPermission &&
    schemaData &&
    formatsAvailableForMscrCopy.includes(schemaData.format);

  useEffect(() => {
    updateActionMenu(
      dispatch,
      Type.Schema,
      schemaData,
      hasEditPermission,
      isMscrCopyAvailable
    );
  }, [dispatch, hasEditPermission, isMscrCopyAvailable, schemaData]);

  interface StatePayload {
    versionLabel?: string;
    state?: State;
  }
  const payloadBase: StatePayload = {
    versionLabel: schemaData?.versionLabel,
  };

  const publishSchema = () => {
    const publishPayload = { ...payloadBase, state: State.Published };
    changeSchemaState(publishPayload, 'SCHEMA_PUBLISH');
  };

  const deprecateSchema = () => {
    const deprecatePayload = { ...payloadBase, state: State.Deprecated };
    changeSchemaState(deprecatePayload, 'SCHEMA_DEPRECATE');
  };

  const invalidateSchema = () => {
    const invalidatePayload = { ...payloadBase, state: State.Invalid };
    changeSchemaState(invalidatePayload, 'SCHEMA_INVALIDATE');
  };

  const removeSchema = () => {
    const removePayload = { ...payloadBase, state: State.Removed };
    changeSchemaState(removePayload, 'SCHEMA_DELETE');
  };

  const changeSchemaState = (
    payload: StatePayload,
    notificationKey: NotificationKeys
  ) => {
    if (!schemaData) return;
    patchSchema({ payload: payload, pid: schemaData.pid })
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

  const deleteSchemaDraft = () => {
    if (!schemaData) return;
    deleteSchema(schemaData.pid)
      .unwrap()
      .then(() => {
        dispatch(
          mscrSearchApi.util.invalidateTags([
            'MscrSearch',
            'OrgContent',
            'PersonalContent',
          ])
        );
        dispatch(setNotification('SCHEMA_DELETE'));
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
        {schemaData.state === State.Removed ? ( // Stub view if state is REMOVED
          <Tabmenu
            contentType={Type.Schema}
            isRemoved={true}
            tabPanels={[
              {
                tabIndex: 0,
                tabText: 'metadata-and-files-tab',
                content: (
                  <MetadataStub metadata={schemaData} type={Type.Schema} />
                ),
              },
            ]}
          />
        ) : (
          <Tabmenu
            contentType={Type.Schema}
            tabPanels={[
              {
                tabIndex: 0,
                tabText: 'metadata-and-files-tab',
                content: (
                  <MetadataAndFiles
                    schemaDetails={schemaData}
                    refetch={refetch}
                    hasEditPermission={hasEditPermission}
                    isMscrCopyAvailable={isMscrCopyAvailable}
                  />
                ),
              },
              {
                tabIndex: 1,
                tabText: 'content-and-editor-tab',
                content: (
                  <SchemaVisualization
                    pid={schemaId}
                    format={schemaData.format}
                    isNodeEditable={isNodeEditable}
                  />
                ),
              },
              {
                tabIndex: 2,
                tabText: 'history-tab',
                content: (
                  <VersionHistory
                    revisions={schemaData.revisions}
                    contentType={Type.Schema}
                    currentRevision={schemaId}
                  />
                ),
              },
            ]}
          />
        )}
        {confirmModalIsOpen.deleteDraft && (
          <ConfirmModal
            actionText={t('actionmenu.delete-schema')}
            cancelText={t('action.cancel')}
            confirmAction={deleteSchemaDraft}
            onClose={() =>
              dispatch(
                setConfirmModalState({ key: 'deleteDraft', value: false })
              )
            }
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.delete-draft')}
            text2={t('confirm-modal.delete-draft-info')}
          />
        )}
        {confirmModalIsOpen.remove && (
          <ConfirmModal
            actionText={t('actionmenu.delete-schema')}
            cancelText={t('action.cancel')}
            confirmAction={removeSchema}
            onClose={() =>
              dispatch(setConfirmModalState({ key: 'remove', value: false }))
            }
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.delete-schema')}
            text2={t('confirm-modal.delete-info')}
          />
        )}
        {confirmModalIsOpen.publish && (
          <ConfirmModal
            actionText={t('action.publish')}
            cancelText={t('action.cancel')}
            confirmAction={publishSchema}
            onClose={() =>
              dispatch(setConfirmModalState({ key: 'publish', value: false }))
            }
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.publish-schema')}
          />
        )}
        {confirmModalIsOpen.invalidate && (
          <ConfirmModal
            actionText={t('action.invalidate')}
            cancelText={t('action.cancel')}
            confirmAction={invalidateSchema}
            onClose={() =>
              dispatch(
                setConfirmModalState({ key: 'invalidate', value: false })
              )
            }
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.invalidate-schema')}
          />
        )}
        {confirmModalIsOpen.deprecate && (
          <ConfirmModal
            actionText={t('action.deprecate')}
            cancelText={t('action.cancel')}
            confirmAction={deprecateSchema}
            onClose={() =>
              dispatch(setConfirmModalState({ key: 'deprecate', value: false }))
            }
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.deprecate-schema')}
          />
        )}
        {/*ToDo: When making a revision of an mscr copy is possible, take that into account here (Modaltype.RevisionMscr)*/}
        <FormModal
          modalType={ModalType.RevisionFull}
          contentType={Type.Schema}
          visible={formModalIsOpen.version}
          setVisible={(value) =>
            dispatch(setFormModalState({ key: 'version', value: value }))
          }
          initialData={schemaData}
        />
        <FormModal
          modalType={ModalType.McsrCopy}
          contentType={Type.Schema}
          visible={formModalIsOpen.mscrCopy}
          setVisible={(value) =>
            dispatch(setFormModalState({ key: 'mscrCopy', value: value }))
          }
          initialData={schemaData}
        />
      </ThemeProvider>
    );
  }

  // TODO: What to return if data fetching doesn't work?
  return <Text>{t('error.not-found')}</Text>;
}
