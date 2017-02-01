import { Component, Input } from '@angular/core';
import { Node } from '../entities/node';

@Component({
  selector: 'localized',
  styleUrls: ['./localized.component.scss'],
  template: `
    <div class="localized" *ngFor="let localization of value">
      <div class="language">{{localization.lang}}</div>
      <div class="localization"><div markdown [value]="localization.value" [relatedConcepts]="relatedConcepts"></div></div>
    </div>
  `
})
export class LocalizedComponent {

  @Input() value: { [language: string]: string; };
  @Input() relatedConcepts: Node<'Concept'>[];
}
