import {
  SemanticTextDocument,
  SemanticTextFormat,
  SemanticTextLink,
  SemanticTextLiteral,
  SemanticTextNode,
  SemanticTextParagraph,
  SemanticTextSerializer
} from 'app/entities/semantic';
import { assertNever, isDefined, requireDefined } from 'yti-common-ui/utils/object';
import { Node as MarkdownNode, Parser as MarkdownParser } from 'commonmark';
import { allMatching, contains } from 'yti-common-ui/utils/array';
import { escapeHtml } from 'yti-common-ui/utils/string';

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

export function stripSemanticMarkup(text: string, format: SemanticTextFormat, namespaceRoot: string): string {
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

  visit(resolveSerializer(format).deserialize(text, namespaceRoot).document);

  return result.trim();
}

export function removeMatchingLinks(value: string,
                                    format: SemanticTextFormat,
                                    predicate: (destination: string) => boolean,
                                    namespaceRoot: string): string {

  const serializer = resolveSerializer(format);
  return serializer.serialize(serializer.deserialize(value, namespaceRoot).document.removeMatchingLinks(predicate));
}


function ensureType<T extends SemanticTextNode>(node: SemanticTextNode, ...type: string[]): T {
  if (!contains(type, node.type)) {
    throw new Error('Illegal child type');
  }

  return node as T;
}

class MarkdownSerializer implements SemanticTextSerializer {

  serialize(document: SemanticTextDocument) {
    console.error("Deprecated MarkdownSerializer used!");

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

  deserialize(serialized: string, namespaceRoot: string): { document: SemanticTextDocument, valid: boolean } {
    console.error("Deprecated MarkdownSerializer used!");

    function getChildren(node: MarkdownNode): MarkdownNode[] {

      const children: MarkdownNode[] = [];

      if (node.isContainer && node.firstChild) {
        for (let sibling = node.firstChild; isDefined(sibling); sibling = sibling.next) {
          children.push(sibling);
        }
      }

      return children;
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

    function visit(node: MarkdownNode): SemanticTextNode | null {
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
            .map(n => ensureType<SemanticTextLiteral | SemanticTextLink>(requireDefined(n), 'text', 'link')));
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

    return { document: result, valid: true };
  }
}

class XmlSerializer implements SemanticTextSerializer {

  serialize(document: SemanticTextDocument): string {

    function visit(node: SemanticTextNode, lastChild: boolean): string {
      switch (node.type) {
        case 'document':
          return node.children.map((c, i, arr) => visit(c, arr.length - 1 === i)).join('');
        case 'paragraph':
          return node.children.map((c, i, arr) => visit(c, arr.length - 1 === i)).join('') + (lastChild ? '' : '<br />');
        case 'link':
          return `<a href='${node.destination}' data-type='${node.category}'>${node.text}</a>`;
        case 'text':
          return escapeHtml(node.text);
        default:
          return assertNever(node);
      }
    }

    return visit(document, true);
  }

  deserialize(serialized: string, namespaceRoot: string): { document: SemanticTextDocument, valid: boolean } {

    function getFallbackDocument(error?: string) {
      console.error('Invalid searialized Semantic Text' + (error ? ' [' + error + ']' : '') + ': ' + serialized);
      return { document: new SemanticTextDocument([new SemanticTextParagraph([new SemanticTextLiteral(serialized)])]), valid: false };
    }

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

    const documentString = `<document>${serialized}</document>`;
    const document = new DOMParser().parseFromString(documentString, 'application/xml');

    if (document.getElementsByTagName('parsererror').length > 0) {
      return getFallbackDocument('Parse Error');
    }

    const documentNode = document.getElementsByTagName('document')[0];

    function isSupportedNode(node: Node) {
      return node.nodeType === Node.TEXT_NODE || node.nodeName === 'a' || node.nodeName === 'br';
    }

    const children = getChildren(documentNode);

    if (!allMatching(children, child => isSupportedNode(child))) {
      return getFallbackDocument('Unsupported Child');
    }

    // normalize if empty
    if (children.length === 0) {
      children.push(document.createTextNode(''));
    }

    const groupedNodes: Node[][] = [];
    groupedNodes.push([]);
    let currentIndex = 0;

    for (const node of children) {
      switch (node.nodeType) {
        case Node.TEXT_NODE:
          groupedNodes[currentIndex].push(node);
          break;
        case Node.ELEMENT_NODE:
          switch (node.nodeName) {
            case 'a':
              groupedNodes[currentIndex].push(node);
              break;
            case 'br':
              groupedNodes.push([]);
              currentIndex++;
              break;
            default:
              return getFallbackDocument('Unsupported Element: ' + node.nodeName);
          }
          break;
        default:
          return getFallbackDocument('Unsupported Node: ' + node.nodeType);
      }
    }

    try {
      return {
        valid: true, document: new SemanticTextDocument(groupedNodes.map(group => {
          return new SemanticTextParagraph(group.map(node => {
            switch (node.nodeType) {
              case Node.TEXT_NODE:
                return new SemanticTextLiteral(node.nodeValue || '');
              case Node.ELEMENT_NODE:
                switch (node.nodeName) {
                  case 'a':
                    const text = getSingleTextChild(node).nodeValue || '';
                    const destination = node.attributes.getNamedItem('href').value;
                    const type_ = node.attributes.getNamedItem('data-type');
                    if (type_ && type_.value) {
                      const type = type_.value;
                      switch (type) {
                        case 'internal':
                          return new SemanticTextLink(text, destination, 'internal');
                        case 'external':
                          return new SemanticTextLink(text, destination, 'external');
                        default:
                          throw new Error('Unsupported Link: ' + type);
                      }
                    } else {
                      return new SemanticTextLink(text, destination, (destination && destination.startsWith(namespaceRoot)) ? 'internal' : 'external');
                    }
                  default:
                    throw new Error('Unsupported Element: ' + node.nodeName);
                }
              default:
                throw new Error('Unsupported Node: ' + node.nodeType);
            }
          }));
        }))
      };
    } catch(error) {
      return getFallbackDocument(error);
    }
  }
}

export function resolveSerializer(type: SemanticTextFormat): SemanticTextSerializer {
  switch (type) {
    case 'markdown':
      console.error("Deprecated MarkdownSerializer resolved!");
      return new MarkdownSerializer();
    case 'xml':
      return new XmlSerializer();
    default:
      return assertNever(type);
  }
}
