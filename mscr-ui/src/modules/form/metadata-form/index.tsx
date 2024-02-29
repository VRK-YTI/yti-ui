import { Metadata } from '@app/common/interfaces/metadata.interface';
import { usePatchCrosswalkMutation } from '@app/common/components/crosswalk/crosswalk.slice';
import { usePatchSchemaMutation } from '@app/common/components/schema/schema.slice';
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
import ConfirmModal from '@app/common/components/confirmation-modal';
import * as React from 'react';
import { useState } from 'react';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { Visibility } from '@app/common/interfaces/search.interface';
import { State } from '@app/common/interfaces/state.interface';

interface MetadataFormProps {
  metadata: Metadata;
  hasEditPermission: boolean;
}
export default function MetadataForm({
  metadata,
  hasEditPermission,
}: MetadataFormProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = router.locale ?? '';
  const [isEditModeActive, setIsEditModeActive] = useState<boolean>(false);
  const [patchCrosswalk, patchCrosswalkResponse] = usePatchCrosswalkMutation();
  const [patchSchema, patchSchemaMutation] = usePatchSchemaMutation();
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

  interface EditableMetadataFields {
    label: string;
    description: string;
    visibility: string;
    versionLabel: string;
    contact: string;
  }
  const initialFormData: EditableMetadataFields = {
    label: localizedLabel,
    description: localizedDescription,
    visibility: metadata.visibility ?? 'PRIVATE',
    versionLabel: metadata.versionLabel ?? '',
    contact: metadata.contact ?? '',
  };
  const [formData, setFormData] =
    useState<EditableMetadataFields>(initialFormData);

  function updateFormData(
    attributeName: keyof EditableMetadataFields,
    value: string | number | undefined
  ) {
    const newFormData: EditableMetadataFields = { ...formData };
    newFormData[attributeName] = value?.toString() ?? '';
    setFormData(newFormData);
  }

  return (
    <>
      <div className="crosswalk-editor metadata-and-files-wrap mx-2">
        <Grid>
          <Grid container>
            <h2>{t('metadata.crosswalk-details')}</h2>
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
                    <div className="br-label">{localizedLabel}</div>
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
                  {!isEditModeActive && (
                    <div>{metadata.contact}</div>
                  )}
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
                  <div className="br-label">{metadata.created}</div>
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  {t('metadata.modified')}:
                </Grid>
                <Grid item xs={8}>
                  <div className="br-label">
                    {metadata.modified}
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
                  {isEditModeActive && (
                    <Dropdown
                      labelText=""
                      value={formData.visibility}
                      onChange={(value) => updateFormData('visibility', value)}
                    >
                      <DropdownItem key={Visibility.Public} value={Visibility.Public}>
                        {Visibility.Public}
                      </DropdownItem>
                      <DropdownItem key={Visibility.Private} value={Visibility.Private}>
                        {Visibility.Private}
                      </DropdownItem>
                    </Dropdown>
                  )}
                  {!isEditModeActive && (
                    <div className="br-label">
                      {metadata.visibility}
                    </div>
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
                        {localizedDescription}
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
                          className={metadata.state == State.Draft ? '' : 'd-none'}
                          onClick={() => setPublishConfirmModalOpen(true)}
                        >
                          {t('action.publish')}
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
                      setInitialPatchValuesFromData();
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
        {/*        <FilesComponent
          crosswalkData={props.crosswalkData}
          isAdmin={hasEditRights}
        ></FilesComponent>*/}
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
          isVisible={isPublishConfirmModalOpen}
          actionName={'publish'}
          actionText={t('action.publish')}
          cancelText={t('action.cancel')}
          performConfirmModalAction={performModalAction}
          heading={t('confirm-modal.heading')}
          text1={t('confirm-modal.publish-crosswalk1')}
          text2={t('confirm-modal.publish-crosswalk2')}
        />
      </div>
    </>
  );
}
