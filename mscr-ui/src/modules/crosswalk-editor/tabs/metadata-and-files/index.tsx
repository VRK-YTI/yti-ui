import {NodeMapping} from '@app/common/interfaces/crosswalk-connection.interface';
import {Dropdown, Textarea, TextInput} from 'suomifi-ui-components';
import {useEffect, useState} from 'react';
import FixedButtonFooter, {FooterTypes} from '@app/common/components/fixed-button-footer';
import { DropdownItem } from 'suomifi-ui-components';

interface patchPayload {
    label: string;
    description: string;
    contact: string;
    versionLabel: string;
    visibility: string;
    [key: string]: string | string[];
}

export default function MetadataAndFiles(props: { crosswalkData: any; performMetadataAndFilesAction: any; nodeMappings: NodeMapping[]; crosswalkId: string; isAdmin: boolean}) {
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
            key: 'PUBLIC'
        },
        {
            name: 'PRIVATE',
            key: 'PRIVATE'
        },
    ];

    const [unformattedPayload, setUnformattedPayload] = useState(patchPayloadInit);
    const [lang, setLanguage] = useState('en');
    const [isEditModeActive, setEditModeActive] = useState<boolean>(false);
    const [isPublished, setIsPublished] = useState<boolean>(true);
    const [visibilityState, setVisibilityState] = useState<string>('PRIVATE');

    function saveChanges() {
        props.performMetadataAndFilesAction(formatPatchValuesForSave(false), 'saveChanges');
        setEditModeActive(false);
    }

    function publish() {
        props.performMetadataAndFilesAction(formatPatchValuesForSave(true), 'saveChanges');
        setEditModeActive(false);
    }

    function updateVisibilityState(state: string) {
        setVisibilityState(state);
        updatePatchValue('visibility', state);
    }

    function updatePatchValue(attributeName: string, value: any) {
        const val = value === undefined ? '' : value.toString();
        const newPayload = {...unformattedPayload};
        newPayload[attributeName] = val;
        setUnformattedPayload(newPayload);
    };

    function updateValuesOnInit(prevAttributes: any, attributeName: string, value: any) {
        const val = value === undefined ? '' : value.toString();
        const allPatchAttributes = {...prevAttributes};
        allPatchAttributes[attributeName] = val;
        setUnformattedPayload(allPatchAttributes);
        return allPatchAttributes;
    };

    function performFooterActionCallback(action: string) {
        if (action === 'save') {
            saveChanges();
        }
        if (action === 'publish') {
            publish();
        }
        if (action === 'setEditModeActive') {
            setEditModeActive(true);
        }
        if (action === 'setEditModeInactive') {
            setEditModeActive(false);
        }
        if (action === 'cancel') {
            setEditModeActive(false);
            setInitialPatchValuesFromData();
        }
    }

    function detectLanguage() {
        if (props.crosswalkData?.label['fi']) {
            setLanguage('fi');
        }
    }

    useEffect(() => {
        detectLanguage();
        setInitialPatchValuesFromData();
        setIsPublished(props.crosswalkData.state === 'PUBLISHED');
        setVisibilityState(props.crosswalkData.visibility);
    }, [props.crosswalkData]);

    function setInitialPatchValuesFromData() {
        const newPayload = {...unformattedPayload};
        if (props.crosswalkData) {
            for (const [key, value] of Object.entries(valuesToPatch)) {
                if (value === true) {
                    newPayload[key] = props.crosswalkData[key]?.[lang];
                } else {
                    newPayload[key] = props.crosswalkData[key] ? props.crosswalkData[key] : '';
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
                    const locObj = {[key]: {[lang]: value}};
                    formattedPatchPayload.push(locObj);
                }
                else {
                    const obj = {[key]: value};
                    formattedPatchPayload.push(obj);
                }
            }
            if (isPublishAction){
                formattedPatchPayload.push({
                    state: 'PUBLISHED'
                });
            }
            return formattedPatchPayload;
        }
    }

    return (<>
        <div className='crosswalk-editor node-mappings mx-2'>
            <h2 className='mt-4 mb-3'>Crosswalk details</h2>
            <div className='row d-flex justify-content-between metadata-and-files-wrap mx-2'>
                <div className='row bg-lightest-blue'>
                    <div className='col-6 gx-0'>
                        <div className='my-2 row'>
                            <div className='col-4 row-heading'>Crosswalk name:</div>
                            <div className='col-8'>
                                {isEditModeActive &&
                                  <TextInput
                                    labelText=''
                                    onChange={(value) => updatePatchValue('label', value)}
                                    value={unformattedPayload.label.toString()}
                                  />
                                }
                                {!isEditModeActive && <div className='row-label'>{props.crosswalkData?.label[lang]}</div>
                                }
                            </div>
                        </div>

                        <div className='my-3 row'>
                            <div className='col-4 row-heading'>Version label:</div>
                            <div className='col-8'>
                                {isEditModeActive &&
                                  <TextInput
                                    labelText=''
                                    onChange={(value) => updatePatchValue('versionLabel', value)}
                                    value={unformattedPayload.versionLabel.toString()}
                                  />
                                }
                                {!isEditModeActive && <div className='row-label'>{props.crosswalkData?.versionLabel}</div>
                                }
                            </div>
                        </div>

                        <div className='my-3 row'>
                            <div className='col-4 row-heading'>Contact:</div>
                            <div className='col-8'>
                                {isEditModeActive &&
                                  <TextInput
                                    labelText=''
                                    onChange={(value) => updatePatchValue('contact', value)}
                                    value={unformattedPayload.contact.toString()}
                                  />
                                }
                                {!isEditModeActive && <div className='row-label'>{props.crosswalkData?.contact}</div>
                                }
                            </div>
                        </div>

                        <div className='my-3 row'>
                            <div className='col-4 row-heading'>Pid:</div>
                            <div className='col-8'>
                                <div className='row-label'>{props.crosswalkData?.pid}</div>
                            </div>
                        </div>

                        <div className='my-3 row'>
                            <div className='col-4 row-heading'>Created:</div>
                            <div className='col-8'>
                                <div className='row-label'>{props.crosswalkData?.created}</div>
                            </div>
                        </div>

                        <div className='my-3 row'>
                            <div className='col-4 row-heading'>Modified:</div>
                            <div className='col-8'>
                                <div className='row-label'>{props.crosswalkData?.modified}</div>
                            </div>
                        </div>

                        <div className='my-3 row'>
                            <div className='col-4 row-heading'>State:</div>
                            <div className='col-8'>
                                <div className='row-label'>{props.crosswalkData?.state}</div>
                            </div>
                        </div>

                        <div className='my-3 row'>
                            <div className='col-4 row-heading'>Visibility:</div>
                            <div className='col-8'>
                                {isEditModeActive &&
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
                                }
                                {!isEditModeActive && <div className='row-label'>{props.crosswalkData?.visibility}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='col-1'></div>
                    <div className='col-5'>
                        <div className='mt-2'>
                            <div className='row-heading'>Description:</div>
                            {isEditModeActive &&
                              <Textarea
                                labelText=""
                                hintText=""
                                resize="vertical"
                                onChange={(event) => updatePatchValue('description', event.target.value)}
                                value={unformattedPayload.description}
                              >
                              </Textarea>}
                            {!isEditModeActive && <div>{unformattedPayload.description}</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            {/*<h2 className='mt-4 mb-3'>Files</h2>*/}
            <div className='row d-flex justify-content-between metadata-and-files-wrap mx-2'>
                <br/>

                <div></div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            {/*             <h2 className='mt-4 mb-3'>Crosswalk summary</h2>

           <div className='row d-flex justify-content-between metadata-and-files-wrap mx-2'>
                <JointListingAccordion nodeMappings={props.nodeMappings} viewOnlyMode={true} isEditModeActive={false}
                                       performAccordionAction={performAccordionAction}></JointListingAccordion>
            </div>*/}

        </div>
        {props.isAdmin &&
          <FixedButtonFooter footerType={FooterTypes.CROSSWALK_METADATA} isEditModeActive={true}
                             performFooterActionCallback={performFooterActionCallback}
                             isPublished={isPublished}></FixedButtonFooter>
        }
    </>);
}
