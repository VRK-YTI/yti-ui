import {
  SemanticTextDocument, SemanticTextFormat, SemanticTextLink, SemanticTextLiteral, SemanticTextNode, SemanticTextParagraph,
  SemanticTextSerializer
} from 'app/entities/semantic';
import { assertNever, isDefined, requireDefined } from 'yti-common-ui/utils/object';
import { Node as MarkdownNode, Parser as MarkdownParser } from 'commonmark';
import { contains, allMatching } from 'yti-common-ui/utils/array';

export function areNodesEqual(lhs: SemanticTextNode, rhs: SemanticTextNode) {

  if (lhs.type !== rhs.type || lhs.text !== rhs.text) {
    return false;
  }

  if (lhs.type === 'link' && rhs.type === 'link' && lhs.destination !== rhs.destination) {
    return false;
  }

  if (lhs.children.length !== rhs.children.length) {
    return false;
  }

  for (let i = 0; i < lhs.children.length; i++) {
    if (!areNodesEqual(lhs.children[i], rhs.children[i])) {
      return false;
    }
  }

  return true;
}

export function stripSemanticMarkup(text: string, format: SemanticTextFormat): string {

  let result = '';

  const visit = (n: SemanticTextNode) => {

    if (n.type === 'paragraph') {
      result += '\n\n';
    }

    result += n.text;

    for (const child of n.children) {
      visit(child);
    }
  };

  visit(resolveSerializer(format).deserialize(text));

  return result.trim();
}

export function removeMatchingLinks(value: string,
                                    format: SemanticTextFormat,
                                    predicate: (destination: string) => boolean): string {

  const serializer = resolveSerializer(format);
  return serializer.serialize(serializer.deserialize(value).removeMatchingLinks(predicate));
}


function ensureType<T extends SemanticTextNode>(node: SemanticTextNode, ...type: string[]): T {
  if (!contains(type, node.type)) {
    throw new Error('Illegal child type');
  }

  return node as T;
}

class MarkdownSerializer implements SemanticTextSerializer {

  serialize(document: SemanticTextDocument) {

    function visit(node: SemanticTextNode): string {
      switch (node.type) {
        case 'document':
          return node.children.map(c => visit(c)).join('').trim();
        case 'paragraph':
          return '\n\n' + node.children.map(c => visit(c)).join('');
        case 'link':
          return `[${node.text}](${node.destination})`;
        case 'text':
          return node.text;
        default:
          return assertNever(node);
      }
    }

    return visit(document);
  }

  deserialize(serialized: string): SemanticTextDocument {

    function getChildren(node: MarkdownNode): MarkdownNode[] {

      const result: MarkdownNode[] = [];

      if (node.isContainer && node.firstChild) {
        for (let sibling = node.firstChild; isDefined(sibling); sibling = sibling.next) {
          result.push(sibling);
        }
      }

      return result;
    }

    function getSingleTextChild(parent: MarkdownNode) {

      const children = getChildren(parent);

      if (children.length !== 1) {
        throw new Error('Exactly one child required, was: ' + children.length);
      }

      const child = children[0];

      if (child.type !== 'text') {
        throw new Error('Child must be literal, was: ' + child.type);
      }

      return child;
    }

    function visit(node: MarkdownNode): SemanticTextNode|null {
      switch (node.type) {
        case 'document':
          return new SemanticTextDocument(getChildren(node)
            .map(n => visit(n))
            .filter(n => n != null)
            .map(n => ensureType<SemanticTextParagraph>(requireDefined(n), 'paragraph')));
        case 'paragraph':
          return new SemanticTextParagraph(getChildren(node)
            .map(n => visit(n))
            .filter(n => n != null)
            .map(n => ensureType<SemanticTextLiteral|SemanticTextLink>(requireDefined(n), 'text', 'link')));
        case 'link':
          return new SemanticTextLink(getSingleTextChild(node).literal, node.destination);
        case 'text':
          return new SemanticTextLiteral(node.literal);
        default:
          console.log('Node type NOT SUPPORTED: ' + node.type);
          return null;
      }
    }

    const result = visit(new MarkdownParser().parse(serialized));

    if (result == null || result.type !== 'document') {
      throw new Error('Cannot parse markdown: ' + serialized);
    }

    return result;
  }
}

