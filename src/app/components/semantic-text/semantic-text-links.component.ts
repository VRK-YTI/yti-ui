import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ConceptNode } from 'app/entities/node';
import {
  SemanticTextNode as SemanticTextNodeImported, SemanticTextFormat as SemanticTextFormatImported, SemanticTextLink,
  SemanticTextDocument, SemanticTextParagraph, SemanticTextLiteral
} from 'app/entities/semantic';
import { removeWhiteSpaceNodes } from 'app/utils/dom';
import { firstMatching } from 'yti-common-ui/utils/array';
import { Localizable } from 'yti-common-ui/types/localization';
import { asLocalizable } from 'yti-common-ui/utils/localization';
import { resolveSerializer } from 'app/utils/semantic';
import { ConfigurationService } from '../../services/configuration.service';

type SemanticTextNode = SemanticTextNodeImported;
type SemanticTextFormat = SemanticTextFormatImported;

@Component({
  selector: '[app-semantic-text-links]',
  template: `
    <div #self>
      <div app-semantic-text-links-element
           [node]="document"
           [invalidData]="invalidData"
           [format]="format"
           [relatedConcepts]="relatedConcepts"></div>
    </div>
  `
})
export class SemanticTextLinksComponent implements OnInit, AfterViewChecked {

  @Input() value: string;
  @Input() format: SemanticTextFormat;
  @Input() relatedConcepts: ConceptNode[];
  document: SemanticTextDocument;
  invalidData: boolean = false;

  @ViewChild('self') self: ElementRef;

  constructor(private configurationService : ConfigurationService) {
  }

  ngOnInit() {
    const {document, valid} = resolveSerializer(this.format).deserialize(this.value, this.configurationService.namespaceRoot);
    this.document = document;
    this.invalidData = !valid;
  }

  ngAfterViewChecked() {
    removeWhiteSpaceNodes(this.self.nativeElement as HTMLElement);
  }
}

@Component({
  selector: '[app-semantic-text-links-element]',
  styleUrls: ['./semantic-text-links.component.scss'],
  template: `
    <ng-container>
      <ng-container *ngFor="let child of node.children" [ngSwitch]="child.type">

        <p *ngSwitchCase="'paragraph'"
           app-semantic-text-links-element
           [ngClass] = '{"invalid-data": invalidData}'
           [node]="child"
           [format]="format"
           [relatedConcepts]="relatedConcepts"></p>

        <ng-container *ngSwitchCase="'link'">
          <a *ngIf="child.category === 'internal'"
             [class]="child.category"
             [routerLink]="link(child)"
             [popoverTitle]="conceptLabel(child) | translateValue"
             [ngbPopover]="popContent"
             triggers="mouseenter:mouseleave">{{child.text}}</a>
          <a *ngIf="child.category === 'external'"
             target="_blank"
             rel="noopener noreferrer"
             [class]="child.category"
             [href]="child.destination"
             [popoverTitle]="'External link' | translate"
             [ngbPopover]="popContentExt"
             triggers="mouseenter:mouseleave">{{child.text}}<i class="fas fa-external-link-alt"></i></a>
        </ng-container>

        <span *ngSwitchCase="'text'">{{child.text}}</span>

        <ng-template #popContent>
          <div app-semantic-text-plain
               [value]="conceptDefinition(child) | translateValue"
               [format]="format"></div>
        </ng-template>

        <ng-template #popContentExt>
          <div>{{child.destination}}</div>
        </ng-template>
      </ng-container>
    </ng-container>
  `
})
export class SemanticTextLinksElementComponent {

  @Input() node: SemanticTextNode;
  @Input() relatedConcepts: ConceptNode[];
  @Input() format: SemanticTextFormat;
  @Input() invalidData: boolean = false;

  private getTargetConceptNode(node: SemanticTextLink): ConceptNode | null {
    return firstMatching(this.relatedConcepts, concept => concept.isTargetOfLink(node.destination));
  }

  link(node: SemanticTextLink) {
    const target = this.getTargetConceptNode(node);
    if (target) {
      return ['/concepts', target.graphId, 'concept', target.id];
    } else {
      return [];
    }
  }

  conceptLabel(node: SemanticTextLink): Localizable | null {
    const target = this.getTargetConceptNode(node);
    return target ? target.label : null;
  }

  conceptDefinition(node: SemanticTextLink): Localizable | null {
    // FIXME: how to handle multiple definitions?
    const target = this.getTargetConceptNode(node);
    return target ? asLocalizable(target.definition, true) : null;
  }
}
