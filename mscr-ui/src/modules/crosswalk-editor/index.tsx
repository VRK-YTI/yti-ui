import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TreeItem from '@mui/lab/TreeItem';
import {useEffect} from 'react';
import {Text} from 'suomifi-ui-components';
import MockupSchemaLoader, {generateTreeFromJson} from '../crosswalk-editor/schema-mockup';
import {cloneDeep} from 'lodash';
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
import {SearchInput, Notification} from 'suomifi-ui-components';
import SchemaTree from '@app/modules/crosswalk-editor/tabs/edit-crosswalk/schema-tree';
import ConfirmModal from '@app/common/components/confirmation-modal';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import {SSRConfig, useTranslation} from 'next-i18next';
import {
    CommonContextProvider,
    CommonContextState,
} from 'yti-common-ui/common-context-provider';

import {
    Button as Sbutton,
    InlineAlert,
    Modal,
    ModalContent,
    ModalFooter,
    ModalTitle,
    Paragraph,
} from 'suomifi-ui-components';
import {fetchCrosswalkData} from '@app/common/components/simple-api-service';
import callback from '@app/pages/api/auth/callback';

import {
    RenderTreeOld,
    CrosswalkConnection,
    CrosswalkConnectionNew,
    CrosswalkConnectionsNew, RenderTree, NodeMapping
} from '@app/common/interfaces/crosswalk-connection.interface';
import NodeMappingsModal from './tabs/node-mappings';
import LinkIcon from '@app/common/components/shared-icons';
import filter from "../../../../common-ui/components/filter";
import {useRouter} from 'next/router';
import {useGetCrosswalkQuery, usePatchCrosswalkMutation, usePutCrosswalkMutation, usePutMappingMutation, useDeleteMappingMutation, usePatchMappingMutation, useGetMappingsQuery} from "@app/common/components/crosswalk/crosswalk.slice";
import {useGetFrontendSchemaQuery} from "@app/common/components/schema/schema.slice";
import {useGetCrosswalkMappingFunctionsQuery} from "@app/common/components/crosswalk-functions/crosswalk-functions.slice";
import {usePostSchemaFileMutation} from "@app/common/components/import/import.slice";
import LoginModalView from "@app/common/components/login-modal";

