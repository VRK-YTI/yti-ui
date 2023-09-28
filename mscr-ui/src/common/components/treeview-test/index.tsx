import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TreeItem from '@mui/lab/TreeItem';
import {useEffect} from 'react';
import {Text} from 'suomifi-ui-components';
import MockupSchemaLoader from '../crosswalk-edit/schema-mockup';
import {cloneDeep} from 'lodash';
import {useBreakpoints} from 'yti-common-ui/components/media-query';
import TableRow from '@mui/material/TableRow';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {styled} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import AddLinkIcon from '@mui/icons-material/AddLink';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import JointListingAccordion from '@app/common/components/treeview-test/joint-listing-accordion';
import NodeInfo from '@app/common/components/treeview-test/tabs/crosswalk-info/node-info';
import { SearchInput } from 'suomifi-ui-components';
import SchemaTree from '@app/common/components/treeview-test/tabs/edit-crosswalk/schema-tree'

import {
    Button as Sbutton,
    InlineAlert,
    Modal,
    ModalContent,
    ModalFooter,
    ModalTitle,
    Paragraph,
} from 'suomifi-ui-components';
import {fetchCrosswalkData} from "@app/common/components/simple-api-service";
import callback from "@app/pages/api/auth/callback";

export default function TreeviewTest() {

    interface crosswalkConnection {
        source: string;
        target: string;
        sourceTitle: string;
        targetTitle: string;
        mappingType: string | undefined;
        notes: string | undefined;
        isSelected: boolean;
    }

    interface simpleNode {
        name: string;
        id: string;
    }

    const crosswalkConnectionInit = {
        source: '',
        target: '',
        sourceTitle: '',
        targetTitle: '',
        mappingType: '',
        notes: '',
        isSelected: false,
    };

    const emptyTree: any = [{
        id: '0',
        name: '',
        children: '',
    }];

    const fromTree = (nodes: any) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name} className='linked-tree-item'>
            {Array.isArray(nodes.children)
                ? nodes.children.map((node: any) => fromTree(node))
                : null}
        </TreeItem>
    );

    const emptyTreeTest = () => (
        <TreeItem key="0" nodeId="0" label="test"></TreeItem>
    );

    // STATE VARIABLES
    const [sourceTreeData, setSourceData] = React.useState<any>(emptyTree);
    const [sourceTreeExpanded, setExpanded] = React.useState<string[]>([]);
    const [sourceTreeSelectedArray, setSourceSelected] = React.useState<string[]>([]);
    const [sourceTreeSelectionTitle, setSourceSelectedTitle] = React.useState<string>('');

    const [targetTreeData, setTargetData] = React.useState<any>(emptyTree);
    const [targetTreeExpanded, setTargetExpanded] = React.useState<string[]>([]);
    const [targetTreeSelectedArray, setTargetSelected] = React.useState<string[]>([]);
    const [targetTreeSelectionTitle, setTargetSelectedTitle] = React.useState<string>('');

    const [currentlySelectedSource, setCurrentlySelectedSource] = React.useState<crosswalkConnection>(crosswalkConnectionInit);
    const [currentlySelectedTarget, setCurrentlySelectedTarget] = React.useState<crosswalkConnection>(crosswalkConnectionInit);

    const [connectedCrosswalks, setConnectedCrosswalks] = React.useState<crosswalkConnection[]>([crosswalkConnectionInit]);
    const [isAnySelectedLinked, setAnySelectedLinkedState] = React.useState<boolean>(false);
    const [isBothSelectedLinked, setBothSelectedLinkedState] = React.useState<boolean>(false);
    const [tabValue, setTabValue] = React.useState(0);

    const [crosswalksList, setCrosswalkList] = React.useState<string[]>([]);

    const crosswalkVisual: string[] = [];

    useEffect(() => {
        const sourceNode: crosswalkConnection = Object.assign({}, crosswalkConnectionInit);
        sourceNode.source = sourceTreeSelectedArray.toString();
        sourceNode.sourceTitle = sourceTreeSelectionTitle;
        const target = getJointEndNode(sourceTreeSelectedArray, true);
        sourceNode.targetTitle = target.name;
        sourceNode.target = target.id;

        const targetNode: crosswalkConnection = Object.assign({}, crosswalkConnectionInit);
        targetNode.source = targetTreeSelectedArray.toString();
        targetNode.sourceTitle = targetTreeSelectionTitle;
        const source = getJointEndNode(targetTreeSelectedArray, false);
        targetNode.targetTitle = source.name;
        targetNode.target = source.id;

        updateIsLinkedStatus(sourceNode, targetNode);
        setCurrentlySelectedSource(sourceNode);
        setCurrentlySelectedTarget(targetNode);
    }, [sourceTreeSelectedArray, targetTreeSelectedArray, connectedCrosswalks, crosswalksList, isAnySelectedLinked, isBothSelectedLinked]);


    // RENDER CROSSWALKS AFTER CHANGE
    useEffect(() => {
        renderCrosswalksList();
    }, [connectedCrosswalks]);

    // EXPAND TREES WHEN DATA LOADED
    useEffect(() => {
        handleExpandClick(true);
        handleExpandClick(false);
    }, [sourceTreeData]);

    function addOrRemoveJoint(add: boolean) {
        if (add) {
            setConnectedCrosswalks(crosswalkMappings => [...crosswalkMappings, {
                source: sourceTreeSelectedArray.toString(),
                target: targetTreeSelectedArray.toString(),
                sourceTitle: sourceTreeSelectionTitle,
                targetTitle: targetTreeSelectionTitle,
                mappingType: '',
                notes: '',
                isSelected: false
            }]);
        } else {
            removeJoint({
                source: sourceTreeSelectedArray.toString(),
                target: targetTreeSelectedArray.toString(),
                sourceTitle: sourceTreeSelectionTitle,
                targetTitle: targetTreeSelectionTitle,
                mappingType: '',
                notes: '',
                isSelected: false
            });
        }
    };

    function renderCrosswalksList() {
        connectedCrosswalks.forEach((item: crosswalkConnection) => {
            crosswalkVisual.push(item.sourceTitle, item.targetTitle);
            setCrosswalkList([...crosswalkVisual]);
        });
    }

    function updateIsLinkedStatus(source: crosswalkConnection, target: crosswalkConnection) {
        setAnySelectedLinkedState(source.target.length > 0 || target.target.length > 0);
        setBothSelectedLinkedState(source.target.length > 0 && source.target === target.source);
    }

    function getJointEndNode(nodes: string[], isSourceTree: boolean) {
        const ret: simpleNode = {name: '', id: ''};
        connectedCrosswalks.forEach(item => {
            if (isSourceTree) {
                if (item.source === nodes.toString()) {
                    ret.name = item.targetTitle;
                    ret.id = item.target;
                }
            } else if (item.target === nodes.toString()) {
                ret.name = item.sourceTitle;
                ret.id = item.source;
            }
        });
        return ret;
    }

    function getJointTitle(nodeIds: string[], isSourceTree: boolean) {
        const ret: string[] = [];
        connectedCrosswalks.forEach(item => {
            if (isSourceTree) {
                if (item.source === nodeIds[0].toString()) {
                    ret.push(item.sourceTitle);
                    ret.push(item.targetTitle);
                }
            } else if (item.target === nodeIds[0]) {
                ret.push(item.sourceTitle);
                ret.push(item.targetTitle);
            }
        });
        return ret;
    }

    function removeJoint(cc: crosswalkConnection) {
        const newCrosswalks = [...connectedCrosswalks.filter(item => {
            return ((item.target !== cc.target) || (item.source !== cc.source));
        })];
        setConnectedCrosswalks(() => [...newCrosswalks]);
    }

    function updateJointData(cc: crosswalkConnection) {
        const newCrosswalks = [...connectedCrosswalks.map(item => {
            if ((item.target === cc.target) && (item.source === cc.source)) {
                return (cloneDeep(cc));
            } else {
                return (item)
            }
            ;
        })];
        setConnectedCrosswalks(() => [...newCrosswalks]);
    }

    const handleTreeSourceSelect = (event: React.SyntheticEvent, nodeIds: any[], isSourceTree: boolean) => {
        if (isSourceTree){
            let name = '';
            sourceTreeData.forEach((item: { id: string; name: string; }) => {
                if (item.id === nodeIds.toString()){
                    name = item.name;
                }
            }
            );
            setSourceSelectedTitle(name);
            setSourceSelected(nodeIds);
        }
        else {
            let name = '';
            sourceTreeData.forEach((item: { id: string; name: string; }) => {
                    if (item.id === nodeIds.toString()){
                        name = item.name;
                    }
                }
            );
            setTargetSelectedTitle(name);
            setTargetSelected(nodeIds);
        }
    };

    const handleTreeToggle = (event: React.SyntheticEvent, nodeIds: string[], isSourceTree: boolean) => {
        if (isSourceTree) {
            setExpanded(nodeIds);
        } else {
            setTargetExpanded(nodeIds);
        }
    };

    const selectFromTree = (nodeId: string, isTargetTree: boolean) => {
        const nodeIds = [];
        nodeIds.push(nodeId);
        if (isTargetTree) {
            setTargetSelected(nodeIds);
            setTargetSelectedTitle(getJointTitle(nodeIds, false)[1]);
        } else {
            setSourceSelected(nodeIds);
            setSourceSelectedTitle(getJointTitle(nodeIds, true)[0]);
        }
        ;
    };

    const handleExpandClick = (isSourceTree: boolean) => {
        const retData: string[] = [];
        if (isSourceTree) {
           sourceTreeData.forEach((item: { children: string | any[], id: string }) => {
                if (item.children?.length > 0) {
                    retData.push(item.id.toString());
                }
            });
            setExpanded((oldExpanded) => {
                return oldExpanded.length === 0 ? retData : [];
            });
        } else {
            targetTreeData.forEach((item: { children: string | any[], id: string }) => {
                if (item.children?.length > 0) {
                    retData.push(item.id.toString());
                }
            });
            setTargetExpanded((oldExpanded) => {
                return oldExpanded.length === 0 ? retData : [];
            });
        }
    };

    const StyledTableCell = styled(TableCell)(({theme}) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({theme}) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    function saveCroswalk() {
    }

    function loadCroswalk() {
        fetchCrosswalkData('organizations').then(data => {
            setTargetData(MockupSchemaLoader(true));
            setSourceData(MockupSchemaLoader(true));
            setConnectedCrosswalks([]);
            clearSelections();
        });
    }

    function searchFromTree(input: any){
        setSourceData(MockupSchemaLoader(true));
        console.log(input);
        let sourceTreeDataNew: any;

        sourceTreeDataNew = sourceTreeData.map((elem: { name: string }) => {
            if (elem.name.includes(input.toString())) {
                elem.name = elem.name.toUpperCase();
                return elem;
            }
            else {return elem};
        });
        setSourceData(sourceTreeDataNew);
    }

    function clearSelections() {
        setSourceSelected([]);
        setTargetSelected([]);
        setSourceSelectedTitle('');
        setTargetSelectedTitle('');
    }

    const performCallbackFromAccordionAction = (joint: any, action: string, value: string) => {
        if (action === 'remove') {
            removeJoint(joint);
        } else if (action === 'addNotes') {
            joint.notes = value;
            updateJointData(joint);
        } else if (action === 'selectFromSourceTree') {
            selectFromTree(joint.source, false);
        } else if (action === 'selectFromTargetTree') {
            selectFromTree(joint.target, true);
        }
    };

    const performCallbackFromTreeAction = (isSourceTree: boolean, action: any, event: any, nodeIds: any) => {
        console.log('performing tree cb', action, event, nodeIds);
        if (action === 'handleSelect') {
            handleTreeSourceSelect(event, nodeIds, isSourceTree);
        } else if (action === 'treeToggle') {
            handleTreeToggle(event, nodeIds, isSourceTree);
        }

    }

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function CustomTabPanel(props: TabPanelProps) {
        const {children, value, index, ...other} = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{p: 3}}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const performNodeInfoAction = (nodeId: any, isSourceTree: boolean) => {
        selectFromTree(nodeId, isSourceTree);
    }

    return (
        <><Box className='mb-3' sx={{borderBottom: 1, borderColor: 'divider'}}>
            <Tabs value={tabValue} onChange={handleChange} aria-label="Category selection">
                <Tab label="Edit crosswalk" {...a11yProps(0)} />
                <Tab label="Crosswalk info" {...a11yProps(1)} />
                <Tab label="Version history" {...a11yProps(2)} />
            </Tabs>
        </Box>
{/*            <CustomTabPanel value={tabValue} index={0}>
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={2}>
            </CustomTabPanel>*/}
            <div className='row d-flex justify-content-between'>
                {/*  LEFT COLUMN */}
                <div className='col-8'>
                    <h5>Node information</h5>
                    {tabValue === 0 &&
                        <><Box sx={{height: 180, flexGrow: 1}}>
                            <NodeInfo isAnySelectedLinked={isAnySelectedLinked}
                                      isBothSelectedLinked={isBothSelectedLinked} sourceData={currentlySelectedSource}
                                      targetData={currentlySelectedTarget}
                                      performNodeInfoAction={performNodeInfoAction}></NodeInfo>
                        </Box><br/><h5>Node selection</h5>
                            <div className='row gx-0'>
                                {/*  SOURCE TREE */}
                                <div className='col-5 content-box px-0 mr-1'>
                                    <div className="d-flex justify-content-between mb-2 ps-3 pe-2">
                                        <h5>Source schema</h5>

                                        {/*<SearchInput
                                            labelText="Search from schema"
                                            searchButtonLabel="Search"
                                            clearButtonLabel="Clear"
                                            visualPlaceholder="Find an attribute..."
                                            onSearch={(value) => {searchFromTree(value)}}
                                        />*/}
                                        <IconButton onClick={() => handleExpandClick(true)}
                                                    aria-label="unlink"
                                                    color="primary" size="large">
                                            {sourceTreeExpanded.length === 0 ? <ExpandMoreIcon/> : <ExpandLessIcon/>}
                                        </IconButton>
                                    </div>

                                    <Box sx={{height: 400, flexGrow: 1, maxWidth: 700, overflowY: 'auto'}}>

                                        <SchemaTree nodes={sourceTreeData[0]}
    isSourceTree={true}
    treeSelectedArray={sourceTreeSelectedArray}
    treeExpanded={sourceTreeExpanded}
    performTreeAction={performCallbackFromTreeAction}
    />

                                    </Box>
                                </div>

                                {/*  ACTIONS */}
                                <div className='col-2'>

                                    <div className='d-flex align-content-center justify-content-center flex-column h-100'>
                                        <div className='d-flex justify-content-center'>
                                    <IconButton onClick={() => addOrRemoveJoint(!isBothSelectedLinked)}
                                                 className='actions-link-icon'
                                                 title={(!isBothSelectedLinked ? 'Link selected nodes' : 'Unlink selected nodes')}
                                                 aria-label={(!isBothSelectedLinked ? 'Link selected nodes' : 'Unlink selected nodes')}
                                                 color="primary" size="large"
                                                 disabled={isAnySelectedLinked && !isBothSelectedLinked || !(currentlySelectedSource.source.length > 0 && currentlySelectedTarget.source.length > 0)}>
                                        {isBothSelectedLinked ? <LinkOffIcon/> : <AddLinkIcon/>}
                                    </IconButton>
                                        </div>
                                    </div>

                                </div>

                                {/*  TARGET TREE */}
                                <div className='col-5 content-box px-0'>
                                    <div className="d-flex justify-content-between mb-2 ps-3 pe-2">
                                        <h5>Target schema</h5>
                                        <IconButton onClick={() => handleExpandClick(false)}
                                                    aria-label={(targetTreeExpanded.length === 0 ? 'Expand tree' : 'Collapse tree')}
                                                    color="primary" size="large">
                                            {targetTreeExpanded.length === 0 ? <ExpandMoreIcon/> : <ExpandLessIcon/>}
                                        </IconButton>
                                    </div>
                                    <Box sx={{height: 400, flexGrow: 1, maxWidth: 700, overflowY: 'auto'}}>
                                        <SchemaTree nodes={targetTreeData[0]}
    isSourceTree={false}
    treeSelectedArray={targetTreeSelectedArray}
    treeExpanded={targetTreeExpanded}
    performTreeAction={performCallbackFromTreeAction}
    />
                                    </Box>
                                </div>
                            </div>
                        </>
                    }
                </div>

                {/*  RIGHT COLUMN */}
                <div className='col-4'>
                    <h5>Linked nodes</h5>
                    <div className='joint-listing-accordion-wrap'>
                    <Box className='mb-4' sx={{height: 640, flexGrow: 1, maxWidth: 700, overflowY: 'auto'}}>
                    <JointListingAccordion crosswalkJoints={connectedCrosswalks}
                                           performAccordionAction={performCallbackFromAccordionAction}></JointListingAccordion>
                    </Box>
                    </div>
                        <div className='row d-flex flex-row pb-4 justify-content-end px-4'>
                            <div className='col-4'><Sbutton onClick={() => {
                                loadCroswalk();
                            }}>Load</Sbutton>
                            </div>
                            <div className='col-4'><Sbutton onClick={() => {
                                loadCroswalk();
                            }}>Save</Sbutton>
                            </div>
                            <div className='col-4'><Sbutton onClick={() => {
                                saveCroswalk();
                            }}>Publish</Sbutton>
                            </div>
                        </div>
                </div>
            </div>
            <hr></hr>
        </>
    );
}
