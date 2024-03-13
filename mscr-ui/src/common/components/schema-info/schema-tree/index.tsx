import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'next-i18next';
import { RenderTree } from '@app/common/interfaces/crosswalk-connection.interface';

function toTree(nodes: RenderTree) {
  let ret = undefined;
  if (Array.isArray(nodes)) {
    return nodes.map((node) => {
      return (
        <TreeItem
          key={node.id}
          nodeId={node.id}
          label={node.name}
          className="linked-tree-item"
        >
          {Array.isArray(node.children)
            ? node.children.map((node: RenderTree) => toTree(node))
            : null}
        </TreeItem>
      );
    });
  } else {
    ret = (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
        className="linked-tree-item"
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node: RenderTree) => toTree(node))
          : null}
      </TreeItem>
    );
    return ret;
  }
}

export default function SchemaTree({
  nodes,
  treeSelectedArray,
  treeExpanded,
  performTreeAction,
}: {
  nodes: RenderTree;
  treeSelectedArray: string[];
  treeExpanded: string[];
  performTreeAction: (action: string, nodeIds: string[]) => void;
}) {
  const { t } = useTranslation('common');

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    performTreeAction('handleSelect', nodeIds);
  };

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    performTreeAction('treeToggle', nodeIds);
  };

  // console.log('TREEVIEW DATA', nodes, treeSelectedArray);
  return (
    <TreeView
      aria-label={t('schema-tree.tree-label')}
      expanded={treeExpanded}
      selected={treeSelectedArray}
      onNodeSelect={handleSelect}
      onNodeToggle={handleToggle}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      multiSelect
    >
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
        className="linked-tree-item"
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node: RenderTree) => toTree(node))
          : null}
      </TreeItem>
    </TreeView>
  );
}
