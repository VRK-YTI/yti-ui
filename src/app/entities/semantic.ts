export type SemanticTextFormat = 'markdown'
                               | 'xml';

export type SemanticTextNode = SemanticTextDocument
                             | SemanticTextParagraph
                             | SemanticTextLink
                             | SemanticTextLiteral;

export class SemanticTextDocument {

  type = 'document' as 'document';

  constructor(public children: SemanticTextParagraph[] = []) {
  }

  get text(): string {
    return '';
  }

  removeMatchingLinks(predicate: (destination: string) => boolean) {
    return new SemanticTextDocument(this.children.map(n => n.removeMatchingLinks(predicate)));
  }
}

export class SemanticTextParagraph {

  type = 'paragraph' as 'paragraph';

  constructor(public children: (SemanticTextLiteral|SemanticTextLink)[] = []) {
  }

  get text(): string {
    return '';
  }

  removeMatchingLinks(predicate: (destination: string) => boolean) {
    return new SemanticTextParagraph(this.children.map(n => n.removeMatchingLinks(predicate)));
  }
}

export class SemanticTextLink {

  type = 'link' as 'link';

  constructor(public text: string, public destination: string) {
  }

  get children(): SemanticTextNode[] {
    return [];
  }

  removeMatchingLinks(predicate: (destination: string) => boolean) {
    if (predicate(this.destination)) {
      return new SemanticTextLiteral(this.text);
    } else {
      return this;
    }
  }
}

export class SemanticTextLiteral {

  type = 'text' as 'text';

  constructor(public text: string) {
  }

  get children(): SemanticTextNode[] {
    return [];
  }

  removeMatchingLinks(predicate: (destination: string) => boolean) {
    return this;
  }
}

export interface SemanticTextSerializer {
  serialize(semanticTextDocument: SemanticTextDocument): string;
  deserialize(serialized: string): SemanticTextDocument;
}
