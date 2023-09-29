import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import {useEffect} from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


function toTree(nodes: any) {
    const ret = <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name} className='linked-tree-item'>
        {Array.isArray(nodes.children)
            ? nodes.children.map((node: any) => toTree(node))
            : null}
    </TreeItem>
    return ret;
}


export default function SchemaTree({nodes, treeSelectedArray, treeExpanded, isSourceTree, performTreeAction}: {nodes: any, treeSelectedArray: string[], treeExpanded: string[], isSourceTree: boolean, performTreeAction: any}) {

    const handleSelect = (event: React.SyntheticEvent, nodeIds: string[]) => {
        performTreeAction(isSourceTree, 'handleSelect', event, nodeIds);
    };

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        performTreeAction(isSourceTree, 'treeToggle', event, nodeIds);
    };

    return (<TreeView
                aria-label="controlled"
                expanded={treeExpanded}
                selected={treeSelectedArray}
                onNodeSelect={handleSelect}
                onNodeToggle={handleToggle}
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
            >
                <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name} className='linked-tree-item'>
                    {Array.isArray(nodes.children)
                        ? nodes.children.map((node: any) => toTree(node))
                        : null}
                </TreeItem>
            </TreeView>
    );
}
