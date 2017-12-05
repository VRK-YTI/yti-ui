import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Parser, Node as MarkdownNode } from 'commonmark';
import { ConceptNode } from '../../entities/node';
import { logUnsupportedNodes, removeWhiteSpaceNodes, children } from '../../utils/markdown';
import { firstMatching } from 'yti-common-ui/utils/array';
import { Localizable } from 'yti-common-ui/types/localization';
import { asLocalizable } from 'yti-common-ui/utils/localization';

const supportedNodeTypes = ['document', 'paragraph', 'link', 'text'];
const parser = new Parser();

@Component({
  selector: '[app-markdown-links]',
  template: `
    <div #self>
      <div app-markdown-links-element [node]="node" [relatedConcepts]="relatedConcepts"></div>
    </div>
  `
})
export class MarkdownLinksComponent implements OnInit, AfterViewChecked {

  @Input() value: string;
  @Input() relatedConcepts: ConceptNode[];
  node: MarkdownNode;

  @ViewChild('self') self: ElementRef;

  ngOnInit() {
    this.node = parser.parse(this.value);
    logUnsupportedNodes(this.node, supportedNodeTypes);
  }

  ngAfterViewChecked() {
    removeWhiteSpaceNodes(this.self.nativeElement as HTMLElement);
  }
}

@Component({
  selector: '[app-markdown-links-element]',
  styleUrls: ['./markdown-links.component.scss'],
  template: `
    <ng-container>
      <ng-container *ngFor="let child of children" [ngSwitch]="child.type">
              
        <p *ngSwitchCase="'paragraph'" 
           app-markdown-links-element 
           [node]="child" 
           [relatedConcepts]="relatedConcepts"></p>
        
        <a *ngSwitchCase="'link'" 
           [routerLink]="link(child)" 
           [popoverTitle]="conceptLabel(child) | translateValue" 
           [ngbPopover]="popContent" 
           triggers="mouseenter:mouseleave">{{child.firstChild.literal}}</a>
        
        <span *ngSwitchCase="'text'">{{child.literal}}</span>
        
        <ng-template #popContent>
          <div app-markdown [value]="conceptDefinition(child) | translateValue"></div>
        </ng-template>
      
      </ng-container>
    </ng-container>
  `
})
export class MarkdownLinksElementComponent {

  @Input() node: MarkdownNode;
  @Input() relatedConcepts: ConceptNode[];

  private getTargetConceptNode(node: MarkdownNode): ConceptNode|null {
    return firstMatching(this.relatedConcepts, concept => concept.isTargetOfLink(node.destination));
  }

  link(node: MarkdownNode) {
    const target = this.getTargetConceptNode(node);
    if (target) {
      return ['/concepts', target.graphId, 'concept', target.id];
    } else {
      return [];
    }
  }

  conceptLabel(node: MarkdownNode): Localizable|null {
    const target = this.getTargetConceptNode(node);
    return target ? target.label : null;
  }

  conceptDefinition(node: MarkdownNode): Localizable|null {
    const target = this.getTargetConceptNode(node);
    return target ? asLocalizable(target.definition, true) // FIXME: how to handle multiple definitions?
                  : null;
  }

  get children() {
    return children(this.node);
  }
}
