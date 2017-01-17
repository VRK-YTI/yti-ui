import { Component } from '@angular/core';
import { LanguageService, Language } from '../services/language.service';

@Component({
  selector: 'navigation-bar',
  styleUrls: ['./navigation-bar.component.scss'],
  template: `
    <nav class="navbar navbar-toggleable-md fixed-top navbar-inverse bg-primary">

      <a class="navbar-brand" [routerLink]="['/']"><span>IOW-TERMED</span></a>
    
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item" *ngFor="let language of languages">
            <a class="nav-link" (click)="setLanguage(language.code)">{{language.name}}</a>
          </li>
        </ul>
      </div>
    </nav>
  `
})
export class NavigationBarComponent {

  languages = [
    { code: 'fi' as Language, name: 'Suomeksi' },
    { code: 'en' as Language, name: 'In english' }
  ];

  constructor(private languageService: LanguageService) {
  }

  setLanguage(language: Language) {
    this.languageService.language = language;
  }
}
