import {initialMetadataForm, Metadata, MetadataFormType,} from '@app/common/interfaces/metadata.interface';
import {useDeleteCrosswalkMutation, usePatchCrosswalkMutation,} from '@app/common/components/crosswalk/crosswalk.slice';
import {useDeleteSchemaMutation, usePatchSchemaMutation,} from '@app/common/components/schema/schema.slice';
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';
import {Grid} from '@mui/material';
import {
  ActionMenu,
  ActionMenuItem,
} from 'suomifi-ui-components';
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {getLanguageVersion} from '@app/common/utils/get-language-version';
import {ActionMenuTypes, Type, Visibility} from '@app/common/interfaces/search.interface';
import {State} from '@app/common/interfaces/state.interface';
import ConfirmModal from '@app/common/components/confirmation-modal';
import {useStoreDispatch} from '@app/store';
import {clearNotification, setNotification,} from '@app/common/components/notifications/notifications.slice';
import {mscrSearchApi} from '@app/common/components/mscr-search/mscr-search.slice';
import {CrosswalkWithVersionInfo} from "@app/common/interfaces/crosswalk.interface";
import {SchemaWithVersionInfo} from "@app/common/interfaces/schema.interface";

interface SchemaAndCrosswalkActionmenuProps {
  type: ActionMenuTypes;
  metadata: SchemaWithVersionInfo | CrosswalkWithVersionInfo;
  isMappingsEditModeActive: boolean;
  refetchMetadata: () => void;
  buttonCallbackFunction: any;
}

