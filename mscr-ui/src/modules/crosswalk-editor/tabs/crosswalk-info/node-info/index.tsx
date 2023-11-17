import Button from '@mui/material/Button';
import {
    CrosswalkConnection,
    CrosswalkConnectionsNew,
    RenderTree
} from '@app/common/interfaces/crosswalk-connection.interface';
import EastIcon from '@mui/icons-material/East';
import {Dropdown} from 'suomifi-ui-components';
import {DropdownItem} from 'suomifi-ui-components';
import {useState, useEffect} from 'react';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import {InfoIcon} from '@app/common/components/shared-icons';

export default function NodeInfo(props: { isAnySelectedLinked: boolean; isBothSelectedLinked: boolean; sourceData: RenderTree[]; targetData: RenderTree[]; isSourceTree: boolean; performNodeInfoAction: any }) {
    let sourceSelectionInit = '';
    let targetSelectionInit = '';

    useEffect(() => {
        if (props.sourceData && props.sourceData.length > 0) {
            sourceSelectionInit = props.sourceData[0].id;
            setSourceDropdownValue(props.sourceData[0].id);
            console.log('props.sourceData');
        }
        if (props.targetData && props.targetData.length > 0) {
            targetSelectionInit = props.targetData[0].id;
            setTargetDropdownValue(props.targetData[0].id);
        }
    }, [props]);

    const [sourceDropdownValue, setSourceDropdownValue] = useState(sourceSelectionInit);
    const [targetDropdownValue, setTargetDropdownValue] = useState(targetSelectionInit);
    const [selectedSource] = props.sourceData.filter(item => item.id === sourceDropdownValue);
    const [selectedTarget] = props.targetData.filter(item => item.id === targetDropdownValue);

    let sourceDropdownInit: any = [
        {
            id: '1'
        },
    ];
    if (props.sourceData && props.sourceData.length > 0) {
        sourceDropdownInit = props.sourceData;
    }
    let targetDropdownInit: any = [
        {
            id: '1'
        },
    ];
    if (props.targetData && props.targetData.length > 0) {
        targetDropdownInit = props.targetData;
    }

    const schemaAttributes = ['description'];

    interface constantAttribute {
        name: string;
        title: string | undefined;
    }

    const foundSourceKeywords: constantAttribute[] = [];
    if (props.sourceData.length > 0) {
        // @ts-ignore
        props.sourceData[0]?.children.forEach(item => {
            schemaAttributes.forEach(scAtt => {
                if (Object.prototype.hasOwnProperty.call(item, scAtt)) {
                    const attrib: constantAttribute = {
                        name: item.name, title: item['title'] === '' ? 'complex' : item['title'],
                    };
                    foundSourceKeywords.push(attrib);
                }
            });
        });
    }

    const foundTargetKeywords: constantAttribute[] = [];
    if (props.sourceData.length > 0) {
        // @ts-ignore
        props.targetData[0]?.children.forEach(item => {
            schemaAttributes.forEach(scAtt => {
                if (Object.prototype.hasOwnProperty.call(item, scAtt)) {
                    const attrib: constantAttribute = {
                        name: item.name, title: item['title'] === '' ? 'complex' : item['title'],
                    };
                    foundTargetKeywords.push(attrib);
                }
            });
        });
    }

    function processHtmlLinks(input: string | undefined) {
        if (input && input.startsWith('http://' || 'https://')) {
            return (<a href={input} target="_blank" rel="noreferrer">{input}</a>);
        }
        return input;
    }


    return (<>
        <div className='row d-flex justify-content-between node-info-box'>
            <h2>Selected node info</h2>

            {/*  SOURCE NODE */}

            {props.isSourceTree && (
                <div className='col flex-column d-flex justify-content-between side-bar-wrap'>
                    <div className='mb-2'>

                    </div>
                    <Box className='bg-wrap' sx={{height: 440, flexGrow: 1, maxWidth: 400, overflowY: 'auto'}}>
                        {props.sourceData.length < 1 && <>
                            <div className='row gx-1'>
                                <div className='col-2 d-flex'>
                                    <div className='pt-1 ms-1'><InfoIcon></InfoIcon></div>
                                </div>
                                <div className='col-10'>
                                    <div>Nothing to show just now. Select an entity to view information.</div>
                                </div>
                            </div>
                        </>}
                        {props.sourceData.length > 1 &&
                            <div className='dropdown-wrap'>
                                <Dropdown className='mt-2 node-info-dropdown'
                                          visualPlaceholder="Source node(s) not selected"
                                          value={sourceDropdownValue}
                                          onChange={(newValue) => setSourceDropdownValue(newValue)}
                                >
                                    {sourceDropdownInit.map((rt) => (
                                        <DropdownItem key={rt.id} value={rt.id}>
                                            {rt.name}
                                        </DropdownItem>
                                    ))}
                                </Dropdown>
                            </div>
                        }
                        <div>
                            <div className='row'>
                                {props.sourceData.length > 1 &&
                                    <>
                                        <div className='col-12'>
                                            <div>Selected node:</div>
                                            <div className='attribute-font'>{selectedSource?.name}</div>
                                        </div>

                                        <div className='col-12'>
                                            <div>jsonPath:</div>
                                            <div className='attribute-font'>{selectedSource?.jsonPath}</div>
                                        </div>
                                    </>
                                }

                                {foundSourceKeywords.length < 1 &&
                                    // Node is a leaf level node so show inferred properties
                                    <>
                                        {selectedSource?.title &&
                                            <div className='col-12'>
                                                <div>title:</div>
                                                <div className='attribute-font'>{processHtmlLinks(selectedSource?.title)}</div>
                                            </div>
                                        }
                                        {selectedSource?.type &&
                                            <div className='col-12'>
                                                <div>type:</div>
                                                <div className='attribute-font'>{processHtmlLinks(selectedSource?.type)}</div>
                                            </div>
                                        }
                                        {selectedSource?.description &&
                                            <div className='col-12'>
                                                <div>description:</div>
                                                <div className='attribute-font'>{processHtmlLinks(selectedSource?.description)}</div>
                                            </div>
                                        }
                                    </>
                                }

                                {foundSourceKeywords.map(attrib => (
                                    <div className='col-12'>
                                        <div className=''>{processHtmlLinks(attrib.name)}:</div>
                                        <div className='attribute-font'>{processHtmlLinks(attrib.title)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Box>
                </div>
            )}

            {/* TARGET NODE */}
            {!props.isSourceTree && (
                <div className='col flex-column d-flex justify-content-between side-bar-wrap'>
                    <div className='mb-2'>

                    </div>
                    <Box className='bg-wrap' sx={{height: 440, flexGrow: 1, maxWidth: 400, overflowY: 'auto'}}>
                        {props.targetData.length < 1 && <>
                            <div className='row gx-1'>
                                <div className='col-2 d-flex'>
                                    <div className='pt-1 ms-1'><InfoIcon></InfoIcon></div>
                                </div>
                                <div className='col-10'>
                                    <div>Nothing to show just now. Select an entity to view information.</div>
                                </div>
                            </div>
                        </>}
                        {props.targetData.length > 1 &&
                            <div className='dropdown-wrap'>
                                <Dropdown className='mt-2 node-info-dropdown'
                                          visualPlaceholder="Source node(s) not selected"
                                          value={sourceDropdownValue}
                                          onChange={(newValue) => setSourceDropdownValue(newValue)}
                                >
                                    {targetDropdownInit.map((rt) => (
                                        <DropdownItem key={rt.id} value={rt.id}>
                                            {rt.name}
                                        </DropdownItem>
                                    ))}
                                </Dropdown>
                            </div>
                        }
                        <div>
                            <div className='row'>
                                {props.targetData.length > 1 &&
                                    <>
                                        <div className='col-12'>
                                            <div>Selected node:</div>
                                            <div className='attribute-font'>{selectedTarget?.name}</div>
                                        </div>

                                        <div className='col-12'>
                                            <div>jsonPath:</div>
                                            <div className='attribute-font'>{selectedTarget?.jsonPath}</div>
                                        </div>
                                    </>
                                }

                                {foundTargetKeywords.length < 1 &&
                                    // Node is a leaf level node so show inferred properties
                                    <>
                                        {selectedTarget?.title &&
                                            <div className='col-12'>
                                                <div>title:</div>
                                                <div className='attribute-font'>{processHtmlLinks(selectedTarget?.title)}</div>
                                            </div>
                                        }
                                        {selectedTarget?.type &&
                                            <div className='col-12'>
                                                <div>type:</div>
                                                <div className='attribute-font'>{processHtmlLinks(selectedTarget?.type)}</div>
                                            </div>
                                        }
                                        {selectedTarget?.description &&
                                            <div className='col-12'>
                                                <div>description:</div>
                                                <div className='attribute-font'>{processHtmlLinks(selectedTarget?.description)}</div>
                                            </div>
                                        }
                                    </>
                                }

                                {foundTargetKeywords.map(attrib => (
                                    <div className='col-12'>
                                        <div className=''>{processHtmlLinks(attrib.name)}:</div>
                                        <div className='attribute-font'>{processHtmlLinks(attrib.title)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Box>
                </div>
            )}
        </div>
    </>);
}