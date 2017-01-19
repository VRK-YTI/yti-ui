import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Subject } from 'rxjs';
import { Localizable } from '../entities/localization';

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

  translate(localizable: Localizable) {
    if (localizable.hasOwnProperty(this.language)) {
      return localizable[this.language];
    } else {

      for (const entry of Object.entries(localizable)) {
        return `${entry[1]} (${entry[0]})`;
      }

      return '';
    }
  }
}
