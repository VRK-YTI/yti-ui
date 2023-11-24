import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TreeItem from '@mui/lab/TreeItem';
import { useEffect } from 'react';
import { Text } from 'suomifi-ui-components';
import MockupSchemaLoader, {
  getFilterFunctions,
} from '../crosswalk-editor/schema-mockup';
import { cloneDeep } from 'lodash';
import { useBreakpoints } from 'yti-common-ui/components/media-query';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import AddLinkIcon from '@mui/icons-material/AddLink';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import JointListingAccordion from '@app/modules/crosswalk-editor/joint-listing-accordion';
import MetadataAndFiles from '@app/modules/crosswalk-editor/tabs/metadata-and-files';
import NodeInfo from '@app/modules/crosswalk-editor/tabs/crosswalk-info/node-info';
import { SearchInput } from 'suomifi-ui-components';
import SchemaTree from '@app/modules/crosswalk-editor/tabs/edit-crosswalk/schema-tree';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import {
  Button as Sbutton,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
} from 'suomifi-ui-components';
import { fetchCrosswalkData } from '@app/common/components/simple-api-service';
import callback from '@app/pages/api/auth/callback';
import {
  RenderTree,
  CrosswalkConnection,
  CrosswalkConnectionNew,
  CrosswalkConnectionsNew,
} from '@app/common/interfaces/crosswalk-connection.interface';
import NodeMappingsModal from './tabs/node-mappings';
import LinkIcon from '@app/common/components/shared-icons';

