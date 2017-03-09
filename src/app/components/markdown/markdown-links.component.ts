import { Component, Input, OnInit } from '@angular/core';
import { Parser, Node as MarkdownNode } from 'commonmark';
import { Node } from '../../entities/node';
import { logNotSupportedNodes } from './markdown-utils';

const supportedNodeTypes = ['document', 'paragraph', 'link', 'text'];
const parser = new Parser();

@Component({
  selector: '[markdown-links]',
  template: `<div markdown-links-element [node]="node" [relatedConcepts]="relatedConcepts"></div>`
})
export class MarkdownLinksComponent implements OnInit {

  @Input() value: string;
  @Input() relatedConcepts: Node<'Concept'>[];
  node: MarkdownNode;

  ngOnInit() {
    this.node = parser.parse(this.value);
    logNotSupportedNodes(this.node, supportedNodeTypes);
  }
}
