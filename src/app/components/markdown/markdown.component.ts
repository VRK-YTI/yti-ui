import { Component, Input, OnInit } from '@angular/core';
import { Parser, Node as MarkdownNode } from 'commonmark';

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
  }
}
