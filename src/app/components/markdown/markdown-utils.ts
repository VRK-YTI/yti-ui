import { Node as MarkdownNode } from 'commonmark';
import { isDefined } from '../../utils/object';
import { contains } from '../../utils/array';

export function children(node: MarkdownNode): MarkdownNode[] {

  const result: MarkdownNode[] = [];

  if (node.isContainer && node.firstChild) {
    for (let sibling = node.firstChild; isDefined(sibling); sibling = sibling.next) {
      result.push(sibling);
    }
  }

  return result;
}

export function logNotSupportedNode(node: MarkdownNode, supportedNodeTypes: string[]) {
  if (!contains(supportedNodeTypes, node.type)) {
    console.log('Node type NOT SUPPORTED: ' + node.type);
  }
}

export function logNotSupportedNodes(node: MarkdownNode, supportedNodeTypes: string[]) {

  logNotSupportedNode(node, supportedNodeTypes);

  if (node.isContainer) {
    for (const child of children(node)) {
      logNotSupportedNodes(child, supportedNodeTypes);
    }
  }
}
