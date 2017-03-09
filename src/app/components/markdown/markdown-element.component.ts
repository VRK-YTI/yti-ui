import { Component, Input } from '@angular/core';
import { Node as MarkdownNode } from 'commonmark';
import { children } from './markdown-utils';

@Component({
  selector: '[markdown-element]',
  styleUrls: ['./markdown-element.component.scss'],
  template: `    
    <ng-container *ngIf="node.isContainer">
      <ng-container *ngFor="let child of children">
        <p *ngIf="child.type === 'paragraph'" markdown-element [node]="child"></p>
        <u *ngIf="child.type === 'link'">{{child.firstChild.literal}}</u>
        <span *ngIf="child.type === 'text'">{{child.literal}}</span>
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
