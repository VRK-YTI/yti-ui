import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Localizable, Localizer, Language } from 'yti-common-ui/types/localization';
import { isDefined } from 'yti-common-ui/utils/object';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { getFromLocalStorage, setToLocalStorage } from 'yti-common-ui/utils/storage';

export { Language, Localizer };

@Injectable()
export class LanguageService implements Localizer {
  private readonly languageKey: string = 'yti-terminology-ui.language-service.language';
  private readonly filterLanguageKey: string = 'yti-terminology-ui.language-service.filter-language';

  language$ = new BehaviorSubject<Language>(getFromLocalStorage(this.languageKey, 'fi'));
  filterLanguage$ = new BehaviorSubject<Language>(getFromLocalStorage(this.filterLanguageKey, ''));
  translateLanguage$ = new BehaviorSubject<Language>(this.language);

  constructor(private translateService: TranslateService) {

    translateService.addLangs(['fi', 'en']);
    translateService.setDefaultLang('en');
    this.language$.subscribe(lang => this.translateService.use(lang));

    combineLatest(this.language$, this.filterLanguage$)
      .subscribe(([lang, filterLang]) => this.translateLanguage$.next(filterLang || lang));
  }

  get language(): Language {
    return this.language$.getValue();
  }

  set language(language: Language) {
    if (this.language !== language) {
      this.language$.next(language);
      setToLocalStorage(this.languageKey, language);
    }
  }

  get filterLanguage(): Language {
    return this.filterLanguage$.getValue();
  }

  set filterLanguage(language: Language) {
    if (this.filterLanguage !== language) {
      this.filterLanguage$.next(language);
      setToLocalStorage(this.filterLanguageKey, language);
    }
  }

  get translateLanguage(): Language {
    return this.translateLanguage$.getValue();
  }

  translate(localizable: Localizable, useUILanguage = false) {

    if (!isDefined(localizable)) {
      return '';
    }

    const primaryLocalization = localizable[(!useUILanguage && this.filterLanguage) || this.language];

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
