import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { Button as Sbutton } from 'suomifi-ui-components';
import MappingsAccordion from '@app/modules/crosswalk-editor/mappings-accordion';
import {
  CrosswalkConnectionNew,
  RenderTree,
  NodeMapping,
} from '@app/common/interfaces/crosswalk-connection.interface';
import NodeMappingsModal from './tabs/node-mappings';
import LinkIcon from '@app/common/components/shared-icons';
import {
  usePutMappingMutation,
  useDeleteMappingMutation,
  usePatchMappingMutation,
  useGetMappingsQuery,
} from '@app/common/components/crosswalk/crosswalk.slice';
import { useGetCrosswalkMappingFunctionsQuery } from '@app/common/components/crosswalk-functions/crosswalk-functions.slice';
import SchemaInfo from '@app/common/components/schema-info';
import { useTranslation } from 'next-i18next';
import { CrosswalkWithVersionInfo } from '@app/common/interfaces/crosswalk.interface';
import { useSelector } from 'react-redux';
import { selectIsEditContentActive } from '@app/common/components/content-view/content-view.slice';
import { State } from '@app/common/interfaces/state.interface';
import Tooltip from '@mui/material/Tooltip';

export default function CrosswalkEditor({
                                          crosswalkId,
                                          crosswalkData,
                                          hasEditPermission,
                                        }: {
  crosswalkId: string;
  crosswalkData: CrosswalkWithVersionInfo;
  hasEditPermission: boolean;
}) {
  const { t } = useTranslation('common');
  const isEditModeActive = useSelector(selectIsEditContentActive());

  const emptyTreeSelection: RenderTree = {
    elementPath: '',
    parentElementPath: undefined,
    name: '',
    id: '',
    visualTreeId: '',
    properties: undefined,
    uri: '',
    children: [],
    qname: '',
  };

  // STATE VARIABLES
  const [sourceSchemaUrn, setSourceSchemaUrn] = useState<string>('');
  const [targetSchemaUrn, setTargetSchemaUrn] = useState<string>('');

  const [selectedSourceNodes, setSelectedSourceNodes] = useState<RenderTree[]>(
    []
  );
  const [selectedTargetNodes, setSelectedTargetNodes] = useState<RenderTree[]>(
    []
  );
  const [patchSourceNodes, setPatchSourceNodes] = useState<RenderTree[]>([
    emptyTreeSelection,
  ]);
  const [patchTargetNodes, setPatchTargetNodes] = useState<RenderTree[]>([
    emptyTreeSelection,
  ]);
  const [patchPid, setPatchPid] = useState<string>('');

  const [nodeMappings, setNodeMappings] = useState<NodeMapping[]>([]);

  const [linkingError, ] = useState<string>('');
  const [isNodeMappingsModalOpen, setNodeMappingsModalOpen] =
    useState<boolean>(false);

  const [lastPutMappingPid, setLastPutMappingPid] = useState<string>('');
  const [lastPatchMappingReqId, setLastPatchMappingReqId] =
    useState<string>('');
  const [lastDeleteMappingPid, setLastDeleteMappingPid] = useState<string>('');
  const [showAttributeNames, setShowAttributeNames] = useState(true);
  const [sourceTreeSelection, setSourceTreeSelection] = useState<string[]>([]);
  const [targetTreeSelection, setTargetTreeSelection] = useState<string[]>([]);
  const [isOneToManyMapping, setIsOneToManyMapping] =
    useState<boolean>(false);
  const [isPatchMappingOperation, setIsMappingPatchOperation] =
    useState<boolean>(false);
  const [mappingToBeEdited, setMappingToBeEdited] = useState<
    CrosswalkConnectionNew[] | undefined
    >(undefined);


  const [putMapping, putMappingResponse] = usePutMappingMutation();
  const [deleteMapping, deleteMappingResponse] = useDeleteMappingMutation();
  const [patchMapping, patchMappingResponse] = usePatchMappingMutation();

  const { data: mappingFunctions, /*isLoading: mappingFunctionsIsLoading*/ } =
    useGetCrosswalkMappingFunctionsQuery('');

  const { data: mappingFilters, /*isLoading: mappingFiltersIsLoading*/ } =
    useGetCrosswalkMappingFunctionsQuery('FILTERS');

  useEffect(() => {
    if (
      patchSourceNodes &&
      patchTargetNodes &&
      patchSourceNodes[0].id.length > 0 &&
      patchTargetNodes[0].id.length > 0
    ) {
      // Source and target nodes are both now fetched from trees
      setMappingToBeEdited(
        generateMappingToBeEdited(patchSourceNodes, patchTargetNodes, patchPid)
      );
    }
  }, [patchSourceNodes, patchTargetNodes]);

  useEffect(() => {
    // After mapping to be edited is set, this opens editing modal
    setNodeMappingsModalOpen(true);
  }, [mappingToBeEdited]);

  useEffect(() => {
    if (crosswalkData?.sourceSchema) {
      setSourceSchemaUrn(crosswalkData.sourceSchema);
    }
    if (crosswalkData?.targetSchema) {
      setTargetSchemaUrn(crosswalkData.targetSchema);
    }
  }, [crosswalkData]);

  const {
    data: mappingsFromBackend,
    // isLoading: getMappingsDataIsLoading,
    isSuccess: getMappingsDataIsSuccess,
    // isError: getMappingsIsError,
    // error: getMappingsError,
    // refetch: refetchMappings,
  } = useGetMappingsQuery(crosswalkId);

  useEffect(() => {
    if (mappingsFromBackend) {
      const nodeMappings = mappingsFromBackend as NodeMapping[];
      setNodeMappings(nodeMappings);
    }
  }, [getMappingsDataIsSuccess, mappingsFromBackend]);

  // Add mapping to accordion
  if (putMappingResponse.isSuccess) {
    if (lastPutMappingPid !== putMappingResponse.data.pid) {
      addMappingToAccordion(putMappingResponse, true);
    }
    //TODO: add error notification
  }

  if (patchMappingResponse.isSuccess) {
    if (lastPatchMappingReqId !== patchMappingResponse.requestId) {
      addMappingToAccordion(patchMappingResponse, false);
    }
  }

  if (deleteMappingResponse.isSuccess) {
    if (
      deleteMappingResponse.isSuccess &&
      deleteMappingResponse.originalArgs !== lastDeleteMappingPid
    ) {
      const newMappings = [
        ...nodeMappings.filter((item) => {
          return item.pid !== deleteMappingResponse.originalArgs;
        }),
      ];
      if (deleteMappingResponse.originalArgs) {
        setLastDeleteMappingPid(deleteMappingResponse.originalArgs);
      }
      setNodeMappings(() => [...newMappings]);
      //
    }
  }

  function addMappingToAccordion(response: any, isPutOperation: boolean) {
    if (mappingToBeEdited) {
      mappingToBeEdited[0].id = response.data.pid;

      if (isPutOperation) {
        const newMapping = response.data as NodeMapping;
        setNodeMappings((mappings) => {
          return [newMapping, ...mappings];
        });
        setLastPutMappingPid(response.data.pid);
      } else {
        // This is needed in the future for showing success or error status
        setLastPatchMappingReqId(response.requestId);
        const patchedMapping = patchMappingResponse.data as NodeMapping;

        const filteredMappings = [
          ...nodeMappings.filter((item) => {
            return item.pid !== patchMappingResponse?.originalArgs?.pid;
          }),
        ];
        setNodeMappings((mappings) => {
          return [patchedMapping, ...filteredMappings];
        });
      }
    }
  }

  function addMappingButtonClick() {
    setIsMappingPatchOperation(false);
    const mappingssToBeAdded: CrosswalkConnectionNew[] = [];
    const isManyToOneMapping = selectedSourceNodes.length > 1;

    if (isManyToOneMapping) {
      selectedSourceNodes.forEach((sourceNode) => {
        const mapping: CrosswalkConnectionNew = {
          source: sourceNode,
          target: selectedTargetNodes[0],
          id: '',
          isSelected: true,
          isDraft: true,
          sourceJsonPath: undefined,
          targetJsonPath: undefined,
          sourcePredicate: undefined,
          sourceProcessing: undefined,
          targetPredicate: undefined,
          targetProcessing: undefined,
          notes: undefined,
          predicate: '',
          processing: '',
        };
        mappingssToBeAdded.push(mapping);
      });
    }

    // Only one to many or many to one mappings are available
    if (!isManyToOneMapping) {
      selectedTargetNodes.forEach((targetNode) => {
        const mapping: CrosswalkConnectionNew = {
          source: selectedSourceNodes[0],
          target: targetNode,
          id: '',
          isSelected: true,
          isDraft: true,
          sourceJsonPath: undefined,
          targetJsonPath: undefined,
          sourcePredicate: undefined,
          sourceProcessing: undefined,
          targetPredicate: undefined,
          targetProcessing: undefined,
          notes: undefined,
          predicate: '',
          processing: '',
        };
        mappingssToBeAdded.push(mapping);
      });
    }
    setIsOneToManyMapping(!isManyToOneMapping);
    setMappingToBeEdited(mappingssToBeAdded);
  }


  function generateMappingToBeEdited(
    sourceNodes: RenderTree[],
    targetNodes: RenderTree[],
    patchPid: string
  ) {
    const originalMapping: NodeMapping[] = nodeMappings.filter(
      (item) => item.pid === patchPid
    );

    const mappingsToBeAdded: CrosswalkConnectionNew[] = [];
    const isOneToManyMapping = sourceNodes.length < 2;
    setIsOneToManyMapping(isOneToManyMapping);

    if (isOneToManyMapping) {
      for (let i = 0; i < targetNodes.length; i +=1) {
        const mapping: CrosswalkConnectionNew = {
          processing: originalMapping[0].processing,
          source: sourceNodes[0],
          target: targetNodes[i],
          id: patchPid,
          notes: originalMapping.length > 0 ? originalMapping[0].notes : '',
          predicate:
            originalMapping.length > 0 ? originalMapping[0].predicate : '',
          isSelected: true,
          isDraft: true,
          sourceJsonPath: undefined,
          targetJsonPath: undefined,
          sourcePredicate: undefined,
          sourceProcessing: originalMapping.length > 0 ? originalMapping[0].source[i]?.processing : undefined,
          targetPredicate: undefined,
          targetProcessing: undefined
        };
        mappingsToBeAdded.push(mapping);
      };
    }
    else {
      for (let i = 0; i < sourceNodes.length; i +=1) {
        const mapping: CrosswalkConnectionNew = {
          processing: originalMapping[0].processing,
          source: sourceNodes[i],
          target: targetNodes[0],
          id: patchPid,
          notes: originalMapping.length > 0 ? originalMapping[0].notes : '',
          predicate:
            originalMapping.length > 0 ? originalMapping[0].predicate : '',
          isSelected: true,
          isDraft: true,
          sourceJsonPath: undefined,
          targetJsonPath: undefined,
          sourcePredicate: undefined,
          sourceProcessing: originalMapping.length > 0 ? originalMapping[0].source[i]?.processing : undefined,
          targetPredicate: undefined,
          targetProcessing: undefined
        };
        mappingsToBeAdded.push(mapping);
      };
    }
    return mappingsToBeAdded;
  }

  function removeMapping(mappingPid: any) {
    deleteMapping(mappingPid);
  }

  // Used to tree filtering
  function findNodesFromTree(
    tree: any,
    itemsToFind: string[],
    results: RenderTree[]
  ) {
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

  // Called from accordion
  const selectFromTreeByNodeMapping = (
    node: NodeMapping | undefined,
    isSourceTree: boolean
  ) => {
    const nodeIds: string[] = [];
    if (node) {
      if (isSourceTree) {
        node.source.forEach((node) => nodeIds.push(node.id));
        setSourceTreeSelection(nodeIds);
      } else {
        node.target.forEach((node) => nodeIds.push(node.id));
        setTargetTreeSelection(nodeIds);
      }
    }
  };

  const performCallbackFromAccordionAction = (
    mapping: NodeMapping,
    action: string,
    nodeId?: string
  ) => {
    // TODO: implement add notes from accordion if needed?
    if (action === 'remove') {
      removeMapping(mapping);
    } else if (action === 'selectFromSourceTreeByMapping') {
      selectFromTreeByNodeMapping(mapping, true);
      scrollToTop();
    } else if (action === 'selectFromSourceTreeById') {
      if (nodeId) {
        setSourceTreeSelection([nodeId]);
      }
      scrollToTop();
    } else if (action === 'selectFromTargetTreeByMapping') {
      selectFromTreeByNodeMapping(mapping, false);
      scrollToTop();
    } else if (action === 'selectFromTargetTreeById') {
      if (nodeId) {
        setTargetTreeSelection([nodeId]);
      }
      scrollToTop();
    }
    else if (action === 'selectFromTargetTreeByMapping') {
      selectFromTreeByNodeMapping(mapping, false);
      scrollToTop();
    } else if (action === 'openMappingDetails') {
      setIsMappingPatchOperation(true);
      setPatchPid(mapping.pid ? mapping.pid : '');
      selectFromTreeByNodeMapping(mapping, true);
      selectFromTreeByNodeMapping(mapping, false);
    } else if (action === 'removeMapping') {
      removeMapping(mapping.pid);
    }
  };

  const performCallbackFromSchemaInfo = (
    nodeIds: RenderTree[],
    isSourceTree: boolean
  ) => {
    if (nodeIds.length > 0) {
      if (isSourceTree) {
        setSelectedSourceNodes(nodeIds);
        if (isPatchMappingOperation) {
          setPatchSourceNodes(nodeIds);
        }
      } else {
        setSelectedTargetNodes(nodeIds);
        if (isPatchMappingOperation) {
          setPatchTargetNodes(nodeIds);
        }
      }
    }
  };

  const performCallbackFromMappingsModal = (
    action: any,
    mappingPayload: any,
    patchPid: string
  ) => {
    if (action === 'closeModal') {
      setIsMappingPatchOperation(false);
      setNodeMappingsModalOpen(false);
    }
    if (action === 'addMapping') {
      setNodeMappingsModalOpen(false);
      putMapping({ payload: mappingPayload, pid: crosswalkId });
      const sourceIds: string[] = [];
      const targetIds: string[] = [];
      mappingPayload.source.forEach((node: { id: string }) =>
        sourceIds.push(node.id)
      );
      setSourceTreeSelection(sourceIds);
      mappingPayload.target.forEach((node: { id: string }) =>
        targetIds.push(node.id)
      );
      setTargetTreeSelection(targetIds);
    }
    if (action === 'save') {
      setIsMappingPatchOperation(false);
      setNodeMappingsModalOpen(false);
      patchMapping({ payload: mappingPayload, pid: patchPid });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="row d-flex justify-content-between crosswalk-editor">
      <div className='col-12 mx-1'>
        <div className="row gx-0">
          {/*  SOURCE TREE */}
          <div className="col-5">
            <SchemaInfo
              updateTreeNodeSelectionsOutput={performCallbackFromSchemaInfo}
              isSourceTree={true}
              treeSelection={sourceTreeSelection}
              caption={t('crosswalk-editor.search-from-source-schema')}
              schemaUrn={sourceSchemaUrn}
            />
          </div>

          {/*  MID BUTTONS */}
          <div className="col-2 px-4 mid-buttons">
            {hasEditPermission && (
              <Tooltip
                title={selectedSourceNodes.length > 1 && selectedTargetNodes.length > 1 ? 'Many to many node mappings are not supported' : !isEditModeActive ? 'Activate edit mode to enable mappings' : 'Map selected nodes'}
                placement="bottom"
              >
              <Sbutton
                className="link-button"
                disabled={
                  selectedSourceNodes.length < 1 ||
                  selectedTargetNodes.length < 1 ||
                  crosswalkData.state === State.Published ||
                  (selectedSourceNodes.length > 1 && selectedTargetNodes.length > 1) ||
                  !isEditModeActive
                }
                onClick={() => {
                  addMappingButtonClick();
                }}
              >
                <LinkIcon></LinkIcon>
              </Sbutton>
              </Tooltip>
            )}
          </div>

          {/*  TARGET TREE */}
          <div className="col-5 pe-2">
            <SchemaInfo
              updateTreeNodeSelectionsOutput={performCallbackFromSchemaInfo}
              isSourceTree={false}
              treeSelection={targetTreeSelection}
              caption={t('crosswalk-editor.search-from-target-schema')}
              schemaUrn={targetSchemaUrn}
            />
          </div>
        </div>
      </div>
      <div className="col-12 mt-4">
        <div className="d-flex justify-content-between">
          <div>
            <h2 className="mb-0">Mappings</h2>
          </div>

          <div className="align-self-end pe-1">
            {/*                        // TODO: this can be shown when attribute qnames are available for accordion. Those are temporarily replaced with attribute ids.
                        <Checkbox
                          checked={showAttributeNames}
                          onClick={(newState) => {
                            setShowAttributeNames(newState.checkboxState);
                          }}
                        >Show node titles
                        </Checkbox>*/}
          </div>
        </div>

        <div className="joint-listing-accordion-wrap my-3">
          <Box
            className="mb-4"
            sx={{ height: 640, flexGrow: 1, overflowY: 'auto' }}
          >
            <MappingsAccordion
              nodeMappings={nodeMappings}
              viewOnlyMode={false}
              isEditModeActive={isEditModeActive && crosswalkData.state !== State.Published}
              showAttributeNames={showAttributeNames}
              performAccordionAction={performCallbackFromAccordionAction}
            />
          </Box>
        </div>
      </div>
      {mappingToBeEdited && (
        <NodeMappingsModal
          nodeSelections={mappingToBeEdited}
          performMappingsModalAction={
            performCallbackFromMappingsModal
          }
          mappingFilters={mappingFilters}
          mappingFunctions={mappingFunctions}
          modalOpen={isNodeMappingsModalOpen}
          isPatchMappingOperation={isPatchMappingOperation}
          isOneToManyMapping={isOneToManyMapping}
        />
      )}
    </div>
  );
}
