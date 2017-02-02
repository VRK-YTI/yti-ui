import { Component, Input, OnInit } from '@angular/core';
import { Node as MarkdownNode } from 'commonmark';
import { Node } from '../../entities/node';
import { isDefined } from '../../utils/object';
import { contains, first } from '../../utils/array';

const supportedNodeTypes = ['document', 'paragraph'];

// FIXME: less naive approach to markdown parse tree
@Component({
  selector: '[markdown-element]',
  styleUrls: ['./markdown-element.component.scss'],
  template: `
    <ng-container *ngIf="node.type === 'document'">
      <ng-container *ngFor="let child of children(node)">
        <p *ngIf="child.type === 'paragraph'" markdown-element [node]="child" [relatedConcepts]="relatedConcepts"></p>
      </ng-container>
    </ng-container>
    
    <ng-container *ngIf="node.type === 'paragraph'">
      <ng-container *ngFor="let child of children(node)">
        <a *ngIf="child.type === 'link'" [routerLink]="link(child)">{{child.firstChild.literal}}</a>
        <span *ngIf="child.type === 'text'">{{child.literal}}</span>
      </ng-container>
    </ng-container>
  `
})
export class MarkdownElementComponent implements OnInit {

  @Input() node: MarkdownNode;
  @Input() relatedConcepts: Node<'Concept'>[];

  ngOnInit() {
    if (!contains(supportedNodeTypes, this.node.type)) {
      console.log('Node type NOT SUPPORTED: ' + this.node.type);
    }
  }

  link(node: MarkdownNode) {

    // FIXME: proper mapping
    const target = first(this.relatedConcepts, concept => node.destination.indexOf(concept.code) !== -1);

    if (target) {
      return ['/concepts', target.graphId, 'concept', target.id];
    } else {
      return [];
    }
  }

  children(node: MarkdownNode) {

    const result: MarkdownNode[] = [];

    if (this.node.isContainer && node.firstChild) {
      for (let sibling = this.node.firstChild; isDefined(sibling); sibling = sibling.next) {
        result.push(sibling);
      }
    }

    return result;
  }
}
