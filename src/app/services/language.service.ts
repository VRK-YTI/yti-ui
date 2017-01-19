import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Subject } from 'rxjs';

export type Language = string;

@Injectable()
export class LanguageService {

  private _language: Language;
  languageChange$ = new Subject<Language>();

  constructor(private translateService: TranslateService) {
    this._language = 'fi';
    translateService.addLangs(['fi', 'en']);
    translateService.use('fi');
    translateService.setDefaultLang('en');
  }

  get language(): Language {
    return this._language;
  }

  set language(language: Language) {
    this._language = language;
    this.translateService.use(language);
    this.languageChange$.next(language);
  }
}
