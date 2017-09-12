import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Subject } from 'rxjs';
import { Localizable } from '../entities/localization';
import { isDefined } from '../utils/object';

export type Language = string;

export interface Localizer {
  translate(localizable: Localizable): string;
}

@Injectable()
export class LanguageService implements Localizer {

  private _language: Language;
  languageChange$ = new Subject<Language>();

  filterLanguage: Language = '';

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

    if (!isDefined(localizable)) {
      return '';
    }

    const primaryLocalization = localizable[this.language];

    if (primaryLocalization) {
      return primaryLocalization;
    } else {

      for (const [language, value] of Object.entries(localizable)) {
        if (value) {
          return `${value} (${language})`;
        }
      }

      return '';
    }
  }
}
