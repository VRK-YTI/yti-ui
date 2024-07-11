import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  useDeleteSchemaMutation,
  useGetSchemaWithRevisionsQuery,
  usePatchSchemaMutation
} from '@app/common/components/schema/schema.slice';
import MetadataAndFiles from './metadata-and-files';
import { createTheme, Grid, ThemeProvider } from '@mui/material';
import VersionHistory from 'src/common/components/version-history';
import SchemaVisualization from '@app/modules/schema-view/schema-visualization';
import { State } from '@app/common/interfaces/state.interface';
import MetadataStub from '@app/modules/form/metadata-form/metadata-stub';
import { Type } from '@app/common/interfaces/search.interface';
import { Text } from 'suomifi-ui-components';
import {
  SchemaVisualizationWrapper,
  VersionsHeading,
} from '@app/modules/schema-view/schema-view-styles';
import HasPermission from '@app/common/utils/has-permission';
import { Format, formatsAvailableForMscrCopy } from '@app/common/interfaces/format.interface';
import { useStoreDispatch } from '@app/store';
import {
  selectModal, setConfirmState, setFormState,
} from '@app/common/components/actionmenu/actionmenu.slice';
import { useSelector } from 'react-redux';
import { updateActionMenu } from '@app/common/components/schema-and-crosswalk-actionmenu/update-action-menu';
import { mscrSearchApi } from '@app/common/components/mscr-search/mscr-search.slice';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import { NotificationKeys } from '@app/common/interfaces/notifications.interface';
import ConfirmModal from '@app/common/components/confirmation-modal';
import * as React from 'react';
import FormModal, { ModalType } from '@app/modules/form';

