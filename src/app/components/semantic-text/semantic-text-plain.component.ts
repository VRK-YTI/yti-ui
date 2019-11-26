import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  SemanticTextNode as SemanticTextNodeImported,
  SemanticTextFormat as SemanticTextFormatImported, SemanticTextDocument, SemanticTextParagraph, SemanticTextLiteral,
} from 'app/entities/semantic';
import { removeWhiteSpaceNodes } from 'app/utils/dom';
import { resolveSerializer } from 'app/utils/semantic';
import { ConfigurationService } from '../../services/configuration.service';

type SemanticTextFormat = SemanticTextFormatImported;
type SemanticTextNode = SemanticTextNodeImported;

@Component({
  selector: '[app-semantic-text-plain]',
  template: `
    <div #self>
      <div app-semantic-text-plain-element [node]="document" [invalidData]="invalidData"></div>
    </div>
  `
})
export class SemanticTextPlainComponent implements AfterViewChecked, OnChanges {

  @Input() value: string;
  @Input() format: SemanticTextFormat;
  document: SemanticTextDocument;
  invalidData: boolean = false;

  @ViewChild('self') self: ElementRef;

  constructor(private configurationService : ConfigurationService) {
  }

  ngAfterViewChecked() {
    removeWhiteSpaceNodes(this.self.nativeElement as HTMLElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const simpleChange = changes['value'];
    if (simpleChange && simpleChange.currentValue !== simpleChange.previousValue) {
      const {document, valid} = resolveSerializer(this.format).deserialize(this.value, this.configurationService.namespaceRoot);
      this.document = document;
      this.invalidData = !valid;
    }
  }
}

@Component({
  selector: '[app-semantic-text-plain-element]',
  styleUrls: ['./semantic-text-plain.component.scss'],
  template: `    
    <ng-container>
      <ng-container *ngFor="let child of node.children" [ngSwitch]="child.type">
      
        <p *ngSwitchCase="'paragraph'" app-semantic-text-plain-element [node]="child" [ngClass] = '{"invalid-data": invalidData}'></p>
        <u *ngSwitchCase="'link'">{{child.text}}</u>
        <span *ngSwitchCase="'text'">{{child.text}}</span>
      
      </ng-container>
    </ng-container>
  `
})
export class SemanticTextPlainElementComponent {
  @Input() node: SemanticTextNode;
  @Input() invalidData: boolean;
}
