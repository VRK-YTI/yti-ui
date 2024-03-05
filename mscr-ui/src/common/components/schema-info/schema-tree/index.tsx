import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function toTree(nodes: any) {
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
            ? node.children.map((node: any) => toTree(node))
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
          ? nodes.children.map((node: any) => toTree(node))
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
  nodes: any;
  treeSelectedArray: string[];
  treeExpanded: string[];
  performTreeAction: any;
}) {

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
    performTreeAction('handleSelect', event, nodeIds);
  };

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    performTreeAction('treeToggle', event, nodeIds);
  };

  // console.log('TREEVIEW DATA', nodes, treeSelectedArray);
  return (
    <TreeView
      aria-label="controlled"
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
          ? nodes.children.map((node: any) => toTree(node))
          : null}
      </TreeItem>
    </TreeView>
  );
}
