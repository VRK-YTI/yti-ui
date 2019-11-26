import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  SemanticTextNode as SemanticTextNodeImported,
  SemanticTextFormat as SemanticTextFormatImported, SemanticTextDocument, SemanticTextParagraph, SemanticTextLiteral,
} from 'app/entities/semantic';
import { removeWhiteSpaceNodes } from 'app/utils/dom';
import { resolveSerializer } from 'app/utils/semantic';

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

  ngAfterViewChecked() {
    removeWhiteSpaceNodes(this.self.nativeElement as HTMLElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const simpleChange = changes['value'];
    if (simpleChange && simpleChange.currentValue !== simpleChange.previousValue) {
      try {
        this.document = resolveSerializer(this.format).deserialize(this.value);
        this.invalidData = false;
      } catch(Error) {
        this.invalidData = true;
        this.document = new SemanticTextDocument([new SemanticTextParagraph([new SemanticTextLiteral(this.value)])]);
      }
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
