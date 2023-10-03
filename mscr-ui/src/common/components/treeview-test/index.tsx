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
import {RenderTree, CrosswalkConnection} from "@app/common/interfaces/crosswalk-connection.interface";

export default function TreeviewTest() {
    interface simpleNode {
        name: string | undefined;
        id: string;
    }

    const crosswalkConnectionInit: CrosswalkConnection = {
        description: undefined,
        isSelected: false,
        mappingType: undefined,
        notes: undefined,
        parentId: '',
        parentName: undefined,
        source: "",
        sourceTitle: undefined,
        sourceType: undefined,
        target: "",
        targetTitle: undefined,
        targetType: undefined,
        type: undefined
    }

    const emptyTree: any = [{
        id: '0',
        name: '',
        children: '',
    }];

    const emptyTreeSelection: RenderTree = {
        jsonPath: "",
        children: [],
        description: '',
        id: '',
        idNumeric: 0,
        isLinked: false,
        isMappable: '',
        name: '',
        required: '',
        parentName: '',
        parentId: 0,
        title: '',
        type: ''
    }

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
    const [sourceTreeData, setSourceData] = React.useState<any>(MockupSchemaLoader(true));
    const [sourceTreeExpanded, setExpanded] = React.useState<string[]>([]);
    const [sourceTreeSelectedArray, selectFromSourceTreeByIds] = React.useState<string[]>([]);
    const [sourceTreeSelection, setSourceSelection] = React.useState<RenderTree>(emptyTreeSelection);

    const [targetTreeData, setTargetData] = React.useState<any>(MockupSchemaLoader(true));
    const [targetTreeExpanded, setTargetExpanded] = React.useState<string[]>([]);
    const [targetTreeSelectedArray, selectFromTargetTreeByIds] = React.useState<string[]>([]);
    const [targetTreeSelection, setTargetSelection] =  React.useState<RenderTree>(emptyTreeSelection);

    const [currentlySelectedSource, setCurrentlySelectedSource] = React.useState<CrosswalkConnection>(crosswalkConnectionInit);
    const [currentlySelectedTarget, setCurrentlySelectedTarget] = React.useState<CrosswalkConnection>(crosswalkConnectionInit);

    const [connectedCrosswalks, setConnectedCrosswalks] = React.useState<CrosswalkConnection[] | []>([]);
    const [isAnySelectedLinked, setAnySelectedLinkedState] = React.useState<boolean>(false);
    const [isBothSelectedLinked, setBothSelectedLinkedState] = React.useState<boolean>(false);
    const [tabValue, setTabValue] = React.useState(0);

    const [crosswalksList, setCrosswalkList] = React.useState<string[]>([]);

    const crosswalkVisual: string[] = [];

    useEffect(() => {
        // USED BY NODE INFO BOX SOURCE
        const sourceNode: CrosswalkConnection = Object.assign({}, crosswalkConnectionInit);
        sourceNode.source = sourceTreeSelectedArray.toString();
        sourceNode.sourceTitle = sourceTreeSelection.name;
        sourceNode.parentId = sourceTreeSelection.parentId;
        sourceNode.parentName = sourceTreeSelection.parentName;
        sourceNode.description = sourceTreeSelection.description;
        sourceNode.type = sourceTreeSelection.type;
        const target = getJointEndNode(sourceTreeSelectedArray, true);
        sourceNode.targetTitle = target.name;
        sourceNode.target = target.id;

        // USED BY NODE INFO BOX TARGET
        const targetNode: CrosswalkConnection = Object.assign({}, crosswalkConnectionInit);
        targetNode.source = targetTreeSelectedArray.toString();
        targetNode.sourceTitle = targetTreeSelection.name;
        targetNode.parentId = targetTreeSelection.parentId;
        targetNode.description = targetTreeSelection.description;
        targetNode.type = targetTreeSelection.type;
        const source = getJointEndNode(targetTreeSelectedArray, false);
        targetNode.targetTitle = source.name;
        targetNode.target = source.id;

        updateIsLinkedStatus(sourceNode, targetNode);
        setCurrentlySelectedSource(sourceNode);
        setCurrentlySelectedTarget(targetNode);
    }, [sourceTreeSelectedArray, targetTreeSelectedArray, connectedCrosswalks, crosswalksList]);


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
                description: undefined,
                isSelected: false,
                mappingType: undefined,
                notes: undefined,
                source: sourceTreeData[parseInt(sourceTreeSelectedArray.toString())].id,
                sourceTitle: sourceTreeData[parseInt(sourceTreeSelectedArray.toString())].name,
                parentName: sourceTreeData[parseInt(sourceTreeSelectedArray.toString())].parentName,
                parentId: sourceTreeData[parseInt(sourceTreeSelectedArray.toString())].parentId,
                sourceType: sourceTreeData[parseInt(sourceTreeSelectedArray.toString())].sourceType,
                targetType: sourceTreeData[parseInt(sourceTreeSelectedArray.toString())].targetType,
                target: targetTreeData[parseInt(targetTreeSelectedArray.toString())].id,
                targetTitle: targetTreeData[parseInt(targetTreeSelectedArray.toString())].name,
                type: sourceTreeData[parseInt(sourceTreeSelectedArray.toString())].type,
            }]);
        } else {
            removeJoint({
                source: sourceTreeSelectedArray.toString(),
                target: targetTreeSelectedArray.toString(),
                sourceTitle: undefined,
                targetTitle: undefined,
                sourceType: undefined,
                targetType: undefined,
                parentName: '',
                parentId: '',
                mappingType: '',
                notes: '',
                isSelected: false,
                description: undefined,
                type: undefined
            });
        }
    };

    function renderCrosswalksList() {
        connectedCrosswalks.forEach((item: CrosswalkConnection) => {
            //crosswalkVisual.push(item.sourceTitle, item.targetTitle);
            setCrosswalkList([...crosswalkVisual]);
        });
    }

    function updateIsLinkedStatus(source: CrosswalkConnection, target: CrosswalkConnection) {
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

    function getJointNodes(nodeIds: string[], isSourceTree: boolean) {
        const ret: CrosswalkConnection[] = [];
        connectedCrosswalks.forEach(item => {
            if (isSourceTree) {
                if (item.source === nodeIds[0].toString()) {
                    ret.push(item);
                }
            } else if (item.target === nodeIds[0].toString()) {
                ret.push(item);
            }
        });
        return ret;
    }

    function removeJoint(cc: CrosswalkConnection) {
        const newCrosswalks = [...connectedCrosswalks.filter(item => {
            return ((item.target !== cc.target) || (item.source !== cc.source));
        })];
        setConnectedCrosswalks(() => [...newCrosswalks]);
    }

    function updateJointData(cc: CrosswalkConnection) {
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

    const handleTreeSelect = (event: React.SyntheticEvent | undefined, nodeIds: any[], isSourceTree: boolean) => {
        let newTreeSelection: RenderTree = cloneDeep(emptyTreeSelection);
        if (isSourceTree) {
            sourceTreeData.forEach((item: RenderTree) => {
                if (item.id === nodeIds.toString()){
                    newTreeSelection = cloneDeep(item);
                }
            });
            setSourceSelection(newTreeSelection);
            selectFromSourceTreeByIds(nodeIds);
        }
        else {
            targetTreeData.forEach((item: RenderTree) => {
                if (item.id === nodeIds.toString()){
                    newTreeSelection = cloneDeep(item);
                }
            });
            setTargetSelection(newTreeSelection);
            selectFromTargetTreeByIds(nodeIds);
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
            selectFromTargetTreeByIds(nodeIds);
            const targetObj = cloneDeep(emptyTreeSelection);
            const targetNode = getJointNodes(nodeIds, false);
            targetObj.name = targetNode[0].targetTitle ? targetNode[0].targetTitle : '';
            setTargetSelection(targetObj)
        } else {
            selectFromSourceTreeByIds(nodeIds);
            const sourceObj = cloneDeep(emptyTreeSelection);
            const sourceNode = getJointNodes(nodeIds, true);
            sourceObj.name = sourceNode[0].sourceTitle ? sourceNode[0].sourceTitle : '';
            setSourceSelection(sourceObj)
        }
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
        selectFromSourceTreeByIds([]);
        selectFromTargetTreeByIds([]);
        setSourceSelection(emptyTreeSelection);
        setTargetSelection(emptyTreeSelection);
    }

    const performCallbackFromAccordionAction = (joint: any, action: string, value: string) => {
        if (action === 'remove') {
            removeJoint(joint);
        } else if (action === 'addNotes') {
            joint.notes = value;
            updateJointData(joint);
        } else if (action === 'selectFromSourceTree') {
            //TODO: refactor to use handleTreeSelect for selections. Now loses selection types.

            //handleTreeSelect(undefined, joint.source, true);
            selectFromTree(joint.source, false);
        } else if (action === 'selectFromTargetTree') {
            //handleTreeSelect(undefined, joint.source, false);
            selectFromTree(joint.target, true);
        }
    };

    const performCallbackFromTreeAction = (isSourceTree: boolean, action: any, event: any, nodeIds: any) => {
        if (action === 'handleSelect') {
            handleTreeSelect(event, nodeIds, isSourceTree);
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
                    {tabValue === 0 &&
                        <><h5>Node information</h5>
                            <Box sx={{height: 180, flexGrow: 1}}>
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
                        {/* <div className='col-4'><Sbutton onClick={() => {
                                loadCroswalk();
                            }}>Load</Sbutton>
                            </div>*/}
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
