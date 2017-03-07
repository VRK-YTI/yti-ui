import { Node as MarkdownNode } from 'commonmark';
import { isDefined } from '../../utils/object';

export function children(node: MarkdownNode): MarkdownNode[] {

  const result: MarkdownNode[] = [];

  if (node.isContainer && node.firstChild) {
    for (let sibling = node.firstChild; isDefined(sibling); sibling = sibling.next) {
      result.push(sibling);
    }
  }

  return result;
}
