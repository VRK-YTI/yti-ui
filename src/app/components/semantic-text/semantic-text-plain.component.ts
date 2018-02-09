import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  SemanticTextNode as SemanticTextNodeImported,
  SemanticTextFormat as SemanticTextFormatImported, SemanticTextDocument,
} from 'app/entities/semantic';
import { removeWhiteSpaceNodes } from 'app/utils/dom';
import { resolveSerializer } from 'app/utils/semantic';

type SemanticTextFormat = SemanticTextFormatImported;
type SemanticTextNode = SemanticTextNodeImported;

@Component({
  selector: '[app-semantic-text-plain]',
  template: `
    <div #self>
      <div app-semantic-text-plain-element [node]="document"></div>
    </div>
  `
})
export class SemanticTextPlainComponent implements OnInit, AfterViewChecked {

  @Input() value: string;
  @Input() format: SemanticTextFormat;
  document: SemanticTextDocument;

  @ViewChild('self') self: ElementRef;

  ngOnInit() {
    this.document = resolveSerializer(this.format).deserialize(this.value);
  }

  ngAfterViewChecked() {
    removeWhiteSpaceNodes(this.self.nativeElement as HTMLElement);
  }
}

@Component({
  selector: '[app-semantic-text-plain-element]',
  styleUrls: ['./semantic-text-plain.component.scss'],
  template: `    
    <ng-container>
      <ng-container *ngFor="let child of node.children" [ngSwitch]="child.type">
      
        <p *ngSwitchCase="'paragraph'" app-semantic-text-plain-element [node]="child"></p>
        <u *ngSwitchCase="'link'">{{child.text}}</u>
        <span *ngSwitchCase="'text'">{{child.text}}</span>
      
      </ng-container>
    </ng-container>
  `
})
export class SemanticTextPlainElementComponent {

  @Input() node: SemanticTextNode;
}
