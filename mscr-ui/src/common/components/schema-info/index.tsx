import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Checkbox, SearchInput } from 'suomifi-ui-components';
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Box from '@mui/material/Box';
import SchemaTree from '@app/common/components/schema-info/schema-tree';
import NodeInfo from '@app/common/components/schema-info/schema-tree/node-info';
import { RenderTree } from '@app/common/interfaces/crosswalk-connection.interface';
import { generateTreeFromJson } from '@app/common/components/schema-info/schema-tree/schema-tree-renderer';
import { useGetFrontendSchemaQuery } from '@app/common/components/schema/schema.slice';
import { useTranslation } from 'next-i18next';
import {
  CheckboxWrapper,
  ExpandButtonWrapper,
  NodeInfoWrapper,
  SchemaHeading,
  SearchWrapper,
  TreeviewWrapper,
} from '@app/common/components/schema-info/schema-info.styles';
import { useRouter } from 'next/router';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import SpinnerOverlay, {
  SpinnerType,
} from '@app/common/components/spinner-overlay';
import Tooltip from '@mui/material/Tooltip';

export default function SchemaInfo(props: {
  updateTreeNodeSelectionsOutput?: (
    nodeIds: RenderTree[],
    isSourceSchema: boolean
  ) => void;
  isSourceTree?: boolean;
  treeSelection?: string[];
  caption: string;
  schemaUrn: string;
  isSingleTree?: boolean;
}) {
  const { t } = useTranslation('common');
  const lang = useRouter().locale ?? '';

  const { data: getSchemaData, isSuccess: getSchemaDataIsSuccess } =
    useGetFrontendSchemaQuery(props.schemaUrn);

  const [treeData, setTreeData] = useState<RenderTree[]>([]);
  const [nodeIdToNodeDictionary, setNodeIdToNodeDictionary] = useState<{
    [key: string]: RenderTree[];
  }>({});
  // These are used by tree visualization
  const [treeSelectedArray, setTreeSelectedArray] = useState<string[]>([]);
  const [treeExpandedArray, setTreeExpandedArray] = useState<string[]>([]);
  // These are used by datamodel
  const [selectedTreeNodes, setSelectedTreeNodes] = useState<RenderTree[]>([]);

  const [isTreeDataFetched, setTreeDataFetched] = useState<boolean>(false);

  const [showAttributeNames, setShowAttributeNames] = useState(true);

  useEffect(() => {
    if (getSchemaData?.content) {
      // Get two different representations of attributes: a tree and a dictionary with keys being the node ids and
      // values being the nodes that have that id, with no children attached
      const { generatedTree, nodeIdToShallowNode } =
        generateTreeFromJson(getSchemaData);
      generatedTree.then((res) => {
        if (res) {
          // Expand tree when data is loaded
          setPartlyExpanded();
          setTreeData(res);
          setTreeDataFetched(true);
          setNodeIdToNodeDictionary(nodeIdToShallowNode);
          //refetchOriginalSourceSchemaData();
        }
      });
    }
  }, [getSchemaDataIsSuccess, getSchemaData]);

  // Expand tree when data is loaded
  useEffect(() => {
    setPartlyExpanded();
  }, [isTreeDataFetched]);

  // Expand and select nodes when input changed (from mappings accordion)
  useEffect(() => {
    if (props.treeSelection) {
      expandAndSelectNodes(props.treeSelection);
    }
  }, [props.treeSelection]);

  useEffect(() => {
    // Update selections for node info and parent component for mappings
    const selectedNodes = treeSelectedArray
      .map((nodeId) => nodeIdToNodeDictionary[nodeId])
      .flat();
    if (
      props.updateTreeNodeSelectionsOutput &&
      props.isSourceTree !== undefined
    ) {
      props.updateTreeNodeSelectionsOutput(selectedNodes, props.isSourceTree);
    }
    setSelectedTreeNodes(selectedNodes);
  }, [treeSelectedArray]);

  const setPartlyExpanded = () => {
    const nodeIdsToExpand: string[] = [];
    treeData.forEach(({ children, id }) => {
      if (children && children.length > 0) {
        nodeIdsToExpand.push(id);
        if (children.length === 1) {
          nodeIdsToExpand.push(children[0].id);
        }
      }
    });
    setTreeExpandedArray(nodeIdsToExpand);
  };

  function clearTreeSearch() {
    setTreeSelectedArray([]);
    setPartlyExpanded();
    setSelectedTreeNodes([]);
  }

  // Used by tree select and filtering
  function getAllNodeIdsOnPathToLeaf(nodeIds: string[]) {
    const elementPaths: string[] = [];
    nodeIds.forEach((nodeId) => {
      const nodes = nodeIdToNodeDictionary[nodeId];
      nodes.map((node) => elementPaths.push(node.elementPath));
    });

    const nodesToSelect: Set<string> = new Set();
    elementPaths.forEach((path) => {
      const nodeIdsOnPath = path.split('.');
      nodeIdsOnPath.forEach((nodeId) => {
        nodesToSelect.add(nodeId);
      });
    });

    return Array.from(nodesToSelect);
  }

  const handleExpandClick = () => {
    if (treeExpandedArray.length === 0) {
      setPartlyExpanded();
    } else {
      setTreeExpandedArray([]);
    }
  };

  function expandAndSelectNodes(nodeIds: string[]) {
    if (nodeIds.length > 0) {
      const nodeIdsToExpand = getAllNodeIdsOnPathToLeaf(nodeIds);
      setTreeExpandedArray(nodeIdsToExpand);
      setTreeSelectedArray(nodeIds);
    }
  }

  function searchFromTree(input: string) {
    clearTreeSearch();
    // The nodeIdToNodeDictionary values are arrays of nodes, because there can be nodes in a schema with identical
    // ids but different paths. It's enough to check matching to one of them.
    const hits: string[] = [];
    Object.values(nodeIdToNodeDictionary).map((nodesWithSameId) => {
      if (
        (showAttributeNames &&
          nodesWithSameId[0].name &&
          nodesWithSameId[0].name
            .toLowerCase()
            .includes(input.toLowerCase())) ||
        (!showAttributeNames &&
          nodesWithSameId[0].qname &&
          nodesWithSameId[0].qname.toLowerCase().includes(input.toLowerCase()))
      ) {
        hits.push(nodesWithSameId[0].id);
      }
    });
    expandAndSelectNodes(hits);
  }

  function handleTreeClick(nodeIds: string[]) {
    setTreeSelectedArray(nodeIds);
    // If there's several nodes with the same id, expand paths to all
    const isMultiple = nodeIds
      .map(
        (nodeId) =>
          nodeIdToNodeDictionary[nodeId] &&
          nodeIdToNodeDictionary[nodeId].length > 1
      )
      .some((b) => b);
    if (isMultiple) {
      const newExpanded = new Set(treeExpandedArray);
      getAllNodeIdsOnPathToLeaf(nodeIds).forEach((nodeIdToAdd) =>
        newExpanded.add(nodeIdToAdd)
      );
      setTreeExpandedArray(Array.from(newExpanded));
    }
  }

  function handleTreeToggle(nodeIds: string[]) {
    setTreeExpandedArray(nodeIds);
  }

  const performCallbackFromTreeAction = (action: string, nodeIds: string[]) => {
    if (action === 'handleSelect') {
      handleTreeClick(nodeIds);
    } else if (action === 'treeToggle') {
      handleTreeToggle(nodeIds);
    }
  };

  return (
    <>
      <div className="row d-flex mb-2">
        <div className="col-12">
          <Tooltip
            title={
              getSchemaData?.metadata.label
                ? getLanguageVersion({
                    data: getSchemaData.metadata.label,
                    lang,
                  })
                : t('schema-tree.no-label')
            }
            placement="bottom-start"
          >
            <SchemaHeading variant="h2">
              {getSchemaData?.metadata.label
                ? getLanguageVersion({
                    data: getSchemaData.metadata.label,
                    lang,
                  })
                : t('schema-tree.no-label')}
            </SchemaHeading>
          </Tooltip>
        </div>
      </div>

      <TreeviewWrapper className="row gx-0">
        <div className="col-7 px-0">
          <div className="d-flex justify-content-between mb-2 ps-3 pe-2">
            {isTreeDataFetched && (
              <>
                <SearchWrapper className="w-100">
                  <SearchInput
                    className="py-2"
                    labelText={props.caption}
                    searchButtonLabel={t('schema-tree.search')}
                    clearButtonLabel={t('schema-tree.clear')}
                    visualPlaceholder={t('schema-tree.search-placeholder')}
                    onSearch={(value) => {
                      if (typeof value === 'string') {
                        searchFromTree(value);
                      }
                    }}
                    onChange={(value) => {
                      if (!value) {
                        clearTreeSearch();
                      }
                    }}
                  />
                </SearchWrapper>
                <ExpandButtonWrapper>
                  <IconButton
                    onClick={() => handleExpandClick()}
                    aria-label={t('schema-tree.expand')}
                    color="primary"
                    size="large"
                  >
                    {treeExpandedArray.length === 0 ? (
                      <ExpandMoreIcon />
                    ) : (
                      <ExpandLessIcon />
                    )}
                  </IconButton>
                </ExpandButtonWrapper>
              </>
            )}
          </div>
          <div>
            <Box
              className="px-3 d-flex"
              sx={{
                height: 460,
                flexGrow: 1,
                maxWidth: 700,
                overflowY: 'auto',
              }}
            >
              <div className="d-flex justify-content-center">
                <SpinnerOverlay
                  animationVisible={!isTreeDataFetched}
                  type={
                    props.isSingleTree
                      ? SpinnerType.SchemaTreeSingle
                      : SpinnerType.SchemaTreeDouble
                  }
                />
              </div>
              {isTreeDataFetched && (
                <SchemaTree
                  nodes={treeData[0]}
                  treeSelectedArray={treeSelectedArray}
                  treeExpanded={treeExpandedArray}
                  performTreeAction={performCallbackFromTreeAction}
                  showQname={!showAttributeNames}
                />
              )}
            </Box>
          </div>
        </div>
        <NodeInfoWrapper className="col-5 px-0">
          <NodeInfo
            treeData={selectedTreeNodes}
            // performNodeInfoAction={performNodeInfoAction}
            dataIsLoaded={isTreeDataFetched}
          />
          <CheckboxWrapper>
            <Checkbox
              checked={showAttributeNames}
              onClick={(newState) => {
                setShowAttributeNames(newState.checkboxState);
              }}
            >
              {t('schema-tree.show-titles')}
            </Checkbox>
          </CheckboxWrapper>
        </NodeInfoWrapper>
      </TreeviewWrapper>
    </>
  );
}
