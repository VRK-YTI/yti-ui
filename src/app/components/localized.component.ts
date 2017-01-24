import { Component, Input } from '@angular/core';

@Component({
  selector: 'localized',
  styleUrls: ['./localized.component.scss'],
  template: `
    <div class="localized" *ngFor="let localization of value | entries">
      <div class="language">{{localization.key}}</div>
      <div class="localization">{{localization.value}}</div>
    </div>
  `
})
export class LocalizedComponent {

  @Input() value: { [language: string]: string; };
}
