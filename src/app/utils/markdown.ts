import { Parser, Node as MarkdownNode } from 'commonmark';
import { isDefined } from './object';
import { contains } from './array';

const parser = new Parser();

export function children(node: MarkdownNode): MarkdownNode[] {

  const result: MarkdownNode[] = [];

  if (node.isContainer && node.firstChild) {
    for (let sibling = node.firstChild; isDefined(sibling); sibling = sibling.next) {
      result.push(sibling);
    }
  }

  return result;
}

export function logUnsupportedNode(node: MarkdownNode, supportedNodeTypes: string[]) {
  if (!contains(supportedNodeTypes, node.type)) {
    console.log('Node type NOT SUPPORTED: ' + node.type);
  }
}

export function logUnsupportedNodes(node: MarkdownNode, supportedNodeTypes: string[]) {

  logUnsupportedNode(node, supportedNodeTypes);

  if (node.isContainer) {
    for (const child of children(node)) {
      logUnsupportedNodes(child, supportedNodeTypes);
    }
  }
}

export function removeWhiteSpaceNodes(node: Node) {

  const children = node.childNodes;
  const removeChildNodes: Node[] = [];

  for (let i = 0; i < children.length; i++) {

    const child = children[i];

    switch (child.nodeType) {
      case Node.TEXT_NODE:
        if (!child.nodeValue!.trim() && child.nodeValue!.indexOf('\n') !== -1) {
          removeChildNodes.push(child);
        }
        break;
      case Node.ELEMENT_NODE:
        removeWhiteSpaceNodes(child);
        break;
      default:
      // NOP
    }
  }

  for (const childNode of removeChildNodes) {
    node.removeChild(childNode);
  }
}

class StringBuilder {

  private _value = '';

  append(s: string) {
    this._value += s;
  }

  get value() {
    return this._value;
  }
}

export function stripMarkdown(md: string): string {

  const sb = new StringBuilder();

  const visit = (node: MarkdownNode) => {
    if (node.literal !== null) {
      sb.append(node.literal);
    }

    for (const child of children(node)) {
      visit(child);
    }
  };

  visit(parser.parse(md));

  return sb.value;
}