export default function SchemaView({ schemaId }: { schemaId: string }) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const confirmModalIsOpen = useSelector(selectModal()).confirm;
  const formModalIsOpen = useSelector(selectModal()).form;
  const [patchSchema] = usePatchSchemaMutation();
  const [deleteSchema] = useDeleteSchemaMutation();


  const {
    data: schemaDetails,
    isLoading,
    isSuccess,
    refetch,
    isError,
    error,
  } = useGetSchemaWithRevisionsQuery(schemaId);

  const hasEditPermission = HasPermission({
    action: 'EDIT_CONTENT',
    owner: schemaDetails?.owner,
  });
  const hasCopyPermission = HasPermission({ action: 'MAKE_MSCR_COPY' });
  const isMscrCopyAvailable =
    hasCopyPermission &&
    schemaDetails &&
    formatsAvailableForMscrCopy.includes(schemaDetails.format);

  useEffect(() => {
    updateActionMenu(dispatch, Type.Schema, schemaDetails, hasEditPermission, isMscrCopyAvailable);
  }, [dispatch, hasEditPermission, isMscrCopyAvailable, schemaDetails]);

  interface StatePayload {
    versionLabel?: string;
    state?: State;
  }
  const payloadBase: StatePayload = {
    versionLabel: schemaDetails?.versionLabel,
  };

  const publishSchema = () => {
    const publishPayload = {...payloadBase, state: State.Published};
    changeSchemaState(publishPayload, 'SCHEMA_PUBLISH');
  };

  const deprecateSchema = () => {
    const deprecatePayload = {...payloadBase, state: State.Deprecated};
    changeSchemaState(deprecatePayload, 'SCHEMA_DEPRECATE');
  };

  const invalidateSchema = () => {
    const invalidatePayload = {...payloadBase, state: State.Invalid};
    changeSchemaState(invalidatePayload, 'SCHEMA_INVALIDATE');
  };

  const removeSchema = () => {
    const removePayload = {...payloadBase, state: State.Removed};
    changeSchemaState(removePayload, 'SCHEMA_DELETE');
  };

  const changeSchemaState = (payload: StatePayload, notificationKey: NotificationKeys) => {
    if (!schemaDetails) return;
    patchSchema({ payload: payload, pid: schemaDetails.pid })
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
    if (!schemaDetails) return;
    deleteSchema(schemaDetails.pid)
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

  const [selectedTab, setSelectedTab] = useState(0);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const changeTab = (event: SyntheticEvent | undefined, newValue: number) => {
    setSelectedTab(newValue);
  };
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
        {schemaDetails.state === State.Removed ? ( // Stub view if state is REMOVED
          <>
            <Box
              className="mb-3"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tabs value={0} aria-label={t('tabs.label')}>
                <Tab label={t('tabs.metadata-stub')} {...a11yProps(0)} />
              </Tabs>
            </Box>

            {schemaDetails && (
              <MetadataStub metadata={schemaDetails} type={Type.Schema} />
            )}
          </>
        ) : (
          <>
            <Box
              className="mb-3"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tabs
                value={selectedTab}
                onChange={changeTab}
                aria-label="Category selection"
              >
                <Tab label={t('tabs.metadata-and-files')} {...a11yProps(0)} />
                <Tab label={t('tabs.schema')} {...a11yProps(1)} />
                <Tab label={t('tabs.version-history')} {...a11yProps(2)} />
              </Tabs>
            </Box>

            {selectedTab === 0 && schemaDetails && (
              <MetadataAndFiles
                schemaDetails={schemaDetails}
                refetch={refetch}
                hasEditPermission={hasEditPermission}
                isMscrCopyAvailable={isMscrCopyAvailable}
              />
            )}
            {selectedTab === 1 && (
              <>
                <SchemaVisualizationWrapper>
                  <SchemaVisualization
                    pid={schemaId}
                    format={schemaDetails.format}
                    refetchMetadata={refetch}
                    metadata={schemaDetails}
                    hasEditPermission={hasEditPermission}
                    isMscrCopyAvailable={isMscrCopyAvailable}
                  />
                </SchemaVisualizationWrapper>
              </>
            )}
            {selectedTab === 2 && (
              <Grid container>
                <Grid item xs={6}>
                  <VersionsHeading variant="h2">
                    {t('metadata.versions')}
                  </VersionsHeading>
                </Grid>
                <Grid item xs={6} className="d-flex justify-content-end">
                  {/*Todo: Clean up, maybe remove gridding*/}
                  {/*<div className="mt-3 me-2">*/}
                  {/*  {hasEditPermission && (*/}
                  {/*    <SchemaAndCrosswalkActionMenu*/}
                  {/*      metadata={schemaDetails}*/}
                  {/*      isMappingsEditModeActive={false}*/}
                  {/*      refetchMetadata={refetch}*/}
                  {/*      type={ActionMenuTypes.Schema}*/}
                  {/*    />*/}
                  {/*  )}*/}
                  {/*  {!hasEditPermission && isMscrCopyAvailable && (*/}
                  {/*    <SchemaAndCrosswalkActionMenu*/}
                  {/*      metadata={schemaDetails}*/}
                  {/*      isMappingsEditModeActive={false}*/}
                  {/*      refetchMetadata={refetch}*/}
                  {/*      type={ActionMenuTypes.NoEditPermission}*/}
                  {/*    />*/}
                  {/*  )}*/}
                  {/*</div>*/}
                </Grid>
                <Grid item xs={12}>
                  <VersionHistory
                    revisions={schemaDetails.revisions}
                    contentType={Type.Schema}
                    currentRevision={schemaId}
                  />
                </Grid>
              </Grid>
            )}
          </>
        )}
        {confirmModalIsOpen.deleteDraft && (
          <ConfirmModal
            actionText={t('actionmenu.delete-schema')}
            cancelText={t('action.cancel')}
            confirmAction={deleteSchemaDraft}
            onClose={() => dispatch(setConfirmState({key: 'deleteDraft', value: false}))}
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
            onClose={() => dispatch(setConfirmState({key: 'remove', value: false}))}
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
            onClose={() => dispatch(setConfirmState({key: 'publish', value: false}))}
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.publish-schema')}
          />
        )}
        {confirmModalIsOpen.invalidate && (
          <ConfirmModal
            actionText={t('action.invalidate')}
            cancelText={t('action.cancel')}
            confirmAction={invalidateSchema}
            onClose={() => dispatch(setConfirmState({key: 'invalidate', value: false}))}
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.invalidate-schema')}
          />
        )}
        {confirmModalIsOpen.deprecate && (
          <ConfirmModal
            actionText={t('action.deprecate')}
            cancelText={t('action.cancel')}
            confirmAction={deprecateSchema}
            onClose={() => dispatch(setConfirmState({key: 'deprecate', value: false}))}
            heading={t('confirm-modal.heading')}
            text1={t('confirm-modal.deprecate-schema')}
          />
        )}
        {/*ToDo: When making a revision of an mscr copy is possible, take that into account here (Modaltype.RevisionMscr)*/}
        <FormModal
          modalType={ModalType.RevisionFull}
          contentType={Type.Schema}
          visible={formModalIsOpen.version}
          setVisible={(value) => dispatch(setFormState({key: 'version', value: value}))}
          initialData={schemaDetails}
        />
        <FormModal
          modalType={ModalType.McsrCopy}
          contentType={Type.Schema}
          visible={formModalIsOpen.mscrCopy}
          setVisible={(value) => dispatch(setFormState({key: 'mscrCopy', value: value}))}
          initialData={schemaDetails}
        />
      </ThemeProvider>
    );
  }

  // TODO: What to return if data fetching returns error?
  return <></>;
}
