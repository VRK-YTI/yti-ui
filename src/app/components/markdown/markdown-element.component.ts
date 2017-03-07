import { Component, Input, OnInit } from '@angular/core';
import { Node as MarkdownNode } from 'commonmark';
import { contains } from '../../utils/array';
import { children } from './markdown-utils';

const supportedNodeTypes = ['document', 'paragraph'];

// FIXME: less naive approach to markdown parse tree
@Component({
  selector: '[markdown-element]',
  styleUrls: ['./markdown-element.component.scss'],
  template: `
    <ng-container *ngIf="node.type === 'document'">
      <ng-container *ngFor="let child of children">
        <p *ngIf="child.type === 'paragraph'" markdown-element [node]="child"></p>
      </ng-container>
    </ng-container>
    
    <ng-container *ngIf="node.type === 'paragraph'">
      <ng-container *ngFor="let child of children">
        <u *ngIf="child.type === 'link'">{{child.firstChild.literal}}</u>
        <span *ngIf="child.type === 'text'">{{child.literal}}</span>
      </ng-container>
    </ng-container>
  `
})
export class MarkdownElementComponent implements OnInit {

  @Input() node: MarkdownNode;

  ngOnInit() {
    if (!contains(supportedNodeTypes, this.node.type)) {
      console.log('Node type NOT SUPPORTED: ' + this.node.type);
    }
  }

  get children() {
    return children(this.node);
  }
}