export default function CrosswalkEditor({crosswalkId}: { crosswalkId: string }) {

    interface simpleNode {
        name: string | undefined;
        id: string;
    }

    const { data: mappingFunctions, isLoading: mappingFunctionsIsLoading } =
      useGetCrosswalkMappingFunctionsQuery('');

    const { data: mappingFilters, isLoading: mappingFiltersIsLoading } =
      useGetCrosswalkMappingFunctionsQuery('FILTERS');

    const {
        data: getCrosswalkData,
        isLoading: getCrosswalkDataIsLoading,
        isSuccess: getCrosswalkDataIsSuccess,
        isError: getCrosswalkDataIsError,
        error: getCrosswalkDataError
    } =
      useGetCrosswalkQuery(crosswalkId);

    const [patchCrosswalk,crosswalkPatchResponse] = usePatchCrosswalkMutation();
    const [putMapping, putMappingResponse] = usePutMappingMutation();
    const [deleteMapping, deleteMappingResponse] = useDeleteMappingMutation();
    const [patchMapping, patchMappingResponse] = usePatchMappingMutation();

    const emptyTreeSelectionOld: RenderTreeOld = {
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

    const emptyTreeSelection: RenderTree = {
        elementPath: '',
        parentElementPath: undefined,
        name: '',
        id: '',
        visualTreeId: '',
        properties: undefined,
        children: []
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
    const inputData: RenderTree[] = [];
    const [isSourceDataFetched, setSourceDataFetched] = React.useState<boolean>(false);
    const [isTargetDataFetched, setTargetDataFetched] = React.useState<boolean>(false);

    const [sourceSchemaUrn, setSourceSchemaUrn] = React.useState<string>('');
    const [targetSchemaUrn, setTargetSchemaUrn] = React.useState<string>('');

    const [sourceTreeDataOriginal, setSourceDataOriginal] = React.useState<RenderTree[]>(inputData);
    const [sourceTreeData, setSourceData] = React.useState<RenderTree[]>(inputData);
    const [sourceTreeExpanded, setSourceExpanded] = React.useState<string[]>([]);
    const [sourceTreeSelectedArray, selectFromSourceTreeByIds] = React.useState<string[]>([]);

    const [targetTreeDataOriginal, setTargetDataOriginal] = React.useState<RenderTree[]>(inputData);
    const [targetTreeData, setTargetData] = React.useState<RenderTree[]>(inputData);
    const [targetTreeExpanded, setTargetExpanded] = React.useState<string[]>([]);
    const [targetTreeSelectedArray, selectFromTargetTreeByIds] = React.useState<string[]>([]);

    const [selectedSourceNodes, setSelectedSourceNodes] = React.useState<RenderTree[]>([emptyTreeSelection]);
    const [selectedTargetNodes, setSelectedTargetNodes] = React.useState<RenderTree[]>([emptyTreeSelection]);

    const [connectedCrosswalksNew, setConnectedCrosswalksNew] = React.useState<CrosswalkConnectionNew[]>([]);
    const [nodeMappings, setNodeMappings] = React.useState<NodeMapping[]>([]);
    const [mappingToBeEdited, setMappingToBeEdited] = React.useState<NodeMapping | undefined>(undefined);

    const [jointToBeEdited, setJointToBeEdited] = React.useState<CrosswalkConnectionNew | undefined>(undefined);


    const [isAnySelectedLinked, setAnySelectedLinkedState] = React.useState<boolean>(false);
    const [isBothSelectedLinked, setBothSelectedLinkedState] = React.useState<boolean>(false);
    const [linkingError, setLinkingError] = React.useState<string>('');
    const [selectedTab, setSelectedTab] = React.useState(1);
    const [isNodeMappingsModalOpen, setNodeMappingsModalOpen] = React.useState<boolean>(false);
    const [isSaveConfirmModalOpen, setSaveConfirmModalOpen] = React.useState<boolean>(false);
    const [isPublishConfirmModalOpen, setPublishConfirmModalOpen] = React.useState<boolean>(false);

    const [crosswalksList, setCrosswalkList] = React.useState<string[]>([]);

    const [isEditModeActive, setEditModeActive] = React.useState<boolean>(true);
    const [isJointPatchOperation, setJointPatchOperation] = React.useState<boolean>(true);

    const [crosswalkPublished, setCrosswalkPublished] = React.useState<boolean>(true);
    const [publishNotificationVisible, setPublishNotificationVisible] = React.useState<boolean>(false);
    const [saveNotificationVisible, setSaveNotificationVisible] = React.useState<boolean>(false);
    const [lastPatchCrosswalkId, setLastPatchCrosswalkId] = React.useState<string>('');
    const [lastPutMappingPid, setLastPutMappingPid] = React.useState<string>('');
    const [lastPatchMappingPid, setLastPatchMappingPid] = React.useState<string>('');
    const [lastDeleteMappingPid, setLastDeleteMappingPid] = React.useState<string>('');

    if (crosswalkPatchResponse.isSuccess) {
        if (!crosswalkPublished && crosswalkPatchResponse?.originalArgs?.payload?.state === 'PUBLISHED') {
            setCrosswalkPublished(true);
            setPublishNotificationVisible(true);
            setEditModeActive(false);
            setSelectedTab(0);
            setLastPatchCrosswalkId(crosswalkPatchResponse.requestId);
        } else if(!saveNotificationVisible && (lastPatchCrosswalkId !== crosswalkPatchResponse.requestId)) {
            // Operation is regular patch without publishing (save)
            setLastPatchCrosswalkId(crosswalkPatchResponse.requestId);
            setSaveNotificationVisible(true);
        }
    }


    useEffect(() => {
        //setConfirmModalOpen(true);
        setNodeMappingsModalOpen(true);
    }, [jointToBeEdited]);

    useEffect(() => {
        if (getCrosswalkData?.sourceSchema) {
            setSourceSchemaUrn(getCrosswalkData.sourceSchema);
        }
        if (getCrosswalkData?.targetSchema) {
            setTargetSchemaUrn(getCrosswalkData.targetSchema);
        }
        if (getCrosswalkData && getCrosswalkData?.state !== 'PUBLISHED') {
            setCrosswalkPublished(false);
        }
    }, [!getCrosswalkDataIsLoading]);


    useEffect(() => {
    }, [!mappingFunctionsIsLoading]);

    useEffect(() => {
    }, [!mappingFiltersIsLoading]);

    useEffect(() => {
    }, [!isSaveConfirmModalOpen, !isPublishConfirmModalOpen]);

    // RESET EDITED JOINT VALUE IF MODAL NEEDS TO BE RE OPENED
    useEffect(() => {
    }, [isNodeMappingsModalOpen]);

    // EXPAND TREES WHEN DATA LOADED
    useEffect(() => {
        setExpanded(true);
    }, [sourceTreeData]);

    useEffect(() => {
        setExpanded(false);
    }, [targetTreeData]);

    useEffect(() => {
        // USED BY NODE INFO BOX SOURCE
        setSelectedSourceNodes(getTreeNodesByIds(sourceTreeSelectedArray, true));

        // USED BY NODE INFO BOX TARGET
        setSelectedTargetNodes(getTreeNodesByIds(targetTreeSelectedArray, false));

        //updateIsLinkedStatus(sourceNode, targetNode);
        //setSelectedSourceNodes(sourceNode);

    }, [sourceTreeSelectedArray, targetTreeSelectedArray, connectedCrosswalksNew, crosswalksList]);

    // USED BY LINK BUTTON STATE
    useEffect(() => {
        updateSelectionErrors();
    }, [selectedSourceNodes, selectedTargetNodes]);

    const {
        data: getSourceSchemaData,
        isLoading: getSourceSchemaDataIsLoading,
        isSuccess: getSourceSchemaDataIsSuccess,
        isError: getSourceSchemaDataIsError,
        error: getSourceSchemaDataError
    } =
      useGetFrontendSchemaQuery(sourceSchemaUrn);

    const {
        data: getTargetSchemaData,
        isLoading: getTargetSchemaDataIsLoading,
        isSuccess: getTargetSchemaDataIsSuccess,
        isError: getTargetSchemaDataIsError,
        error: getTargetSchemaDataError
    } =
      useGetFrontendSchemaQuery(targetSchemaUrn);

    const {
        data: mappingsFromBackend,
        isLoading: getMappingsDataIsLoading,
        isSuccess: getMappingsDataIsSuccesss,
        isError: getMappingsIsError,
        error: getMappingsError
    } =
      useGetMappingsQuery(crosswalkId[0]);

    useEffect(() => {
        if (getSourceSchemaData?.content) {
            generateTreeFromJson(getSourceSchemaData).then(res => {
                if (res) {
                    setSourceDataOriginal(res);
                    setSourceData(res);
                    setSourceDataFetched(true);
                }
            });
        }
    }, [getSourceSchemaDataIsSuccess]);

    useEffect(() => {
        if (getTargetSchemaData?.content) {
            generateTreeFromJson(getTargetSchemaData).then(res => {
                if (res) {
                    setTargetDataOriginal(res);
                    setTargetData(res);
                    setTargetDataFetched(true);
                }
            });
        }
    }, [getTargetSchemaDataIsSuccess]);

    useEffect(() => {
        if (mappingsFromBackend) {
            let nodeMappings = mappingsFromBackend as NodeMapping[];
            setNodeMappings(nodeMappings);
        }
    }, [getTargetSchemaDataIsSuccess]);

    // Add mapping to accordion
    if (putMappingResponse.isSuccess) {
        if (lastPutMappingPid !== putMappingResponse.data.pid) {
            addMappingToAccordion(putMappingResponse, true);
        } else {
            //TODO: add error notification
        }
    }

    if (patchMappingResponse.isSuccess) {
        if (lastPatchMappingPid !== patchMappingResponse.data.pid) {
        } else {
            //TODO: add error notification
        }
    }

    if (deleteMappingResponse.isSuccess) {
        if (deleteMappingResponse.isSuccess && (deleteMappingResponse.originalArgs !== lastDeleteMappingPid)) {
            const newMappings = [...nodeMappings.filter(item => {
                return (item.pid !== deleteMappingResponse.originalArgs);
            })];
            if (deleteMappingResponse.originalArgs){
                setLastDeleteMappingPid(deleteMappingResponse.originalArgs);
            }
            setNodeMappings(() => [...newMappings]);
            //
        }
    }

    function addMappingToAccordion(response: any, isPutOperation: boolean) {
        if (jointToBeEdited) {
            jointToBeEdited.id = response.data.pid;

            if (isPutOperation) {
                let newMapping = response.data as NodeMapping;
                setNodeMappings(mappings => {
                    return [newMapping, ...mappings];
                });

                setLastPutMappingPid(response.data.pid);
                setConnectedCrosswalksNew(crosswalkMappings => {
                    return [jointToBeEdited, ...crosswalkMappings];
                });
            }
            else {
                setLastPatchMappingPid(response.data.pid);
            }
        }
    }

    function saveCrosswalk() {
        let testPayload = {
            sourceSchema: sourceSchemaUrn,
            targetSchema: targetSchemaUrn,
        }
        patchCrosswalk({ payload: testPayload, pid: crosswalkId[0] });
    }

    function publishCrosswalk() {
        let publishPayload = {
            state: 'PUBLISHED'
        }
        patchCrosswalk({ payload: publishPayload, pid: crosswalkId[0] });
    }

    function addOrEditJointButtonClick(add: boolean, mappingToBeEdited: NodeMapping | undefined) {
        if ((add)) {
            const jointsToBeAdded: CrosswalkConnectionNew[] = [];
            selectedSourceNodes.forEach(sourceNode => {
                const joint: CrosswalkConnectionNew = {
                    source: sourceNode,
                    target: selectedTargetNodes[0],
                    id: '',
                    description: '',
                    isSelected: true,
                    isDraft: true,
                    sourceJsonPath: undefined,
                    targetJsonPath: undefined,
                    sourcePredicate: undefined,
                    sourceProcessing: undefined,
                    targetPredicate: undefined,
                    targetProcessing: undefined
                };
                jointsToBeAdded.push(joint);
            });
            //setConnectedCrosswalksNew(crosswalkMappings => [...jointsToBeAdded, ...crosswalkMappings]);
            setJointPatchOperation(false);
            setJointToBeEdited(jointsToBeAdded[jointsToBeAdded.length - 1]);
        } else {
            let sourceNodeIds: string[] = [];
            if (mappingToBeEdited) {
                mappingToBeEdited.source.forEach(item => {
                    sourceNodeIds.push(item.id);
                });
            }

            let targetNodeIds: string[] = [];
            if (mappingToBeEdited) {
                mappingToBeEdited.target.forEach(item => {
                    targetNodeIds.push(item.id);
                });
            }

            let sourceNodes = getTreeNodesByIds(sourceNodeIds, true);
            let targetNodes = getTreeNodesByIds(targetNodeIds, false);

            const jointsToBeEdited: CrosswalkConnectionNew[] = [];
            sourceNodes.forEach(sourceNode => {
                const joint: CrosswalkConnectionNew = {
                    source: sourceNode,
                    target: targetNodes[0],
                    id: mappingToBeEdited?.pid ? mappingToBeEdited.pid : '',
                    description: '',
                    isSelected: true,
                    isDraft: true,
                    sourceJsonPath: undefined,
                    targetJsonPath: undefined,
                    sourcePredicate: undefined,
                    sourceProcessing: undefined,
                    targetPredicate: undefined,
                    targetProcessing: undefined
                };
                jointsToBeEdited.push(joint);
            });
            setJointPatchOperation(true);
            setJointToBeEdited(jointsToBeEdited[jointsToBeEdited.length - 1]);
        }
    };

    function removeJoint(jointPid: any) {
        deleteMapping(jointPid);
    }

    function updateIsLinkedStatus(source: CrosswalkConnection, target: CrosswalkConnection) {
        setAnySelectedLinkedState(source.target.length > 0 || target.target.length > 0);
        setBothSelectedLinkedState(source.target.length > 0 && source.target === target.source);
    }

    function getJointEndNode(nodes: string[], isSourceTree: boolean) {
        let ret: simpleNode = {name: '', id: ''};
        connectedCrosswalksNew.forEach(item => {
            if (isSourceTree) {
                if (item.source.id === nodes.toString()) {
                    ret = {name: item.target.name, id: item.target.id};
                }
            } else {
                if (item.target.id === nodes.toString()) {
                    ret = {name: item.source.name, id: item.source.id};
                }
            }
        });
        return ret;
    }

    function getJointNodes(nodeIds: string[], isSourceTree: boolean) {
        if (isSourceTree) {
            return connectedCrosswalksNew.filter(item => item.source.id === nodeIds.toString());
        } else {
            return connectedCrosswalksNew.filter(item => item.target.id === nodeIds.toString());
        }
    }

    function getTreeNodesByIds(nodeIds: string[], isSourceTree: boolean) {
        let nodeIdsArr: string[] = [];
        if (typeof nodeIds === 'string') {
            nodeIdsArr.push(nodeIds);
        } else {
            nodeIdsArr = nodeIds;
        }
        if (isSourceTree) {
            let foundSourceNodes: RenderTree[] = [];
            return findNodesFromTree(sourceTreeDataOriginal, nodeIds, foundSourceNodes);
        } else {
            let foundTargetNodes: RenderTree[] = [];
            return findNodesFromTree(targetTreeDataOriginal, nodeIds, foundTargetNodes);
        }
    }

    function updateJointData(cc: CrosswalkConnectionNew) {
        const newCrosswalks = [...connectedCrosswalksNew.map(item => {
            if ((item.target === cc.target) && (item.source === cc.source)) {
                return (cloneDeep(cc));
            } else {
                return (item);
            }
            ;
        })];
        setConnectedCrosswalksNew(() => [...newCrosswalks]);
    }

    function setJointSelected(nodeId: string) {
        const newCons: CrosswalkConnectionNew[] = [];
        connectedCrosswalksNew.forEach(cw => {
            cw.id === nodeId ? cw.isSelected = true : cw.isSelected = false;
            newCons.push(cw);
        });
        setConnectedCrosswalksNew(() => [...newCons]);
    }

    function findJointToBeEdited(nodeId: string) {
        connectedCrosswalksNew.find(cw => {
            cw.id === nodeId;
        });
    }

    function getJointSelected(pid: string | undefined) {
        let ret = undefined;
        if (pid) {
            nodeMappings.filter(node => {
                if (node.pid === pid) {
                    ret = node;
                }
            });
        }
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

    const handleTreeSelect = (event: React.SyntheticEvent | undefined, nodeIds: string[], isSourceTree: boolean) => {
        const newTreeSelection: RenderTree[] = [];
        if (isSourceTree) {
            let results: string[] = [];
            selectFromSourceTreeByIds(findFromTree(sourceTreeData, nodeIds, results));
            //setSourceSelection(newTreeSelection);
            //selectFromSourceTreeByIds(nodeIds);
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

    function findFromTree(tree: any, itemsToFind: string[], results: string[]) {
        tree.forEach((item: RenderTree) => {
            if (itemsToFind.includes(item.id)) {
                results.push(item.id);
            } else {
                if (item.children && item.children.length > 0) {
                    return findFromTree(item.children, itemsToFind, results);
                }
            }
        });
        return results;
    }

    function findNodesFromTree(tree: any, itemsToFind: string[], results: RenderTree[]) {
        tree.forEach((item: RenderTree) => {
            if (itemsToFind.includes(item.id)) {
                results.push(item);
            } else {
                if (item.children && item.children.length > 0) {
                    return findNodesFromTree(item.children, itemsToFind, results);
                }
            }
        });
        return results;
    }

    const handleTreeToggle = (event: React.SyntheticEvent, nodeIds: string[], isSourceTree: boolean) => {
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

    const selectFromTree = (node: NodeMapping, isTargetTree: boolean) => {
        const nodeIds: React.SetStateAction<string[]> = [];
        if (isTargetTree) {
            node.target.forEach(node => nodeIds.push(node.id));
            selectFromTargetTreeByIds(nodeIds);
            //setTargetSelection(node.target)
        } else {
            node.source.forEach(node => nodeIds.push(node.id));
            selectFromSourceTreeByIds(nodeIds);
            //setSourceSelection(node.source)
        }
    };

    const handleExpandClick = (isSourceTree: boolean) => {
        const retData: string[] = [];
        if (isSourceTree) {
            sourceTreeData.forEach(({children, id}) => {
                if (children && children?.length > 0) {
                    retData.push(id.toString());
                }
            });
            setSourceExpanded((oldExpanded) => {
                return oldExpanded.length === 0 ? retData : [];
            });
        } else {
            targetTreeData.forEach(({children, id}) => {
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
            sourceTreeData.forEach(({children, id}) => {
                if (children && children?.length > 0) {
                    retData.push(id.toString());
                }
            });
            setSourceExpanded(() => {
                return retData;
            });
        } else {
            targetTreeData.forEach(({children, id}) => {
                if (children && children?.length > 0) {
                    retData.push(id.toString());
                }
            });
            setTargetExpanded(() => {
                return retData;
            });
        }
    };

    function filterTreeData(treeData: RenderTree[], keywords: string[], results: RenderTree[]) {
        treeData.forEach(item => {
            if (keywords.includes(item.elementPath)) {
                results.push(item);
            }
            if (item.children && item.children.length > 0) {
                return filterTreeData(item.children, keywords, results);
            }
        });
        return results;
    }

    function filterTreeDataOld(treeData: RenderTree[], keywords: string[], index: number, isSourceTree: boolean) {
        let ret = undefined;
        treeData = treeData.filter((elem: { name: string; elementPath: string }) => {
            if (elem.elementPath.startsWith(keywords[index])) {
                return elem;
            }
        });

        if (treeData[0] && treeData[0].elementPath === keywords[keywords.length - 1]) {
            ret = cloneDeep(buildPathToSubtrees(treeData, isSourceTree));
        }

        if (treeData[0]?.children && treeData[0].children.length > 0) {
            filterTreeDataOld(treeData[0].children, keywords, index + 1, isSourceTree);
        }
    }

    function buildPathToSubtrees(treeData: RenderTree[], isSourceTree: boolean) {
        const jsonPathReady: string[] = [];
        const jsonPathPieces = treeData[0].elementPath.split('.');
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
            sourceTreeData.forEach(elem => {
                if (jsonPathReady.includes(elem.elementPath)) {
                    // console.log('final match', elem);
                    pathObjects.push(elem);
                }
            });
            setSourceData(pathObjects);
            return pathObjects;
        } else {
            targetTreeData.forEach(elem => {
                if (jsonPathReady.includes(elem.elementPath)) {
                    // console.log('final match', elem);
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

    function findElementPathsFromTree(tree: RenderTree[], itemToFind: string, results: string[]) {
        // console.log('FINDING FROM TREE', tree, itemToFind);
        tree.forEach(item => {
            if (item.elementPath && item.elementPath.toLowerCase().includes(itemToFind.toLowerCase())) {
                results.push(item.elementPath);
            } else {
                if (item.children && item.children.length > 0) {
                    //console.log('FINDING FROM SUBTREE', item.children, itemsToFind);
                    return findElementPathsFromTree(item.children, itemToFind, results);
                }
            }
        });
        // console.log('!!!! FIND RESULT', results);
        return results;
    }

    function searchFromTree(input: any, isSourceTree: boolean) {
        //clearTreeSearch(isSourceTree);

        //setSourceData(MockupSchemaLoader(true));
        let treeDataNew: any;

        const hits: string[] = [];

        if (isSourceTree) {
            findElementPathsFromTree(sourceTreeData, input.toString(), hits);
        } else {
            targetTreeData.forEach((elem: { name: string; elementPath: string }) => {
                if (elem.name.includes(input.toString())) {
                    hits.push(elem.elementPath);
                }
            });
        }

        const nodesToProcess: string[][] = [];

        hits.forEach(hit => {
            const treeNodeNames = hit.split('.');
            nodesToProcess.push(treeNodeNames);
        });

        const nodesToProcessUnique: Set<string> = new Set();

        nodesToProcess.forEach(path => {
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
        let filteredTreeData: RenderTree[] = [];

        // console.log('!!!!!! FILTERED TREE DATA', filteredTreeData);
        buildNestedFilterTree(filterTreeData(isSourceTree ? sourceTreeData : targetTreeData, Array.from(nodesToProcessUnique), filteredTreeData));

        if (treeDataNew && treeDataNew.length > 0) {
            if (isSourceTree) {
                //setSourceData(treeDataNew)
            } else {
                //setTargetData(treeDataNew)
            }
        }
    }

    function buildNestedFilterTree(treeData: RenderTree[]) {
        let retTreeData: RenderTree[] = [];
        treeData = treeData.map(item => {
            item.children = [];
            return item;
        });

        let j = 0;
        for (let i = 0; i < treeData.length; i += 1) {
            if (treeData[i].elementPath === treeData[i + j].parentElementPath) {
                treeData[i].children.push(treeData[i + j]);
                if (j + 1 < treeData.length) {
                    j += 1;
                }
            }
        }
    }

    function clearSelections() {
        selectFromSourceTreeByIds([]);
        selectFromTargetTreeByIds([]);
    }

    const performCallbackFromAccordionAction = (joint: NodeMapping, action: string, value: string) => {
        if (action === 'remove') {
            removeJoint(joint);
        } else if (action === 'addNotes') {
            // TODO: implement add notes from accordion if needed?
            //joint.notes = value;
            //updateJointData(joint);
        } else if (action === 'selectFromSourceTree') {
            //handleExpandClick(true);
            clearTreeSearch(true);
            selectFromTree(joint, false);
        } else if (action === 'selectFromTargetTree') {
            //handleExpandClick(false);
            clearTreeSearch(false);
            selectFromTree(joint, true);
        } else if (action === 'openJointDetails') {
            addOrEditJointButtonClick(false, joint);
        } else if (action === 'removeJoint') {
            removeJoint(joint.pid);
        }
    };

    const performCallbackFromTreeAction = (isSourceTree: boolean, action: any, event: any, nodeIds: any) => {
        if (action === 'handleSelect') {
            handleTreeSelect(event, nodeIds, isSourceTree);
        } else if (action === 'treeToggle') {
            handleTreeToggle(event, nodeIds, isSourceTree);
        }
    };

    const performCallbackFromMappingsModal = (action: any, mappingPayload: any, patchPid: string) => {
        if (action === 'closeModal') {
            setNodeMappingsModalOpen(false);
        }
        if (action === 'addJoint') {
            setNodeMappingsModalOpen(false);
            putMapping({payload: mappingPayload, pid: crosswalkId[0]});
        }
        if (action === 'save') {
            setNodeMappingsModalOpen(false);
            patchMapping({payload: mappingPayload, pid: patchPid});
        }
    };

    const performConfirmModalAction = (actionName: string) => {
        if (actionName === 'save') {
            setSaveConfirmModalOpen(false);
            //setEditModeActive(false);
            saveCrosswalk();
        } else if (actionName === 'publish') {
            setPublishConfirmModalOpen(false);
            publishCrosswalk();
        } else if (actionName === 'removeMapping') {
        } else {
            // This is needed for modal close logic
            setSaveConfirmModalOpen(false);
            setPublishConfirmModalOpen(false);
        }
    };

    const performMetadataAndFilesAction = (action: any, event: any, crosswalkConnection: any) => {
        if (action === 'save') {
        }
    };

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

    const changeTab = (event: React.SyntheticEvent | undefined, newValue: number) => {
        setSelectedTab(newValue);
    };

    const performNodeInfoAction = (nodeId: any, isSourceTree: boolean) => {
        selectFromTreeById(nodeId, isSourceTree);
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };


    return (
      <>{getCrosswalkDataIsSuccess && <>
          <Box className='mb-3' sx={{borderBottom: 1, borderColor: 'divider'}}>
              <Tabs value={selectedTab} onChange={changeTab} aria-label="Category selection">
                  <Tab label="Metadata & files" {...a11yProps(0)} />
                  <Tab label="Crosswalks" {...a11yProps(1)} />
                  <Tab label="Version history" {...a11yProps(2)} />
              </Tabs>
          </Box>

          {selectedTab === 0 && isSourceDataFetched && isTargetDataFetched && getCrosswalkData &&
            <>
                <MetadataAndFiles crosswalks={connectedCrosswalksNew} data={getCrosswalkData}
                                  performMetadataAndFilesAction={performMetadataAndFilesAction}/>
            </>
          }
          {/*            <CustomTabPanel value={selectedTab} index={0}>
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={1}>
            </CustomTabPanel>
            <CustomTabPanel value={selectedTab} index={2}>
            </CustomTabPanel>*/}
          <div className='row d-flex justify-content-between mt-4 crosswalk-editor'>
              {crosswalkPublished && publishNotificationVisible && (<Notification
                closeText="Close"
                headingText="Crosswalk published successfully"
                smallScreen
                onCloseButtonClick={() => setPublishNotificationVisible(false)}
              >
              </Notification>)}
              {saveNotificationVisible && (<Notification
                closeText="Close"
                headingText="Crosswalk saved successfully"
                smallScreen
                onCloseButtonClick={() => setSaveNotificationVisible(false)}
              >
              </Notification>)}
              {/*  LEFT COLUMN */}
              <div className={(isEditModeActive && selectedTab === 1) ? 'col-12' : 'd-none'}>
                  {isSourceDataFetched && isTargetDataFetched &&
                    <>
                        <div className='row gx-0'>
                        </div>
                        <div className='row gx-0'>
                            {/*  SOURCE TREE */}
                            <div className='col-5 ps-4'>
                                <div>
                                    <div className="row content-box">
                                        <div className="col-7 px-0">
                                            <div className="d-flex justify-content-between mb-2 ps-3 pe-2">
                                                <div className='w-100'>
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
                                                    <IconButton onClick={() => handleExpandClick(true)}
                                                                aria-label="unlink"
                                                                color="primary" size="large">
                                                        {sourceTreeExpanded.length === 0 ? <ExpandMoreIcon/> :
                                                          <ExpandLessIcon/>}
                                                    </IconButton>
                                                </div>
                                            </div>
                                            <div className="mx-2">
                                                <Box sx={{
                                                    height: 400,
                                                    flexGrow: 1,
                                                    maxWidth: 700,
                                                    overflowY: 'auto'
                                                }}>

                                                    <SchemaTree nodes={sourceTreeData[0]}
                                                                isSourceTree={true}
                                                                treeSelectedArray={sourceTreeSelectedArray}
                                                                treeExpanded={sourceTreeExpanded}
                                                                performTreeAction={performCallbackFromTreeAction}
                                                    />

                                                </Box>
                                            </div>
                                        </div>
                                        <div className="col-5 px-0 node-info-wrap">
                                            <NodeInfo isAnySelectedLinked={isAnySelectedLinked}
                                                      isBothSelectedLinked={isBothSelectedLinked}
                                                      sourceData={selectedSourceNodes}
                                                      isSourceTree={true}
                                                      targetData={selectedTargetNodes}
                                                      performNodeInfoAction={performNodeInfoAction}></NodeInfo>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*  MID BUTTONS */}
                            <div className='col-2 px-4 mid-buttons'>
                                {!crosswalkPublished &&
                                  <Sbutton className='link-button' disabled={(linkingError.length > 1)}
                                           title={(linkingError.length > 1 ? linkingError : 'Link selected nodes')}
                                           onClick={() => {
                                               addOrEditJointButtonClick(!isBothSelectedLinked, undefined);
                                           }}><LinkIcon></LinkIcon></Sbutton>
                                }
                            </div>

                            {/*  TARGET TREE */}
                            <div className='col-5 pe-4'>
                                <div>
                                    <div className="row content-box">
                                        <div className="col-7 px-0">
                                            <div className="d-flex justify-content-between mb-2 ps-3 pe-2">
                                                <div className='w-100'>
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
                                                    <IconButton onClick={() => handleExpandClick(false)}
                                                                aria-label="unlink"
                                                                color="primary" size="large">
                                                        {targetTreeExpanded.length === 0 ? <ExpandMoreIcon/> :
                                                          <ExpandLessIcon/>}
                                                    </IconButton>
                                                </div>
                                            </div>
                                            <div className="mx-2">
                                                <Box sx={{
                                                    height: 400,
                                                    flexGrow: 1,
                                                    maxWidth: 700,
                                                    overflowY: 'auto'
                                                }}>
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

                                            <NodeInfo isAnySelectedLinked={isAnySelectedLinked}
                                                      isBothSelectedLinked={isBothSelectedLinked}
                                                      sourceData={selectedSourceNodes}
                                                      isSourceTree={false}
                                                      targetData={selectedTargetNodes}
                                                      performNodeInfoAction={performNodeInfoAction}></NodeInfo>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                  }
                  {jointToBeEdited && <>
                      <NodeMappingsModal selectedCrosswalk={jointToBeEdited}
                                         performMappingsModalAction={performCallbackFromMappingsModal}
                                         mappingFilters={mappingFilters}
                                         mappingFunctions={mappingFunctions}
                                         modalOpen={isNodeMappingsModalOpen}
                                         isJointPatchOperation={isJointPatchOperation}></NodeMappingsModal>
                  </>
                  }
              </div>
              {/*  BOTTOM COLUMN */}
              {selectedTab === 1 && <>

                  <div className='col-12 px-4 mt-4'>
                      <h2>Mappings</h2>
                      <div className='joint-listing-accordion-wrap my-3'>
                          <Box className='mb-4' sx={{height: 640, flexGrow: 1, overflowY: 'auto'}}>
                              <JointListingAccordion nodeMappings = {nodeMappings}
                                                     viewOnlyMode={false}
                                                     isEditModeActive={isEditModeActive && !crosswalkPublished}
                                                     performAccordionAction={performCallbackFromAccordionAction}></JointListingAccordion>
                          </Box>
                      </div>
                  </div>
              </>}
          </div>
          <ConfirmModal isVisible={isSaveConfirmModalOpen} actionName={'save'} actionText={'Save'} cancelText={'Cancel'} performConfirmModalAction={performConfirmModalAction} heading={'Confirmation'} text1={'Do you want to save changes.'}/>
          <ConfirmModal isVisible={isPublishConfirmModalOpen} actionName={'publish'} actionText={'Publish'} cancelText={'Cancel'} performConfirmModalAction={performConfirmModalAction} heading={'Confirmation'} text1={'Do you want to publish the crosswalk.'} text2={'After publishing, you cannot make changes to mappings in crosswalk.'}/>
          <div className='fixed-footer'>
              <div className='row'>
                  <div className='col-10'>
                  </div>
                  <div className='col-2 d-flex flex-row justify-content-end'>
                      <Sbutton hidden={isEditModeActive || (crosswalkPublished && selectedTab !== 0)} onClick={() => {
                          setEditModeActive(true);
                      }}>Edit</Sbutton>

                      <Sbutton hidden={!isEditModeActive || crosswalkPublished} variant="secondary" onClick={() => {
                          setPublishConfirmModalOpen(true);
                      }}>Publish</Sbutton>

                      <Sbutton hidden={!isEditModeActive || (crosswalkPublished && selectedTab !== 0)} onClick={() => {
                          setSaveConfirmModalOpen(true);
                      }}>Save</Sbutton>
                  </div>
              </div>
          </div>
      </>}
      </>
    );
}
