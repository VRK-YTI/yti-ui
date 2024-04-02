import {
  initialMetadataForm,
  Metadata,
  MetadataFormType,
} from '@app/common/interfaces/metadata.interface';
import {
  useDeleteCrosswalkMutation,
  usePatchCrosswalkMutation,
} from '@app/common/components/crosswalk/crosswalk.slice';
import {
  useDeleteSchemaMutation,
  usePatchSchemaMutation,
} from '@app/common/components/schema/schema.slice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import {
  ActionMenu,
  ActionMenuItem,
  Button as Sbutton,
  Dropdown,
  DropdownItem,
  Textarea,
  TextInput,
} from 'suomifi-ui-components';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { Type, Visibility } from '@app/common/interfaces/search.interface';
import { State } from '@app/common/interfaces/state.interface';
import ConfirmModal from '@app/common/components/confirmation-modal';
import { useStoreDispatch } from '@app/store';
import {
  clearNotification,
  setNotification,
} from '@app/common/components/notifications/notifications.slice';
import Notification from '@app/common/components/notifications';
import FormattedDate from 'yti-common-ui/components/formatted-date';

interface MetadataFormProps {
  type: Type;
  metadata: Metadata;
  refetchMetadata: () => void;
  hasEditPermission: boolean;
}
export default function MetadataForm({
  type,
  metadata,
  refetchMetadata,
  hasEditPermission,
}: MetadataFormProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = router.locale ?? '';
  const dispatch = useStoreDispatch();
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const [patchCrosswalk] = usePatchCrosswalkMutation();
  const [patchSchema] = usePatchSchemaMutation();
  const [deleteSchema] = useDeleteSchemaMutation();
  const [deleteCrosswalk] = useDeleteCrosswalkMutation();
  const [isSaveConfirmModalOpen, setSaveConfirmModalOpen] = useState(false);
  const [isPublishConfirmModalOpen, setPublishConfirmModalOpen] =
    useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] =
    useState<MetadataFormType>(initialMetadataForm);

  const performModalAction = (action: string) => {
    setSaveConfirmModalOpen(false);
    setPublishConfirmModalOpen(false);
    setDeleteModalOpen(false);
    if (action === 'close') {
      return;
    }
    let payload = generatePayload();
    if (action === 'publish') {
      payload = {
        ...payload,
        state: State.Published,
        visibility: Visibility.Public,
      };
    }
    if (action === 'save' || action === 'publish') {
      setIsEditModeActive(false);
      if (type === Type.Crosswalk) {
        patchCrosswalk({ payload: payload, pid: metadata.pid })
          .unwrap()
          .then(() => {
            dispatch(
              setNotification(
                action === 'publish' ? 'CROSSWALK_PUBLISH' : 'CROSSWALK_SAVE'
              )
            );
            refetchMetadata();
          });
        // ToDo: Error notifications with .catch
      } else if (type === Type.Schema) {
        patchSchema({ payload: payload, pid: metadata.pid })
          .unwrap()
          .then(() => {
            dispatch(
              setNotification(
                action === 'publish' ? 'SCHEMA_PUBLISH' : 'SCHEMA_SAVE'
              )
            );
            refetchMetadata();
          });
      }
    }
    if (action === 'deleteCrosswalk') {
      console.log('crosswalk pid', metadata.pid);
      deleteCrosswalk(metadata.pid.toString())
        .unwrap()
        .then(() => {
          dispatch(setNotification('CROSSWALK_DELETE'));
          refetchMetadata();
        });
      // ToDo: Error notifications with .catch
    } else if (action === 'deleteSchema') {
      console.log('schema pid', metadata.pid);
      deleteSchema(metadata.pid.toString())
        .unwrap()
        .then(() => {
          dispatch(setNotification('SCHEMA_DELETE'));
          refetchMetadata();
        });
      // ToDo: Error notifications with .catch
    }
  };

  const generatePayload = (): Partial<Metadata> => {
    return {
      label: { ...metadata.label, [lang]: formData.label },
      description: { ...metadata.description, [lang]: formData.description },
      contact: formData.contact,
      versionLabel: formData.versionLabel,
      visibility: formData.visibility as Visibility,
    };
  };

  const setFormValuesFromData = useCallback(() => {
    const localizedLabel = metadata.label
      ? getLanguageVersion({
          data: metadata.label,
          lang,
        })
      : '';
    const localizedDescription = metadata.description
      ? getLanguageVersion({
          data: metadata.description,
          lang,
        })
      : '';
    const formValuesFromData: MetadataFormType = {
      label: localizedLabel,
      description: localizedDescription,
      visibility: metadata.visibility ?? Visibility.Private,
      versionLabel: metadata.versionLabel ?? '',
      contact: metadata.contact ?? '',
    };
    setFormData(formValuesFromData);
  }, [metadata, lang]);

  useEffect(() => {
    setFormValuesFromData();
  }, [setFormValuesFromData]);

  useEffect(() => {
    dispatch(clearNotification());
  }, [dispatch]);

  function updateFormData(
    attributeName: keyof MetadataFormType,
    value: string | number | undefined
  ) {
    const newFormData: MetadataFormType = { ...formData };
    newFormData[attributeName] = value?.toString() ?? '';
    setFormData(newFormData);
  }

  return (
    <>
      <div className="crosswalk-editor metadata-and-files-wrap mx-2">
        <Notification />
        <Grid>
          <Grid container>
            {type === Type.Crosswalk ? (
              <h2>{t('metadata.crosswalk-details')}</h2>
            ) : (
              <h2>{t('metadata.schema-details')}</h2>
            )}
          </Grid>
          <Grid container className="bg-lightest-blue p-3">
            <Grid item xs={12} md={7}>
              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  {t('metadata.name')}:
                </Grid>
                <Grid item xs={8}>
                  {isEditModeActive && (
                    <TextInput
                      labelText=""
                      onChange={(value) => updateFormData('label', value)}
                      value={formData.label}
                    />
                  )}
                  {!isEditModeActive && (
                    <div className="br-label">{formData.label}</div>
                  )}
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  {t('metadata.version-label')}:
                </Grid>
                <Grid item xs={8}>
                  {isEditModeActive && (
                    <TextInput
                      labelText=""
                      onChange={(value) =>
                        updateFormData('versionLabel', value)
                      }
                      value={formData.versionLabel}
                    />
                  )}
                  {!isEditModeActive && (
                    <div className="br-label">{metadata.versionLabel}</div>
                  )}
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  {t('metadata.contact')}:
                </Grid>
                <Grid item xs={8}>
                  {isEditModeActive && (
                    <TextInput
                      labelText=""
                      onChange={(value) => updateFormData('contact', value)}
                      value={formData.contact}
                    />
                  )}
                  {!isEditModeActive && <div>{metadata.contact}</div>}
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  {t('metadata.pid')}:
                </Grid>
                <Grid item xs={8}>
                  <div className="br-label">{metadata.pid}</div>
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  {t('metadata.format')}:
                </Grid>
                <Grid item xs={8}>
                  <div className="br-label">{metadata.format}</div>
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  {t('metadata.created')}:
                </Grid>
                <Grid item xs={8}>
                  <div className="br-label">
                    <FormattedDate date={metadata.created} />
                  </div>
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  {t('metadata.modified')}:
                </Grid>
                <Grid item xs={8}>
                  <div className="br-label">
                    <FormattedDate date={metadata.modified} />
                  </div>
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  {t('metadata.state')}:
                </Grid>
                <Grid item xs={8}>
                  <div className="br-label">{metadata.state}</div>
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  {t('metadata.visibility')}:
                </Grid>
                <Grid item xs={8}>
                  {isEditModeActive && metadata.state === State.Draft && (
                    <Dropdown
                      labelText=""
                      value={formData.visibility}
                      onChange={(value) => updateFormData('visibility', value)}
                    >
                      <DropdownItem
                        key={Visibility.Public}
                        value={Visibility.Public}
                      >
                        {Visibility.Public}
                      </DropdownItem>
                      <DropdownItem
                        key={Visibility.Private}
                        value={Visibility.Private}
                      >
                        {Visibility.Private}
                      </DropdownItem>
                    </Dropdown>
                  )}
                  {(!isEditModeActive || metadata.state !== State.Draft) && (
                    <div className="br-label">{metadata.visibility}</div>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={5}>
              <Grid container>
                <Grid item xs={6} md={7}>
                  <Grid className="basic-row">
                    <Grid item xs={12} className="br-heading">
                      {t('metadata.description')}:
                    </Grid>
                    {isEditModeActive && (
                      <Textarea
                        labelText=""
                        hintText=""
                        resize="vertical"
                        onChange={(event) =>
                          updateFormData('description', event.target.value)
                        }
                        value={formData.description}
                      ></Textarea>
                    )}
                    {!isEditModeActive && (
                      <div className="description-label">
                        {formData.description}
                      </div>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={6} md={5}>
                  <Grid container direction="row" justifyContent="flex-end">
                    {hasEditPermission && (
                      <ActionMenu buttonText={t('action.actions')}>
                        <ActionMenuItem
                          onClick={() => setIsEditModeActive(true)}
                          className={isEditModeActive ? 'd-none' : ''}
                        >
                          {t('action.edit')}
                        </ActionMenuItem>
                        <ActionMenuItem
                          className={
                            metadata.state == State.Draft ? '' : 'd-none'
                          }
                          onClick={() => setPublishConfirmModalOpen(true)}
                        >
                          {t('action.publish')}
                        </ActionMenuItem>
                        <ActionMenuItem
                          className={
                            metadata.state == State.Draft ? '' : 'd-none'
                          }
                          onClick={() => setDeleteModalOpen(true)}
                        >
                          {t('action.delete')}
                        </ActionMenuItem>
                      </ActionMenu>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="flex-end">
              {hasEditPermission && isEditModeActive && (
                <>
                  <Sbutton
                    className="align-self-end my-3"
                    hidden={!isEditModeActive}
                    onClick={() => {
                      setSaveConfirmModalOpen(true);
                    }}
                  >
                    {t('action.save')}
                  </Sbutton>

                  <Sbutton
                    className="align-self-end ms-2 my-3"
                    hidden={!isEditModeActive}
                    variant="secondary"
                    onClick={() => {
                      setIsEditModeActive(false);
                      setFormValuesFromData();
                    }}
                  >
                    {t('action.cancel')}
                  </Sbutton>
                </>
              )}
            </Grid>
          </Grid>
          <br />
        </Grid>
        <ConfirmModal
          isVisible={isSaveConfirmModalOpen}
          actionName={'save'}
          actionText={t('action.save')}
          cancelText={t('action.cancel')}
          performConfirmModalAction={performModalAction}
          heading={t('confirm-modal.heading')}
          text1={t('confirm-modal.save')}
        />
        <ConfirmModal
          isVisible={isDeleteModalOpen}
          actionName={
            type === Type.Crosswalk ? 'deleteCrosswalk' : 'deleteSchema'
          }
          actionText={
            type === Type.Crosswalk
              ? t('action.delete-crosswalk')
              : t('action.delete-schema')
          }
          cancelText={t('action.cancel')}
          performConfirmModalAction={performModalAction}
          heading={t('confirm-modal.heading')}
          text1={
            type === Type.Crosswalk
              ? t('confirm-modal.delete-crosswalk')
              : t('confirm-modal.delete-schema')
          }
        />
        <ConfirmModal
          isVisible={isPublishConfirmModalOpen}
          actionName={'publish'}
          actionText={t('action.publish')}
          cancelText={t('action.cancel')}
          performConfirmModalAction={performModalAction}
          heading={t('confirm-modal.heading')}
          text1={
            type === Type.Crosswalk
              ? t('confirm-modal.publish-crosswalk1')
              : t('confirm-modal.publish-schema')
          }
          text2={
            type === Type.Crosswalk
              ? t('confirm-modal.publish-crosswalk2')
              : undefined
          }
        />
      </div>
    </>
  );
}
