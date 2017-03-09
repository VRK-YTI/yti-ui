import { Component, Input, OnInit } from '@angular/core';
import { Parser, Node as MarkdownNode } from 'commonmark';
import { logNotSupportedNodes } from './markdown-utils';

const supportedNodeTypes = ['document', 'paragraph', 'link', 'text'];
const parser = new Parser();

@Component({
  selector: '[markdown]',
  template: `<div markdown-element [node]="node"></div>`
})
export class MarkdownComponent implements OnInit {

  @Input() value: string;
  node: MarkdownNode;

  ngOnInit() {
    this.node = parser.parse(this.value);
    logNotSupportedNodes(this.node, supportedNodeTypes);
  }
}
