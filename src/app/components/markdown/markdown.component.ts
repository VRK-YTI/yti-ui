import { Component, Input, OnInit } from '@angular/core';
import { Parser, Node as MarkdownNode } from 'commonmark';
import { Node } from '../../entities/node';

const parser = new Parser();

@Component({
  selector: '[markdown]',
  template: `<div markdown-element [node]="node" [relatedConcepts]="relatedConcepts"></div>`
})
export class MarkdownComponent implements OnInit {

  @Input() value: string;
  @Input() relatedConcepts: Node<'Concept'>[];
  node: MarkdownNode;

  ngOnInit() {
    this.node = parser.parse(this.value);
  }
}
