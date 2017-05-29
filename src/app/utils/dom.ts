
export class DomPoint {

  public path = new DomPath(this.root, this.node);

  constructor(private root: Node, public node: Node, public offset: number) {
  }
}

export class DomSelection {

  public start: DomPoint;
  public end: DomPoint;

  constructor(root: Node) {

    const s = window.getSelection();

    const anchor = new DomPoint(root, s.anchorNode, s.anchorOffset);
    const focus = new DomPoint(root, s.focusNode, s.focusOffset);

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
}

export class DomPath {

  private path: { node: Node, index: number}[] = [];

  constructor(root: Node, public node: Node) {

    let walk = node;

    while (walk !== root) {
      this.path.unshift({node: walk, index: indexInParent(walk)});
      walk = walk.parentNode!;
    }
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

export function indexInParent(child: Node): number {

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
