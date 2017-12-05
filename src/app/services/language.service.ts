import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Localizable } from 'yti-common-ui/types/localization';
import { isDefined } from 'yti-common-ui/utils/object';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export type Language = string;

export interface Localizer {
  translate(localizable: Localizable): string;
}

@Injectable()
export class LanguageService implements Localizer {

  language$ = new BehaviorSubject<Language>('fi');
  filterLanguage$ = new BehaviorSubject<Language>('');
  translateLanguage$ = new BehaviorSubject<Language>(this.language);

  constructor(private translateService: TranslateService) {

    translateService.addLangs(['fi', 'en']);
    translateService.setDefaultLang('en');
    this.language$.subscribe(lang => this.translateService.use(lang));

    Observable.combineLatest(this.language$, this.filterLanguage$)
      .subscribe(([lang, filterLang]) => this.translateLanguage$.next(filterLang || lang));
  }

  get language(): Language {
    return this.language$.getValue();
  }

  set language(language: Language) {
    if (this.language !== language) {
      this.language$.next(language);
    }
  }

  get filterLanguage(): Language {
    return this.filterLanguage$.getValue();
  }

  set filterLanguage(language: Language) {
    if (this.filterLanguage !== language) {
      this.filterLanguage$.next(language);
    }
  }

  get translateLanguage(): Language {
    return this.translateLanguage$.getValue();
  }

  translate(localizable: Localizable, useFilterLanguage = true) {

    if (!isDefined(localizable)) {
      return '';
    }

    const primaryLocalization = localizable[(useFilterLanguage && this.filterLanguage) || this.language];

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
