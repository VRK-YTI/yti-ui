import * as React from 'react';
import { useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SearchInput } from 'suomifi-ui-components';
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Box from '@mui/material/Box';
import SchemaTree from '@app/common/components/schema-info/schema-tree';
import NodeInfo from '@app/common/components/schema-info/schema-tree/node-info';
import { RenderTree } from '@app/common/interfaces/crosswalk-connection.interface';
import { cloneDeep } from 'lodash';
import { generateTreeFromJson } from '@app/common/components/schema-info/schema-tree/schema-tree-renderer';
import { useGetFrontendSchemaQuery } from '@app/common/components/schema/schema.slice';

const inputData: RenderTree[] = [];

export default function SchemaInfo(props: {
  updateTreeNodeSelectionsOutput?: any;
  isSourceTree?: boolean;
  treeSelection?: string[];
  caption: string;
  schemaUrn: string;
}) {
  const emptyTreeSelection: RenderTree = {
    elementPath: '',
    parentElementPath: undefined,
    name: '',
    id: '',
    visualTreeId: '',
    properties: undefined,
    children: [],
  };

  const {
    data: getSchemaData,
    isLoading: getSchemaDataIsLoading,
    isSuccess: getSchemaDataIsSuccess,
    isError: getSchemaDataIsError,
    error: getSchemaDataError,
  } = useGetFrontendSchemaQuery(props.schemaUrn);

  const [treeDataOriginal, setTreeDataOriginal] =
    React.useState<RenderTree[]>(inputData);
  const [treeData, setTreeData] = React.useState<RenderTree[]>(inputData);
  const [treeExpandedArray, setTreeExpanded] = React.useState<string[]>([]);

  // These are used by tree visualization
  const [treeSelectedArray, setTreeSelections] = React.useState<string[]>([]);

  // These are used by datamodel
  const [selectedTreeNodes, setSelectedTreeNodes] = React.useState<
    RenderTree[]
  >([emptyTreeSelection]);

  const [isTreeDataFetched, setTreeDataFetched] =
    React.useState<boolean>(false);

  useEffect(() => {
    if (getSchemaData?.content) {
      generateTreeFromJson(getSchemaData).then((res) => {
        if (res) {
          // Expand tree when data is loaded
          setExpanded();
          setTreeDataOriginal(cloneDeep(res));
          setTreeData(res);
          setTreeDataFetched(true);
          //refetchOriginalSourceSchemaData();
        }
      });
    }
  }, [getSchemaDataIsSuccess, getSchemaData]);

  // Expand tree when data is loaded
  useEffect(() => {
    setExpanded();
  }, [isTreeDataFetched]);

  // Expand and select nodes when input changed (from mappings accordion)
  useEffect(() => {
    expandAndSelectNodes(props.treeSelection);
  }, [props.treeSelection]);

  useEffect(() => {
    // Update selections for node info and parent component for mappings
    const selectedTreeNodeIds = getTreeNodesByIds(treeSelectedArray);
    props.updateTreeNodeSelectionsOutput(
      selectedTreeNodeIds,
      props.isSourceTree,
    );
    setSelectedTreeNodes(selectedTreeNodeIds);
  }, [treeSelectedArray]);

  const setExpanded = () => {
    const retData: string[] = [];
    treeData.forEach(({ children, id }) => {
      if (children && children?.length > 0) {
        retData.push(id.toString());
      }
    });
    setTreeExpanded(() => {
      return retData;
    });
  };

  // Used to generate data for mappings modal
  function getTreeNodesByIds(nodeIds: string[]) {
    const foundSourceNodes: RenderTree[] = [];
    return findNodesFromTree(treeDataOriginal, nodeIds, foundSourceNodes);
  }

  // Used to tree filtering
  function findNodesFromTree(
    tree: any,
    itemsToFind: string[],
    results: RenderTree[],
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

  function clearTreeSearch() {
    setTreeSelections([]);
    setTreeData(cloneDeep(treeDataOriginal));
    setExpanded();
  }

  function doFiltering(
    tree: RenderTree[],
    nameToFind: string,
    results: { nodeIds: string[]; childNodeIds: string[] },
  ) {
    tree.forEach((item) => {
      if (
        item.name &&
        item.name.toLowerCase().includes(nameToFind.toLowerCase())
      ) {
        results.nodeIds.push(item.id);
        if (item.children && item.children.length > 0) {
          item.children.forEach((child) => {
            results.childNodeIds.push(child.id);
          });
        }
      }
      if (item.children && item.children.length > 0) {
        return doFiltering(item.children, nameToFind, results);
      }
    });
    return results;
  }

  function getElementPathsFromTree(
    treeData: RenderTree[],
    nodeIds: string[],
    results: string[],
  ) {
    treeData.forEach((item) => {
      if (nodeIds.includes(item.id)) {
        if (item.elementPath != null) {
          results.push(item.elementPath);
        }
      }
      if (item.children && item.children.length > 0) {
        return getElementPathsFromTree(item.children, nodeIds, results);
      }
    });
    return results;
  }

  // Used by tree select and filtering
  function getAllNodeIdsOnPathToLeaf(nodeIds: string[]) {
    const elementPaths = getElementPathsFromTree(treeData, nodeIds, []);
    const nodesToSelect: Set<string> = new Set();

    elementPaths.forEach((path) => {
      const nodes = path.split('.');
      nodes.forEach((node) => {
        nodesToSelect.add(node);
      });
    });
    return Array.from(nodesToSelect);
  }

  const handleExpandClick = () => {
    const allTreeNodes: string[] = [];
    treeData.forEach(({ children, id }) => {
      if (children && children?.length > 0) {
        allTreeNodes.push(id.toString());
      }
    });
    setTreeExpanded((oldExpanded) => {
      return oldExpanded.length === 0 ? allTreeNodes : [];
    });
  };

  function expandAndSelectNodes(nodeIds: string[]) {
    if (nodeIds.length > 0) {
      const nodeIdsToExpand = getAllNodeIdsOnPathToLeaf(nodeIds);
      setTreeExpanded(nodeIdsToExpand);
      setTreeSelections(nodeIds);
    }
  }

  function searchFromTree(input: any) {
    clearTreeSearch();
    const hits = { nodeIds: [], childNodeIds: [] };
    doFiltering(treeData, input.toString(), hits);
    expandAndSelectNodes(hits.nodeIds);
  }

  function handleTreeClick(
    event: React.SyntheticEvent | undefined,
    nodeIds: string[],
  ) {
    setTreeSelections(nodeIds);
  }

  function handleTreeToggle(
    event: React.SyntheticEvent | undefined,
    nodeIds: string[],
  ) {
    setTreeExpanded(nodeIds);
  }

  const selectFromTreeById = (nodeId: string) => {
    const nodeIds = [];
    nodeIds.push(nodeId);
    expandAndSelectNodes(nodeIds);
  };

  const performCallbackFromTreeAction = (
    action: any,
    event: any,
    nodeIds: any,
  ) => {
    if (action === 'handleSelect') {
      handleTreeClick(event, nodeIds);
    } else if (action === 'treeToggle') {
      handleTreeToggle(event, nodeIds);
    }
  };

  const performNodeInfoAction = (nodeId: any, isSourceTree: boolean) => {
    selectFromTreeById(nodeId);
  };

  return (
    <>
      <div className="row content-box">
        <div className="col-7 px-0">
          <div className="d-flex justify-content-between mb-2 ps-3 pe-2">
            <div className="w-100">
              <SearchInput
                className="py-2"
                labelText={props.caption}
                searchButtonLabel="Search"
                clearButtonLabel="Clear"
                visualPlaceholder="Find an attribute..."
                onSearch={(value) => {
                  searchFromTree(value);
                }}
                onChange={(value) => {
                  if (!value) {
                    clearTreeSearch();
                  }
                }}
              />
            </div>
            <div className="expand-button-wrap">
              <IconButton
                onClick={() => handleExpandClick()}
                aria-label="expand tree"
                color="primary"
                size="large"
              >
                {treeExpandedArray.length === 0 ? (
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
              {isTreeDataFetched && (
                <SchemaTree
                  nodes={treeData[0]}
                  treeSelectedArray={treeSelectedArray}
                  treeExpanded={treeExpandedArray}
                  performTreeAction={performCallbackFromTreeAction}
                />
              )}
            </Box>
          </div>
        </div>
        <div className="col-5 px-0 node-info-wrap">
          <NodeInfo
            treeData={selectedTreeNodes}
            performNodeInfoAction={performNodeInfoAction}
          ></NodeInfo>
        </div>
      </div>
    </>
  );
}
