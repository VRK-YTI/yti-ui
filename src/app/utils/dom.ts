
export class DomPoint {

  private constructor(public node: Node, public offset: number, public path: DomPath) {
  }

  static create(root: Node, node: Node, offset: number): DomPoint|null {

    const path = DomPath.create(root, node);

    if (!path) {
      return null;
    }

    return new DomPoint(node, offset, path);
  }
}

export class DomSelection {

  public start: DomPoint;
  public end: DomPoint;

  private constructor(anchor: DomPoint, focus: DomPoint) {

    function compareDomPoints(a: DomPoint, b: DomPoint): number {

      if (a.node === b.node) {
        return a.offset === b.offset ? 0 : a.offset > b.offset ? 1 : -1;
      } else {

        const maxLength = Math.max(a.path.length, b.path.length);

        for (let i = 0; i < maxLength; i++) {

          if (i >= a.path.length) {
            return 1;
          } else if (i >= b.path.length) {
            return -1;
          } else {

            const lhs = a.path.get(i).index;
            const rhs = b.path.get(i).index;

            if (lhs > rhs) {
              return 1;
            } else if (lhs < rhs) {
              return -1;
            }
          }
        }

        console.log('A', a.path.toString());
        console.log('B', b.path.toString());
        throw new Error('Algorithm broken');
      }
    }

    const points = [anchor, focus];
    points.sort((a, b) => compareDomPoints(a, b));
    this.start = points[0];
    this.end = points[1];
  }

  static create(root: Node): DomSelection|null {

    const s = window.getSelection();

    const anchor = DomPoint.create(root, s.anchorNode, s.anchorOffset);
    const focus = DomPoint.create(root, s.focusNode, s.focusOffset);

    if (!anchor || !focus) {
      return null;
    }

    return new DomSelection(anchor, focus);
  }
}

export class DomPath {

  private constructor(private path: { node: Node, index: number}[]) {
  }

  static create(root: Node, node: Node): DomPath|null {

    const path: { node: Node, index: number}[] = [];

    let walk = node;

    while (walk !== root) {

      const index = indexInParent(walk);

      if (index === null) {
        return null;
      }

      path.unshift({node: walk, index});

      if (!walk.parentNode) {
        return null;
      }

      walk = walk.parentNode;
    }

    return new DomPath(path);
  }

  get indicesFromRoot() {
    return this.path.map(x => x.index);
  }

  get length() {
    return this.path.length;
  }

  get(index: number) {
    return this.path[index];
  }

  toString() {
    let result = '';
    let first = true;

    for (const p of this.path) {

      if (!first) {
        result += ' -> ';
      }

      result += p.node.nodeName + '(' + p.index + ')' + (p.node.nodeType === Node.TEXT_NODE ? ` [${p.node.textContent}]` : '');
      first = false;
    }

    return result;
  }
}

export function removeChildren(node: Node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild!);
  }
}

function indexInParent(child: Node): number|null {

  if (!child.parentNode) {
    // TODO check why detached node can actually exist here
    return null;
  }

  const children = child.parentNode!.childNodes;

  for (let i = 0; i < children.length; i++) {
    if (children[i] === child) {
      return i;
    }
  }

  throw new Error('Child not found in parent children');
}

export function moveCursor(textNode: Node, offset: number) {

  if (textNode.nodeType !== Node.TEXT_NODE) {
    console.log(textNode);
    throw new Error('Not a text node');
  }

  const range = document.createRange();
  const selection = window.getSelection();
  range.setStart(textNode, offset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

export const nbsp = '\u00A0';

export function formatTextContent(text: string): string {

  let result = '';
  let spacesStartingPosition: number|null = null;

  for (let i = 0; i < text.length; i++) {

    const lookingAt = text.charAt(i);

    if (lookingAt === ' ') {
      if (spacesStartingPosition === null) {
        spacesStartingPosition = i;
      }
    } else {
      if (spacesStartingPosition !== null) {
        result += formatSpaces(i - spacesStartingPosition, spacesStartingPosition === 0);
        spacesStartingPosition = null;
      }

      result += lookingAt;
    }
  }

  if (spacesStartingPosition !== null) {
    result += formatSpaces(text.length - spacesStartingPosition, true);
  }

  return result;
}

function formatSpaces(amount: number, singleAsNbsp: boolean): string {

  if (amount === 1) {
    return singleAsNbsp ? nbsp : ' ';
  } else {

    let result = '';

    for (let j = 1; j < amount; j++) {
      if (j % 2 === 0) {
        result += ' ';
      } else {
        result += nbsp;
      }
    }

    result += nbsp;

    return result;
  }
}

export function isInDocument(node: Node|null) {
  while (node !== null) {
    if (node === document) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
