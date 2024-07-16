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

  const [jointToBeEdited, setJointToBeEdited] = useState<
    CrosswalkConnectionNew | undefined
  >(undefined);

  const [linkingError, ] = useState<string>('');
  const [isNodeMappingsModalOpen, setNodeMappingsModalOpen] =
    useState<boolean>(false);
  const [isJointPatchOperation, setIsJointPatchOperation] =
    useState<boolean>(false);

  const [lastPutMappingPid, setLastPutMappingPid] = useState<string>('');
  const [lastPatchMappingReqId, setLastPatchMappingReqId] =
    useState<string>('');
  const [lastDeleteMappingPid, setLastDeleteMappingPid] = useState<string>('');
  const [showAttributeNames, setShowAttributeNames] = useState(true);
  const [sourceTreeSelection, setSourceTreeSelection] = useState<string[]>([]);
  const [targetTreeSelection, setTargetTreeSelection] = useState<string[]>([]);

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
      setJointToBeEdited(
        generateJointToBeEdited(patchSourceNodes, patchTargetNodes, patchPid)
      );
    }
  }, [patchSourceNodes, patchTargetNodes]);

  useEffect(() => {
    // After joint to be edited is set, this opens editing modal
    setNodeMappingsModalOpen(true);
  }, [jointToBeEdited]);

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
    if (jointToBeEdited) {
      jointToBeEdited.id = response.data.pid;

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

  function addJointButtonClick() {
    setIsJointPatchOperation(false);
    const jointsToBeAdded: CrosswalkConnectionNew[] = [];
    selectedSourceNodes.forEach((sourceNode) => {
      const joint: CrosswalkConnectionNew = {
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
      };
      jointsToBeAdded.push(joint);
    });
    setJointToBeEdited(jointsToBeAdded[jointsToBeAdded.length - 1]);
  }

  function generateJointToBeEdited(
    sourceNodes: RenderTree[],
    targetNodes: RenderTree[],
    patchPid: string
  ) {
    const originalMapping: NodeMapping[] = nodeMappings.filter(
      (item) => item.pid === patchPid
    );

    const jointsToBeAdded: CrosswalkConnectionNew[] = [];
    sourceNodes.forEach((sourceNode) => {
      const joint: CrosswalkConnectionNew = {
        source: sourceNode,
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
        sourceProcessing: undefined,
        targetPredicate: undefined,
        targetProcessing: undefined,
      };
      jointsToBeAdded.push(joint);
    });
    return jointsToBeAdded[0];
  }

  function removeJoint(jointPid: any) {
    deleteMapping(jointPid);
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
    joint: NodeMapping,
    action: string,
    value: string
  ) => {
    if (action === 'remove') {
      removeJoint(joint);
    } else if (action === 'addNotes') {
      // TODO: implement add notes from accordion if needed?
      //joint.notes = value;
      //updateJointData(joint);
    } else if (action === 'selectFromSourceTree') {
      selectFromTreeByNodeMapping(joint, true);
      scrollToTop();
    } else if (action === 'selectFromTargetTree') {
      selectFromTreeByNodeMapping(joint, false);
      scrollToTop();
    } else if (action === 'openMappingDetails') {
      setIsJointPatchOperation(true);
      setPatchPid(joint.pid ? joint.pid : '');
      selectFromTreeByNodeMapping(joint, true);
      selectFromTreeByNodeMapping(joint, false);
    } else if (action === 'removeMapping') {
      removeJoint(joint.pid);
    }
  };

  const performCallbackFromSchemaInfo = (
    nodeIds: RenderTree[],
    isSourceTree: boolean
  ) => {
    if (nodeIds.length > 0) {
      if (isSourceTree) {
        setSelectedSourceNodes(nodeIds);
        if (isJointPatchOperation) {
          setPatchSourceNodes(nodeIds);
        }
      } else {
        setSelectedTargetNodes(nodeIds);
        if (isJointPatchOperation) {
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
      setIsJointPatchOperation(false);
      setNodeMappingsModalOpen(false);
    }
    if (action === 'addJoint') {
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
      setIsJointPatchOperation(false);
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
              <Sbutton
                className="link-button"
                title={
                  linkingError.length > 1
                    ? linkingError
                    : 'Link selected nodes'
                }
                disabled={
                  selectedSourceNodes.length < 1 ||
                  selectedTargetNodes.length < 1 ||
                  crosswalkData.state === State.Published ||
                  !isEditModeActive
                }
                onClick={() => {
                  addJointButtonClick();
                }}
              >
                <LinkIcon></LinkIcon>
              </Sbutton>
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
      {jointToBeEdited && (
        <NodeMappingsModal
          selectedCrosswalk={jointToBeEdited}
          performMappingsModalAction={performCallbackFromMappingsModal}
          mappingFilters={mappingFilters}
          mappingFunctions={mappingFunctions}
          modalOpen={isNodeMappingsModalOpen}
          isJointPatchOperation={isJointPatchOperation}
        />
      )}
    </div>
  );
}
