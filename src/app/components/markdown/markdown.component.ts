import { Component, Input, OnInit } from '@angular/core';
import { Parser, Node as MarkdownNode } from 'commonmark';
import { children, logNotSupportedNodes } from './markdown-utils';

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

@Component({
  selector: '[markdown-element]',
  styleUrls: ['./markdown.component.scss'],
  template: `    
    <ng-container>
      <ng-container *ngFor="let child of children" [ngSwitch]="child.type">
      
        <p *ngSwitchCase="'paragraph'" markdown-element [node]="child"></p>
        <u *ngSwitchCase="'link'">{{child.firstChild.literal}}</u>
        <span *ngSwitchCase="'text'">{{child.literal}}</span>
      
      </ng-container>
    </ng-container>
  `
})
export class MarkdownElementComponent {

  @Input() node: MarkdownNode;

  get children() {
    return children(this.node);
  }
}