class XmlSerializer implements SemanticTextSerializer {

  serialize(document: SemanticTextDocument): string {

    function visit(node: SemanticTextNode): string {
      switch (node.type) {
        case 'document':
          return '<ol>' + node.children.map(c => visit(c)).join('').trim() + '</ol>';
        case 'paragraph':
          return '<li>' + node.children.map(c => visit(c)).join('') + '</li>';
        case 'link':
          return `<a href='${node.destination}'>${node.text}</a>`;
        case 'text':
          return node.text;
        default:
          return assertNever(node);
      }
    }

    return visit(document);
  }

  deserialize(serialized: string): SemanticTextDocument {

    function getChildren(node: Node): Node[] {
      return Array.prototype.slice.call(node.childNodes);
    }

    function getSingleTextChild(parent: Node) {

      if (parent.childNodes.length !== 1) {
        throw new Error('Exactly one child required, was: ' + parent.childNodes.length);
      }

      const child = parent.firstChild!;

      if (child.nodeType !== Node.TEXT_NODE) {
        throw new Error('Child must be TEXT_NODE, was: ' + child.nodeType);
      }

      return child;
    }

    function visit(node: Node): SemanticTextNode|null {

      switch (node.nodeType) {
        case Node.TEXT_NODE:
          return new SemanticTextLiteral(node.nodeValue || '');
        case Node.ELEMENT_NODE:
          switch (node.nodeName) {
            case 'ol':
              return new SemanticTextDocument(getChildren(node)
                .map(n => visit(n))
                .filter(n => n != null)
                .map(n => ensureType<SemanticTextParagraph>(requireDefined(n), 'paragraph')));
            case 'li':
              return new SemanticTextParagraph(getChildren(node)
                .map(n => visit(n))
                .filter(n => n != null)
                .map(n => ensureType<SemanticTextLink|SemanticTextLiteral>(requireDefined(n), 'link', 'text')));
            case 'a':
              const text = getSingleTextChild(node).nodeValue || '';
              const destination = node.attributes.getNamedItem('href').value;
              return new SemanticTextLink(text, destination);
            default:
              console.log('Element NOT SUPPORTED: ' + node.nodeName);
              return null;
          }
        default:
          console.log('Node type NOT SUPPORTED: ' + node.nodeType);
          return null;
      }
    }

    const document = new DOMParser().parseFromString(`
          <document>${serialized}</document>
      `, 'application/xml');

    if (document.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Cannot parse XML: ' + serialized);
    }

    const documentNode = document.getElementsByTagName('document')[0];

    function isTextOrLink(node: Node) {
      return node.nodeType === Node.TEXT_NODE || node.nodeName === 'a';
    }

    function normalizeOrderedList(): Node {

      const children = getChildren(documentNode);
      const normalizedChildren = children.length > 0 ? children : [document.createTextNode('')];
      const firstChild = normalizedChildren[0];

      if (normalizedChildren.length === 1 && firstChild.nodeName === 'ol') {
        return firstChild;
      } else if (allMatching(normalizedChildren, child => isTextOrLink(child))) {

        const orderedList = document.createElement('ol');
        const listItem = document.createElement('li');
        orderedList.appendChild(listItem);

        for (const child of normalizedChildren) {
          listItem.appendChild(child);
        }

        return orderedList;

      } else {
        console.log(documentNode);
        throw new Error('Cannot parse xml');
      }
    }

    const result = visit(normalizeOrderedList());

    if (result == null || result.type !== 'document') {
      console.log(documentNode);
      throw new Error('Cannot parse xml');
    }

    return result;
  }
}

export function resolveSerializer(type: SemanticTextFormat): SemanticTextSerializer {
  switch (type) {
    case 'markdown':
      return new MarkdownSerializer();
    case 'xml':
      return new XmlSerializer();
    default:
      return assertNever(type);
  }
}