export default function CrosswalkEditor() {
  interface simpleNode {
    name: string | undefined;
    id: string;
  }

  const emptyTreeSelection: RenderTree = {
    idNumeric: 0,
    id: '',
    name: '',
    isLinked: false,
    title: '',
    type: '',
    description: '',
    required: '',
    isMappable: '',
    parentName: '',
    jsonPath: '',
    parentId: 0,
    children: [],
  };

  const crosswalkConnectionInit: CrosswalkConnection = {
    sourceDescription: undefined,
    isSelected: false,
    mappingType: undefined,
    notes: undefined,
    parentId: '',
    parentName: undefined,
    source: '',
    sourceTitle: undefined,
    sourceType: undefined,
    target: '',
    targetTitle: undefined,
    targetType: undefined,
    type: undefined,
  };

  const crosswalkConnectionNewInit: CrosswalkConnectionNew = {
    source: emptyTreeSelection,
    target: emptyTreeSelection,
    id: '0',
    description: '',
    isSelected: false,
    isDraft: false,
    sourceJsonPath: undefined,
    targetJsonPath: undefined,
    sourcePredicate: undefined,
    sourceProcessing: undefined,
    targetPredicate: undefined,
    targetProcessing: undefined,
  };

  const crosswalkConnectionsNewInit: CrosswalkConnectionsNew = {
    source: [emptyTreeSelection],
    target: [emptyTreeSelection],
    id: '0',
    description: '',
  };

  const emptyTree: any = [
    {
      id: '0',
      name: '',
      children: '',
    },
  ];

  const fromTree = (nodes: any) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      className="linked-tree-item"
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node: any) => fromTree(node))
        : null}
    </TreeItem>
  );

  const emptyTreeTest = () => (
    <TreeItem key="0" nodeId="0" label="test"></TreeItem>
  );

  // STATE VARIABLES
  const inputData: RenderTree[] = [];
  const [isSourceDataLoading, setSourceDataLoading] =
    React.useState<boolean>(false);
  const [isSourceDataFetched, setSourceDataFetched] =
    React.useState<boolean>(false);
  const [mockSourceData, setMockSourceData] = React.useState<
    RenderTree[] | undefined
  >([emptyTreeSelection]);

  if (!isSourceDataLoading) {
    setSourceDataLoading(true);
    MockupSchemaLoader(true).then((res) => {
      setMockSourceData(res);
      if (res) {
        setSourceData(res);
        setTargetData(res);
        // Used for storing fil
        setSourceDataOriginal(res);
        setTargetDataOriginal(res);
        setSourceDataFetched(true);
      }
    });

    getFilterFunctions().then((res) => {
      if (res) {
        setFilterFunctions(res);
      }
    });
  }

  const [sourceTreeDataOriginal, setSourceDataOriginal] =
    React.useState<RenderTree[]>(inputData);
  const [sourceTreeData, setSourceData] =
    React.useState<RenderTree[]>(inputData);
  const [sourceTreeExpanded, setSourceExpanded] = React.useState<string[]>([]);
  const [sourceTreeSelectedArray, selectFromSourceTreeByIds] = React.useState<
    string[]
  >([]);

  const [targetTreeDataOriginal, setTargetDataOriginal] =
    React.useState<RenderTree[]>(inputData);
  const [targetTreeData, setTargetData] =
    React.useState<RenderTree[]>(inputData);
  const [targetTreeExpanded, setTargetExpanded] = React.useState<string[]>([]);
  const [targetTreeSelectedArray, selectFromTargetTreeByIds] = React.useState<
    string[]
  >([]);

  const [selectedSourceNodes, setSelectedSourceNodes] = React.useState<
    RenderTree[]
  >([emptyTreeSelection]);
  const [selectedTargetNodes, setSelectedTargetNodes] = React.useState<
    RenderTree[]
  >([emptyTreeSelection]);

  const [connectedCrosswalksNew, setConnectedCrosswalksNew] = React.useState<
    CrosswalkConnectionNew[]
  >([]);
  const [jointToBeEdited, setJointToBeEdited] =
    React.useState<CrosswalkConnectionNew>(crosswalkConnectionNewInit);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  const [connectedCrosswalksNew2, setConnectedCrosswalksNew2] = React.useState<
    CrosswalkConnectionsNew[] | []
  >([]);

  const [isAnySelectedLinked, setAnySelectedLinkedState] =
    React.useState<boolean>(false);
  const [isBothSelectedLinked, setBothSelectedLinkedState] =
    React.useState<boolean>(false);
  const [linkingError, setLinkingError] = React.useState<string>('');
  const [selectedTab, setSelectedTab] = React.useState(1);
  const [nodeMappingsModalOpen, setNodeMappingsModalOpen] =
    React.useState<boolean>(false);

  const [filterFunctions, setFilterFunctions] = React.useState<any[]>([]);

  const [crosswalksList, setCrosswalkList] = React.useState<string[]>([]);

  const [isEditModeActive, setEditModeActive] = React.useState<boolean>(true);

  useEffect(() => {
    console.log('########## GOT FILTER FUNCTIONS', filterFunctions);
  }, [filterFunctions]);

  useEffect(() => {
    setNodeMappingsModalOpen(true);
  }, [jointToBeEdited]);

  // RESET EDITED JOINT VALUE IF MODAL NEEDS TO BE RE OPENED
  useEffect(() => {
    setJointToBeEdited(undefined);
  }, [nodeMappingsModalOpen]);

  // EXPAND TREES WHEN DATA LOADED
  useEffect(() => {
    setExpanded(true);
  }, [sourceTreeData]);

  useEffect(() => {
    setExpanded(false);
  }, [targetTreeData]);

  useEffect(() => {
    // USED BY NODE INFO BOX SOURCE
    setSelectedSourceNodes(getTreeNodesById(sourceTreeSelectedArray, true));

    // USED BY NODE INFO BOX TARGET
    setSelectedTargetNodes(getTreeNodesById(targetTreeSelectedArray, false));

    //updateIsLinkedStatus(sourceNode, targetNode);
    //setSelectedSourceNodes(sourceNode);
  }, [
    sourceTreeSelectedArray,
    targetTreeSelectedArray,
    connectedCrosswalksNew,
    crosswalksList,
  ]);

  // USED BY LINK BUTTON STATE
  useEffect(() => {
    updateSelectionErrors();
  }, [selectedSourceNodes, selectedTargetNodes]);

  function addJoint(add: boolean) {
    if (add) {
      //TODO: check already linked
      const jointsToBeAdded: CrosswalkConnectionNew[] = [];
      let lastJointId = '';
      selectedSourceNodes.forEach((sourceNode) => {
        lastJointId = sourceNode.id + '.' + selectedTargetNodes[0].id;
        const joint: CrosswalkConnectionNew = {
          source: sourceNode,
          target: selectedTargetNodes[0],
          id: lastJointId,
          description: '',
          isSelected: true,
          isDraft: true,
          sourceJsonPath: undefined,
          targetJsonPath: undefined,
          sourcePredicate: undefined,
          sourceProcessing: undefined,
          targetPredicate: undefined,
          targetProcessing: undefined,
        };
        jointsToBeAdded.push(joint);
      });
      //setConnectedCrosswalksNew(crosswalkMappings => [...jointsToBeAdded, ...crosswalkMappings]);
      setJointToBeEdited(jointsToBeAdded[jointsToBeAdded.length - 1]);
    }
  }

  function removeJoint(cc: any) {
    const newCrosswalks = [
      ...connectedCrosswalksNew.filter((item) => {
        return item.id !== cc;
      }),
    ];
    setConnectedCrosswalksNew(() => [...newCrosswalks]);
  }

  function updateIsLinkedStatus(
    source: CrosswalkConnection,
    target: CrosswalkConnection
  ) {
    setAnySelectedLinkedState(
      source.target.length > 0 || target.target.length > 0
    );
    setBothSelectedLinkedState(
      source.target.length > 0 && source.target === target.source
    );
  }

  function getJointEndNode(nodes: string[], isSourceTree: boolean) {
    let ret: simpleNode = { name: '', id: '' };
    connectedCrosswalksNew.forEach((item) => {
      if (isSourceTree) {
        if (item.source.id === nodes.toString()) {
          ret = { name: item.target.name, id: item.target.id };
        }
      } else {
        if (item.target.id === nodes.toString()) {
          ret = { name: item.source.name, id: item.source.id };
        }
      }
    });
    return ret;
  }

  function getJointNodes(nodeIds: string[], isSourceTree: boolean) {
    if (isSourceTree) {
      return connectedCrosswalksNew.filter(
        (item) => item.source.id === nodeIds.toString()
      );
    } else {
      return connectedCrosswalksNew.filter(
        (item) => item.target.id === nodeIds.toString()
      );
    }
  }

  function getTreeNodesById(nodeIds: string[], isSourceTree: boolean) {
    let nodeIdsArr: string[] = [];
    if (typeof nodeIds === 'string') {
      nodeIdsArr.push(nodeIds);
    } else {
      nodeIdsArr = nodeIds;
    }
    if (isSourceTree) {
      return sourceTreeDataOriginal.filter((item) =>
        nodeIdsArr.includes(item.id)
      );
    } else {
      return targetTreeDataOriginal.filter((item) =>
        nodeIdsArr.includes(item.id)
      );
    }
  }

  function updateJointData(cc: CrosswalkConnectionNew) {
    const newCrosswalks = [
      ...connectedCrosswalksNew.map((item) => {
        if (item.target === cc.target && item.source === cc.source) {
          return cloneDeep(cc);
        } else {
          return item;
        }
      }),
    ];
    setConnectedCrosswalksNew(() => [...newCrosswalks]);
  }

  function setJointSelected(nodeId: string) {
    const newCons: CrosswalkConnectionNew[] = [];
    connectedCrosswalksNew.forEach((cw) => {
      cw.id === nodeId ? (cw.isSelected = true) : (cw.isSelected = false);
      newCons.push(cw);
    });
    setConnectedCrosswalksNew(() => [...newCons]);
  }

  function findJointToBeEdited(nodeId: string) {
    connectedCrosswalksNew.find((cw) => {
      cw.id === nodeId;
    });
  }

  function getJointSelected(id: string) {
    let ret = undefined;
    connectedCrosswalksNew.filter((cw) => {
      if (cw.id === id) {
        ret = cw;
      }
    });
    return ret;
  }

  function updateSelectionErrors() {
    let linkingError = '';

    // COMPLEX NODES CHECK
    if (selectedSourceNodes.length < 1) {
      linkingError = 'At least one source node must be selected.';
    } else if (selectedTargetNodes.length < 1) {
      linkingError = 'Target node must be selected';
    }
    setLinkingError(linkingError);
  }

  const handleTreeSelect = (
    event: React.SyntheticEvent | undefined,
    nodeIds: string[],
    isSourceTree: boolean
  ) => {
    const newTreeSelection: RenderTree[] = [];
    if (isSourceTree) {
      sourceTreeData.forEach((item: RenderTree) => {
        if (item.id === nodeIds.toString()) {
          newTreeSelection.push(item);
        }
      });
      //setSourceSelection(newTreeSelection);
      selectFromSourceTreeByIds(nodeIds);
    } else {
      targetTreeData.forEach((item: RenderTree) => {
        if (item.id === nodeIds.toString()) {
          newTreeSelection.push(item);
        }
      });
      //setTargetSelection(newTreeSelection);
      selectFromTargetTreeByIds(nodeIds);
    }
  };

  const handleTreeToggle = (
    event: React.SyntheticEvent,
    nodeIds: string[],
    isSourceTree: boolean
  ) => {
    if (isSourceTree) {
      setSourceExpanded(nodeIds);
    } else {
      setTargetExpanded(nodeIds);
    }
  };

  const selectFromTreeById = (nodeId: string, isTargetTree: boolean) => {
    const nodeIds = [];
    nodeIds.push(nodeId);
    if (isTargetTree) {
      selectFromTargetTreeByIds(nodeIds);
    } else {
      selectFromSourceTreeByIds(nodeIds);
    }
  };

  const selectFromTree = (
    node: CrosswalkConnectionNew,
    isTargetTree: boolean
  ) => {
    const nodeIds: React.SetStateAction<string[]> = [];
    if (isTargetTree) {
      nodeIds.push(node.target.id);
      selectFromTargetTreeByIds(nodeIds);
      //setTargetSelection(node.target)
    } else {
      nodeIds.push(node.source.id);
      selectFromSourceTreeByIds(nodeIds);
      //setSourceSelection(node.source)
    }
  };

  const handleExpandClick = (isSourceTree: boolean) => {
    const retData: string[] = [];
    if (isSourceTree) {
      sourceTreeData.forEach(({ children, id }) => {
        if (children && children?.length > 0) {
          retData.push(id.toString());
        }
      });
      setSourceExpanded((oldExpanded) => {
        return oldExpanded.length === 0 ? retData : [];
      });
    } else {
      targetTreeData.forEach(({ children, id }) => {
        if (children && children?.length > 0) {
          retData.push(id.toString());
        }
      });
      setTargetExpanded((oldExpanded) => {
        return oldExpanded.length === 0 ? retData : [];
      });
    }
  };

  const setExpanded = (isSourceTree: boolean) => {
    const retData: string[] = [];
    if (isSourceTree) {
      sourceTreeData.forEach(({ children, id }) => {
        if (children && children?.length > 0) {
          retData.push(id.toString());
        }
      });
      setSourceExpanded(() => {
        return retData;
      });
    } else {
      targetTreeData.forEach(({ children, id }) => {
        if (children && children?.length > 0) {
          retData.push(id.toString());
        }
      });
      setTargetExpanded(() => {
        return retData;
      });
    }
  };

  function saveCroswalk() {
    console.log('save clicked');
  }

  function loadCroswalk() {
    fetchCrosswalkData('organizations').then((data) => {
      setTargetData(inputData);
      setSourceData(inputData);

      setExpanded(true);
      setExpanded(false);
      setConnectedCrosswalksNew([]);
      clearSelections();
    });
  }

  function loadAvailableFilters() {
    console.log('loadAvailableFilters called');
  }

  function filterTreeData(
    treeData: RenderTree[],
    keywords: string[],
    index: number,
    isSourceTree: boolean
  ) {
    let ret = undefined;
    treeData = treeData.filter((elem: { name: string; jsonPath: string }) => {
      if (elem.jsonPath.startsWith(keywords[index])) {
        return elem;
      }
    });

    if (treeData[0] && treeData[0].jsonPath === keywords[keywords.length - 1]) {
      ret = cloneDeep(buildPathToSubtrees(treeData, isSourceTree));
    }

    if (treeData[0]?.children && treeData[0].children.length > 0) {
      filterTreeData(treeData[0].children, keywords, index + 1, isSourceTree);
    }
  }

  function buildPathToSubtrees(treeData: RenderTree[], isSourceTree: boolean) {
    const jsonPathReady: string[] = [];
    const jsonPathPieces = treeData[0].jsonPath.split('.');
    let prev = '';

    for (let i = 0; i < jsonPathPieces.length; i += 1) {
      if (i > 0) {
        prev = prev + '.' + jsonPathPieces[i];
        jsonPathReady.push(prev);
      } else {
        prev = jsonPathPieces[i];
        jsonPathReady.push(prev);
      }
    }

    const pathObjects: RenderTree[] = [];
    if (isSourceTree) {
      sourceTreeData.forEach((elem) => {
        if (jsonPathReady.includes(elem.jsonPath)) {
          console.log('final match', elem);
          pathObjects.push(elem);
        }
      });
      setSourceData(pathObjects);
      return pathObjects;
    } else {
      targetTreeData.forEach((elem) => {
        if (jsonPathReady.includes(elem.jsonPath)) {
          console.log('final match', elem);
          pathObjects.push(elem);
        }
      });
      setTargetData(pathObjects);
      return pathObjects;
    }
  }

  function clearTreeSearch(isSourceTree: boolean) {
    if (isSourceTree) {
      setSourceData(sourceTreeDataOriginal);
      setExpanded(true);
    } else {
      setTargetData(targetTreeDataOriginal);
      setExpanded(false);
    }
  }

  function searchFromTree(input: any, isSourceTree: boolean) {
    //clearTreeSearch(isSourceTree);

    //setSourceData(MockupSchemaLoader(true));
    let treeDataNew: any;

    const hits: string[] = [];

    if (isSourceTree) {
      sourceTreeData.forEach((elem: { name: string; jsonPath: string }) => {
        if (elem.name.includes(input.toString())) {
          hits.push(elem.jsonPath);
        }
      });
    } else {
      targetTreeData.forEach((elem: { name: string; jsonPath: string }) => {
        if (elem.name.includes(input.toString())) {
          hits.push(elem.jsonPath);
        }
      });
    }

    const nodesToProcess: string[][] = [];
    hits.forEach((hit) => {
      const treeNodeNames = hit.split('.');
      nodesToProcess.push(treeNodeNames);
    });

    const nodesToProcessUnique: Set<string> = new Set();

    nodesToProcess.forEach((path) => {
      let prev = '';
      for (let i = 0; i < path.length; i += 1) {
        if (i > 0) {
          prev = prev + '.' + path[i];
          nodesToProcessUnique.add(prev);
        } else {
          prev = path[i];
          nodesToProcessUnique.add(prev);
        }
      }
    });

    // FOUND MATCHING SUBTREES
    treeDataNew = filterTreeData(
      isSourceTree ? sourceTreeData : targetTreeData,
      Array.from(nodesToProcessUnique),
      0,
      isSourceTree
    );

    if (treeDataNew && treeDataNew.length > 0) {
      if (isSourceTree) {
        //setSourceData(treeDataNew)
      } else {
        //setTargetData(treeDataNew)
      }
    }
  }

  function clearSelections() {
    selectFromSourceTreeByIds([]);
    selectFromTargetTreeByIds([]);
  }

  const performCallbackFromAccordionAction = (
    joint: any,
    action: string,
    value: string
  ) => {
    if (action === 'remove') {
      removeJoint(joint);
    } else if (action === 'addNotes') {
      joint.notes = value;
      updateJointData(joint);
    } else if (action === 'selectFromSourceTree') {
      //handleExpandClick(true);
      clearTreeSearch(true);
      selectFromTree(joint, false);
    } else if (action === 'selectFromTargetTree') {
      //handleExpandClick(false);
      clearTreeSearch(false);
      selectFromTree(joint, true);
    } else if (action === 'openJointDetails') {
      setJointSelected(joint.id);
      setJointToBeEdited(getJointSelected(joint.id));
      //scrollToTop();
    } else if (action === 'removeJoint') {
      removeJoint(joint.id);
    }
  };

  const performCallbackFromTreeAction = (
    isSourceTree: boolean,
    action: any,
    event: any,
    nodeIds: any
  ) => {
    if (action === 'handleSelect') {
      handleTreeSelect(event, nodeIds, isSourceTree);
    } else if (action === 'treeToggle') {
      handleTreeToggle(event, nodeIds, isSourceTree);
    }
  };

  const performCallbackFromMappingModal = (
    action: any,
    event: any,
    crosswalkConnection: any
  ) => {
    if (action === 'closeModal') {
      setNodeMappingsModalOpen(false);
    }
    if (action === 'save') {
      setNodeMappingsModalOpen(false);
      setConnectedCrosswalksNew((crosswalkMappings) => [
        jointToBeEdited,
        ...crosswalkMappings,
      ]);
    }
  };

  const performMetadataAndFilesAction = (
    action: any,
    event: any,
    crosswalkConnection: any
  ) => {
    if (action === 'save') {
    }
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
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

  const changeTab = (
    event: React.SyntheticEvent | undefined,
    newValue: number
  ) => {
    setSelectedTab(newValue);
  };

  const performNodeInfoAction = (nodeId: any, isSourceTree: boolean) => {
    selectFromTreeById(nodeId, isSourceTree);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Box className="mb-3" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={changeTab}
          aria-label="Category selection"
        >
          <Tab label="Metadata & files" {...a11yProps(0)} />
          <Tab label="Crosswalks" {...a11yProps(1)} />
          <Tab label="Version history" {...a11yProps(2)} />
        </Tabs>
      </Box>
      {selectedTab === 0 && isSourceDataFetched && (
        <>
          <MetadataAndFiles
            crosswalks={connectedCrosswalksNew}
            performMetadataAndFilesAction={performMetadataAndFilesAction}
          />
        </>
      )}
      {/*            <CustomTabPanel value={selectedTab} index={0}>
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={1}>
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={2}>
            </CustomTabPanel>*/}
      <div className="row d-flex justify-content-between mt-4 crosswalk-editor">
        {/*  LEFT COLUMN */}
        <div
          className={
            isEditModeActive && selectedTab === 1 ? 'col-12' : 'd-none'
          }
        >
          {isSourceDataFetched && (
            <>
              <div className="row gx-0"></div>
              <div className="row gx-0">
                {/*  SOURCE TREE */}
                <div className="col-5 ps-4">
                  <div>
                    <div className="row content-box">
                      <div className="col-7 px-0">
                        <div className="d-flex justify-content-between mb-2 ps-3 pe-2">
                          <div className="w-100">
                            <SearchInput
                              className="py-2"
                              labelText="Filter from source schema"
                              searchButtonLabel="Search"
                              clearButtonLabel="Clear"
                              visualPlaceholder="Find an attribute..."
                              onSearch={(value) => {
                                searchFromTree(value, true);
                              }}
                              onChange={(value) => {
                                if (!value) {
                                  clearTreeSearch(true);
                                }
                              }}
                            />
                          </div>
                          <div className="expand-button-wrap">
                            <IconButton
                              onClick={() => handleExpandClick(true)}
                              aria-label="unlink"
                              color="primary"
                              size="large"
                            >
                              {sourceTreeExpanded.length === 0 ? (
                                <ExpandMoreIcon />
                              ) : (
                                <ExpandLessIcon />
                              )}
                            </IconButton>
                          </div>
                        </div>
                        <div className="mx-2">
                          <Box
                            sx={{
                              height: 400,
                              flexGrow: 1,
                              maxWidth: 700,
                              overflowY: 'auto',
                            }}
                          >
                            <SchemaTree
                              nodes={sourceTreeData[0]}
                              isSourceTree={true}
                              treeSelectedArray={sourceTreeSelectedArray}
                              treeExpanded={sourceTreeExpanded}
                              performTreeAction={performCallbackFromTreeAction}
                            />
                          </Box>
                        </div>
                      </div>
                      <div className="col-5 px-0 node-info-wrap">
                        <NodeInfo
                          isAnySelectedLinked={isAnySelectedLinked}
                          isBothSelectedLinked={isBothSelectedLinked}
                          sourceData={selectedSourceNodes}
                          isSourceTree={true}
                          targetData={selectedTargetNodes}
                          performNodeInfoAction={performNodeInfoAction}
                        ></NodeInfo>
                      </div>
                    </div>
                  </div>
                </div>

                {/*  MID BUTTONS */}
                <div className="col-2 px-4 mid-buttons">
                  <Sbutton
                    className="link-button"
                    disabled={linkingError.length > 1}
                    title={
                      linkingError.length > 1
                        ? linkingError
                        : 'Link selected nodes'
                    }
                    onClick={() => {
                      addJoint(!isBothSelectedLinked);
                    }}
                  >
                    <LinkIcon></LinkIcon>
                  </Sbutton>
                </div>

                {/*  TARGET TREE */}
                <div className="col-5 pe-4">
                  <div>
                    <div className="row content-box">
                      <div className="col-7 px-0">
                        <div className="d-flex justify-content-between mb-2 ps-3 pe-2">
                          <div className="w-100">
                            <SearchInput
                              className="py-2"
                              labelText="Filter from target schema"
                              searchButtonLabel="Search"
                              clearButtonLabel="Clear"
                              onSearch={(value) => {
                                searchFromTree(value, false);
                              }}
                              visualPlaceholder="Find an attribute..."
                              onChange={(value) => {
                                if (!value) {
                                  clearTreeSearch(false);
                                }
                              }}
                            />
                          </div>
                          <div className="expand-button-wrap">
                            <IconButton
                              onClick={() => handleExpandClick(false)}
                              aria-label="unlink"
                              color="primary"
                              size="large"
                            >
                              {targetTreeExpanded.length === 0 ? (
                                <ExpandMoreIcon />
                              ) : (
                                <ExpandLessIcon />
                              )}
                            </IconButton>
                          </div>
                        </div>
                        <div className="mx-2">
                          <Box
                            sx={{
                              height: 400,
                              flexGrow: 1,
                              maxWidth: 700,
                              overflowY: 'auto',
                            }}
                          >
                            <SchemaTree
                              nodes={targetTreeData[0]}
                              isSourceTree={false}
                              treeSelectedArray={targetTreeSelectedArray}
                              treeExpanded={targetTreeExpanded}
                              performTreeAction={performCallbackFromTreeAction}
                            />
                          </Box>
                        </div>
                      </div>
                      <div className="col-5 px-0 node-info-wrap">
                        <NodeInfo
                          isAnySelectedLinked={isAnySelectedLinked}
                          isBothSelectedLinked={isBothSelectedLinked}
                          sourceData={selectedSourceNodes}
                          isSourceTree={false}
                          targetData={selectedTargetNodes}
                          performNodeInfoAction={performNodeInfoAction}
                        ></NodeInfo>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {jointToBeEdited && (
            <>
              <NodeMappingsModal
                selectedCrosswalk={jointToBeEdited}
                performNodeInfoAction={performCallbackFromMappingModal}
                filterFunctions={filterFunctions}
                modalOpen={nodeMappingsModalOpen}
                isFirstAdd={false}
              ></NodeMappingsModal>
            </>
          )}
        </div>

        {/*  BOTTOM COLUMN */}
        {selectedTab === 1 && (
          <>
            <div className="col-12 px-4 mt-4">
              <h2>Mappings</h2>
              <div className="joint-listing-accordion-wrap my-3">
                <Box
                  className="mb-4"
                  sx={{ height: 640, flexGrow: 1, overflowY: 'auto' }}
                >
                  <JointListingAccordion
                    crosswalkJoints={connectedCrosswalksNew}
                    viewOnlyMode={false}
                    isEditModeActive={isEditModeActive}
                    performAccordionAction={performCallbackFromAccordionAction}
                  ></JointListingAccordion>
                </Box>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="fixed-footer">
        <div className="row">
          <div className="col-10"></div>
          <div className="col-2 d-flex flex-row justify-content-end">
            <Sbutton
              hidden={isEditModeActive}
              onClick={() => {
                setEditModeActive(true);
              }}
            >
              Edit
            </Sbutton>
            <Sbutton
              hidden={!isEditModeActive}
              variant="secondary"
              onClick={() => {
                setEditModeActive(false);
              }}
            >
              Publish
            </Sbutton>
            <Sbutton
              hidden={!isEditModeActive}
              onClick={() => {
                setEditModeActive(false);
              }}
            >
              Save
            </Sbutton>
          </div>
        </div>
      </div>
    </>
  );
}
