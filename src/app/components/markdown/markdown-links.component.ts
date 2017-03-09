import { Component, Input, OnInit } from '@angular/core';
import { Parser, Node as MarkdownNode } from 'commonmark';
import { Node } from '../../entities/node';
import { children, logNotSupportedNodes } from './markdown-utils';
import { first } from '../../utils/array';
import { Localizable } from '../../entities/localization';

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

@Component({
  selector: '[markdown-links-element]',
  styleUrls: ['./markdown-links.component.scss'],
  template: `
    <ng-container>
      <ng-container *ngFor="let child of children" [ngSwitch]="child.type">
              
        <p *ngSwitchCase="'paragraph'" markdown-links-element [node]="child" [relatedConcepts]="relatedConcepts"></p>
        <a *ngSwitchCase="'link'" [routerLink]="link(child)" [ngbPopover]="popContent" triggers="mouseenter:mouseleave">{{child.firstChild.literal}}</a>
        <span *ngSwitchCase="'text'">{{child.literal}}</span>
        
        <template #popContent>
          <div markdown [value]="conceptDefinition(child) | translateValue"></div>
        </template>
      
      </ng-container>
    </ng-container>
  `
})
export class MarkdownLinksElementComponent {

  @Input() node: MarkdownNode;
  @Input() relatedConcepts: Node<'Concept'>[];

  private getTargetConceptNode(node: MarkdownNode): Node<'Concept'>|null {
    // FIXME: proper mapping
    return first(this.relatedConcepts, concept => node.destination.indexOf(concept.code) !== -1);
  }

  link(node: MarkdownNode) {
    const target = this.getTargetConceptNode(node);
    if (target) {
      return ['/concepts', target.graphId, 'concept', target.id];
    } else {
      return [];
    }
  }

  conceptDefinition(node: MarkdownNode): Localizable|null {
    const target = this.getTargetConceptNode(node);
    if (target) {
      return target.getPropertyAsLocalizable('definition');
    }
    return null;
  }

  get children() {
    return children(this.node);
  }
}