export default function SchemaAndCrosswalkActionMenu({
                                       type,
                                       metadata, isMappingsEditModeActive,
                                       refetchMetadata, buttonCallbackFunction = function () {},
                                     }: SchemaAndCrosswalkActionmenuProps) {
  const {t} = useTranslation('common');
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
  const [isInvalidateConfirmModalOpen, setInvalidateConfirmModalOpen] =
    useState(false);
  const [isDeprecateConfirmModalOpen, setDeprecateConfirmModalOpen] =
    useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] =
    useState<MetadataFormType>(initialMetadataForm);


  const performModalAction = (action: string) => {
    setSaveConfirmModalOpen(false);
    setPublishConfirmModalOpen(false);
    setDeleteModalOpen(false);
    setInvalidateConfirmModalOpen(false);
    setDeprecateConfirmModalOpen(false);
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
    if (action === 'deprecate') {
      payload = {
        ...payload,
        state: State.Deprecated,
        visibility: Visibility.Public,
      };
    }
    if (action === 'invalidate') {
      payload = {
        ...payload,
        state: State.Invalid,
        visibility: Visibility.Public,
      };
    }
    if (action === 'save' || action === 'publish' || action === 'invalidate' || action === 'deprecate') {
      setIsEditModeActive(false);
      if (type !== ActionMenuTypes.Schema) {
        patchCrosswalk({payload: payload, pid: metadata.pid})
          .unwrap()
          .then(() => {
            dispatch(
              setNotification(
                action === 'publish' ? 'CROSSWALK_PUBLISH' : 'save' ? 'CROSSWALK_SAVE' : 'invalidate' ? 'CROSSWALK_INVALIDATE' : 'CROSSWALK_DEPRECATE'
              )
            );
            refetchMetadata();
          });
        // ToDo: Error notifications with .catch
      } else if (type === ActionMenuTypes.Schema) {
        patchSchema({payload: payload, pid: metadata.pid})
          .unwrap()
          .then(() => {
            dispatch(
              setNotification(
                action === 'publish' ? 'SCHEMA_PUBLISH' : 'save' ? 'SCHEMA_SAVE' : 'invalidate' ? 'SCHEMA_INVALIDATE' : 'SCHEMA_DEPRECATE'
              )
            );
            refetchMetadata();
          });
      }
    }
    if (action === 'deleteCrosswalk') {
      deleteCrosswalk(metadata.pid.toString())
        .unwrap()
        .then(() => {
          dispatch(mscrSearchApi.util.invalidateTags(['MscrSearch', 'OrgContent', 'PersonalContent']));
          dispatch(setNotification('CROSSWALK_DELETE'));
          refetchMetadata();
        });
      // ToDo: Error notifications with .catch
    } else if (action === 'deleteSchema') {
      deleteSchema(metadata.pid.toString())
        .unwrap()
        .then(() => {
          dispatch(mscrSearchApi.util.invalidateTags(['MscrSearch', 'OrgContent', 'PersonalContent']));
          dispatch(setNotification('SCHEMA_DELETE'));
          refetchMetadata();
        });
      // ToDo: Error notifications with .catch
    }
  };

  const generatePayload = (): Partial<Metadata> => {
    return {
      label: {...metadata.label, [lang]: formData.label},
      description: {...metadata.description, [lang]: formData.description},
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
      setIsEditModeActive(isMappingsEditModeActive);
  }, [isMappingsEditModeActive]);

  useEffect(() => {
    dispatch(clearNotification());
  }, [dispatch]);

  function updateFormData(
    attributeName: keyof MetadataFormType,
    value: string | number | undefined
  ) {
    const newFormData: MetadataFormType = {...formData};
    newFormData[attributeName] = value?.toString() ?? '';
    setFormData(newFormData);
  }

  return (
    <><ActionMenu buttonText={t('action.actions')}>
      <ActionMenuItem
        className={type === ActionMenuTypes.CrosswalkEditor && metadata.state == State.Draft ? '' : 'd-none'}
        onClick={() => buttonCallbackFunction('edit')}
      >
        {isEditModeActive ? t('actionmenu.finish-editing') : t('actionmenu.edit-mappings\'')}
      </ActionMenuItem>
      <ActionMenuItem
        onClick={() => buttonCallbackFunction('edit')}
        className={(type === ActionMenuTypes.CrosswalkMetadata || type === ActionMenuTypes.SchemaMetadata) ? '' : 'd-none'}
      >
        {t('actionmenu.edit-metadata')}
      </ActionMenuItem>
      <ActionMenuItem
        className={metadata && metadata.state == State.Draft ? '' : 'd-none'}
        onClick={() => setPublishConfirmModalOpen(true)}
      >
        {type === ActionMenuTypes.Schema || type === ActionMenuTypes.SchemaMetadata ? t('actionmenu.publish-schema') : t('actionmenu.publish-crosswalk')}
      </ActionMenuItem>
      <ActionMenuItem
        className={metadata && metadata.state == State.Published ? '' : 'd-none'}
        onClick={() => setInvalidateConfirmModalOpen(true)}
      >
        {type === ActionMenuTypes.Schema || type === ActionMenuTypes.SchemaMetadata ? t('actionmenu.invalidate-schema') : t('actionmenu.invalidate-crosswalk')}
      </ActionMenuItem>
      <ActionMenuItem
        className={metadata && metadata.state == State.Published ? '' : 'd-none'}
        onClick={() => setDeprecateConfirmModalOpen(true)}
      >
        {type === ActionMenuTypes.Schema || type === ActionMenuTypes.SchemaMetadata ? t('actionmenu.deprecate-schema') : t('actionmenu.deprecate-crosswalk')}
      </ActionMenuItem>
      <ActionMenuItem
        className={type === (ActionMenuTypes.CrosswalkMetadata || ActionMenuTypes.CrosswalkEditor || ActionMenuTypes.Schema) && metadata && metadata.state == State.Draft || State.Invalid || State.Deprecated ? '' : 'd-none'}
        onClick={() => setDeleteModalOpen(true)}
      >
        {type === ActionMenuTypes.Schema || type === ActionMenuTypes.SchemaMetadata ? t('actionmenu.delete-schema') : t('actionmenu.delete-crosswalk')}
      </ActionMenuItem>
    </ActionMenu>
      <ConfirmModal
      isVisible={isDeleteModalOpen}
      actionName={type === ActionMenuTypes.Schema || type === ActionMenuTypes.SchemaMetadata ? 'deleteSchema' : 'deleteCrosswalk'}
      actionText={type === ActionMenuTypes.Schema || type === ActionMenuTypes.SchemaMetadata
        ? t('actionmenu.delete-schema')
        : t('actionmenu.delete-crosswalk')}
      cancelText={t('action.cancel')}
      performConfirmModalAction={performModalAction}
      heading={t('confirm-modal.heading')}
      text1={type === ActionMenuTypes.Schema || type === ActionMenuTypes.SchemaMetadata
        ? t('confirm-modal.delete-schema')
        : t('confirm-modal.delete-crosswalk')}/><ConfirmModal
      isVisible={isPublishConfirmModalOpen}
      actionName={'publish'}
      actionText={t('action.publish')}
      cancelText={t('action.cancel')}
      performConfirmModalAction={performModalAction}
      heading={t('confirm-modal.heading')}
      text1={type === ActionMenuTypes.Schema || type === ActionMenuTypes.SchemaMetadata
        ? t('confirm-modal.publish-schema')
        : t('confirm-modal.publish-crosswalk1')}
      text2={type !== ActionMenuTypes.Schema && type !== ActionMenuTypes.SchemaMetadata
        ? t('confirm-modal.publish-crosswalk2')
        : undefined}/>

      <ConfirmModal
      isVisible={isInvalidateConfirmModalOpen}
      actionName={'invalidate'}
      actionText={t('action.invalidate')}
      cancelText={t('action.cancel')}
      performConfirmModalAction={performModalAction}
      heading={t('confirm-modal.heading')}
      text1={type === ActionMenuTypes.Schema|| type === ActionMenuTypes.SchemaMetadata
        ? t('confirm-modal.invalidate-schema')
        : t('confirm-modal.invalidate-crosswalk')}
      text2={undefined}/>

      <ConfirmModal
      isVisible={isDeprecateConfirmModalOpen}
      actionName={'deprecate'}
      actionText={t('action.deprecate')}
      cancelText={t('action.cancel')}
      performConfirmModalAction={performModalAction}
      heading={t('confirm-modal.heading')}
      text1={type === ActionMenuTypes.Schema|| type === ActionMenuTypes.SchemaMetadata
        ? t('confirm-modal.deprecate-schema')
        : t('confirm-modal.deprecate-crosswalk')}
      text2={undefined}/>
    </>
  );
}
