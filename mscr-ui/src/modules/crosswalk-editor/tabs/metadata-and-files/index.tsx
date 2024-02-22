import { NodeMapping } from '@app/common/interfaces/crosswalk-connection.interface';
import {
  Button as Sbutton,
  Dropdown,
  Textarea,
  TextInput,
  DropdownItem,
  ActionMenu,
  ActionMenuItem,
} from 'suomifi-ui-components';
import { useEffect, useState } from 'react';
import ConfirmModal from '@app/common/components/confirmation-modal';
import * as React from 'react';
import { Grid } from '@mui/material';
import router from 'next/router';
import HasPermission from '@app/common/utils/has-permission';
// import FilesComponent from '@app/modules/crosswalk-editor/tabs/metadata-and-files/files-component';

interface patchPayload {
  label: string;
  description: string;
  contact: string;
  versionLabel: string;
  visibility: string;

  [key: string]: string | string[];
}

export enum ConfirmModalTexts {
  'SAVE' = 'Are you sure you want to save changes?',
  'PUBLISH1' = 'Are you sure you want to publish the crosswalk?',
  'PUBLISH2' = 'After publishing, you cannot make changes to mappings in crosswalk.',
}

export default function MetadataAndFiles(props: {
  crosswalkData: any;
  sourceSchemaData: any;
  targetSchemaData: any;
  performMetadataAndFilesAction: any;
  nodeMappings: NodeMapping[];
  crosswalkId: string;
}) {
  const hasEditRights = HasPermission({ actions: ['EDIT_CROSSWALK_METADATA'] });
  const patchPayloadInit: patchPayload = {
    label: '',
    description: '',
    contact: '',
    versionLabel: '',
    visibility: '',
  };

  // All the values are not patchable. This is used to filter out patchable data from original json. True value is used to indicate a nested localized field.
  const valuesToPatch = {
    label: true,
    description: true,
    contact: false,
    versionLabel: false,
    visibility: false,
  };

  const localizedValueKeys = ['label', 'description'];

  const visibilityStates = [
    {
      name: 'PUBLIC',
      key: 'PUBLIC',
    },
    {
      name: 'PRIVATE',
      key: 'PRIVATE',
    },
  ];

  const lang = router.locale ?? 'en';
  const [unformattedPayload, setUnformattedPayload] =
    useState(patchPayloadInit);
  const [isEditModeActive, setEditModeActive] = useState<boolean>(false);
  const [isSaveConfirmModalOpen, setSaveConfirmModalOpen] =
    React.useState<boolean>(false);
  const [isPublishConfirmModalOpen, setPublishConfirmModalOpen] =
    React.useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [visibilityState, setVisibilityState] = useState<string>('PRIVATE');

  function performModalAction(action: string) {
    if (action === 'save') {
      saveChanges();
      setSaveConfirmModalOpen(false);
    }
    if (action === 'publish') {
      publish();
      setPublishConfirmModalOpen(false);
    }
    if (action === 'close') {
      setSaveConfirmModalOpen(false);
      setPublishConfirmModalOpen(false);
    }
  }

  function saveChanges() {
    props.performMetadataAndFilesAction(
      formatPatchValuesForSave(false),
      'saveChanges',
    );
    setEditModeActive(false);
  }

  function publish() {
    props.performMetadataAndFilesAction(
      formatPatchValuesForSave(true),
      'saveChanges',
    );
    setEditModeActive(false);
  }

  function updateVisibilityState(state: string) {
    setVisibilityState(state);
    updatePatchValue('visibility', state);
  }

  function updatePatchValue(attributeName: string, value: any) {
    const val = value === undefined ? '' : value.toString();
    const newPayload = { ...unformattedPayload };
    newPayload[attributeName] = val;
    setUnformattedPayload(newPayload);
  }

  useEffect(() => {
    setInitialPatchValuesFromData();
    setIsPublished(props.crosswalkData.state === 'PUBLISHED');
    setVisibilityState(props.crosswalkData.visibility);
  }, [props.crosswalkData]);

  function setInitialPatchValuesFromData() {
    const newPayload = { ...unformattedPayload };
    if (props.crosswalkData) {
      for (const [key, value] of Object.entries(valuesToPatch)) {
        if (value) {
          newPayload[key] = props.crosswalkData[key]?.[lang];
        } else {
          newPayload[key] = props.crosswalkData[key]
            ? props.crosswalkData[key]
            : '';
        }
      }
    }
    setUnformattedPayload(newPayload);
  }

  function formatPatchValuesForSave(isPublishAction: boolean) {
    const formattedPatchPayload = [];
    if (props.crosswalkData) {
      for (const [key, value] of Object.entries(unformattedPayload)) {
        if (localizedValueKeys.includes(key)) {
          const locObj = { [key]: { [lang]: value } };
          formattedPatchPayload.push(locObj);
        } else {
          const obj = { [key]: value };
          formattedPatchPayload.push(obj);
        }
      }
      if (isPublishAction) {
        formattedPatchPayload.push({
          state: 'PUBLISHED',
        });
      }
      return formattedPatchPayload;
    }
  }

  return (
    <>
      <div className="crosswalk-editor metadata-and-files-wrap mx-2">
        <Grid>
          <Grid container>
            <h2>Crosswalk details</h2>
          </Grid>
          <Grid container className="bg-lightest-blue p-3">
            <Grid item xs={12} md={7}>
              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  Crosswalk name:
                </Grid>
                <Grid item xs={8}>
                  {isEditModeActive && (
                    <TextInput
                      labelText=""
                      onChange={(value) => updatePatchValue('label', value)}
                      value={unformattedPayload.label.toString()}
                    />
                  )}
                  {!isEditModeActive && (
                    <div className="br-label">
                      {props.crosswalkData?.label[lang]}
                    </div>
                  )}
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  Version label:
                </Grid>
                <Grid item xs={8}>
                  {isEditModeActive && (
                    <TextInput
                      labelText=""
                      onChange={(value) =>
                        updatePatchValue('versionLabel', value)
                      }
                      value={unformattedPayload.versionLabel.toString()}
                    />
                  )}
                  {!isEditModeActive && (
                    <div className="br-label">
                      {props.crosswalkData?.versionLabel}
                    </div>
                  )}
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  Contact:
                </Grid>
                <Grid item xs={8}>
                  {isEditModeActive && (
                    <TextInput
                      labelText=""
                      onChange={(value) => updatePatchValue('contact', value)}
                      value={unformattedPayload.contact.toString()}
                    />
                  )}
                  {!isEditModeActive && (
                    <div>{props.crosswalkData?.contact}</div>
                  )}
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  Pid:
                </Grid>
                <Grid item xs={8}>
                  <div className="br-label">{props.crosswalkData?.pid}</div>
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  Format:
                </Grid>
                <Grid item xs={8}>
                  <div className="br-label">{props.crosswalkData?.format}</div>
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  Created:
                </Grid>
                <Grid item xs={8}>
                  <div className="br-label">{props.crosswalkData?.created}</div>
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  Modified:
                </Grid>
                <Grid item xs={8}>
                  <div className="br-label">
                    {props.crosswalkData?.modified}
                  </div>
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  State:
                </Grid>
                <Grid item xs={8}>
                  <div className="br-label">{props.crosswalkData?.state}</div>
                </Grid>
              </Grid>

              <Grid container className="basic-row">
                <Grid item xs={4} className="br-heading">
                  Visibility:
                </Grid>
                <Grid item xs={8}>
                  {isEditModeActive && (
                    <Dropdown
                      labelText=""
                      value={visibilityState}
                      onChange={(value) => updateVisibilityState(value)}
                    >
                      {visibilityStates.map((state) => (
                        <DropdownItem key={state.key} value={state.key}>
                          {state.name}
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  )}
                  {!isEditModeActive && (
                    <div className="br-label">
                      {props.crosswalkData?.visibility}
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
                      Description:
                    </Grid>
                    {isEditModeActive && (
                      <Textarea
                        labelText=""
                        hintText=""
                        resize="vertical"
                        onChange={(event) =>
                          updatePatchValue('description', event.target.value)
                        }
                        value={unformattedPayload.description}
                      ></Textarea>
                    )}
                    {!isEditModeActive && (
                      <div className="description-label">
                        {unformattedPayload.description}
                      </div>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={6} md={5}>
                  <Grid container direction="row" justifyContent="flex-end">
                    {hasEditRights && (
                      <ActionMenu buttonText="Actions">
                        <ActionMenuItem
                          onClick={() => setEditModeActive(true)}
                          className={isEditModeActive ? 'd-none' : ''}
                        >
                          Edit
                        </ActionMenuItem>
                        <ActionMenuItem
                          className={isPublished ? 'd-none' : ''}
                          onClick={() => setPublishConfirmModalOpen(true)}
                        >
                          Publish
                        </ActionMenuItem>
                      </ActionMenu>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="flex-end">
              {hasEditRights && isEditModeActive && (
                <>
                  <Sbutton
                    className="align-self-end my-3"
                    hidden={!isEditModeActive}
                    onClick={() => {
                      setSaveConfirmModalOpen(true);
                    }}
                  >
                    Save
                  </Sbutton>

                  <Sbutton
                    className="align-self-end ms-2 my-3"
                    hidden={!isEditModeActive}
                    variant="secondary"
                    onClick={() => {
                      setEditModeActive(false);
                      setInitialPatchValuesFromData();
                    }}
                  >
                    Cancel
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
          actionText={'Save'}
          cancelText={'Cancel'}
          performConfirmModalAction={performModalAction}
          heading={'Confirmation'}
          text1={ConfirmModalTexts.SAVE}
        />
        <ConfirmModal
          isVisible={isPublishConfirmModalOpen}
          actionName={'publish'}
          actionText={'Publish'}
          cancelText={'Cancel'}
          performConfirmModalAction={performModalAction}
          heading={'Confirmation'}
          text1={ConfirmModalTexts.PUBLISH1}
          text2={ConfirmModalTexts.PUBLISH2}
        />
      </div>
    </>
  );
}
