import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, Localizable, Localizer } from 'yti-common-ui/types/localization';
import { isDefined } from 'yti-common-ui/utils/object';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { getFromLocalStorage, setToLocalStorage } from 'yti-common-ui/utils/storage';

export { Language, Localizer };

@Injectable()
export class LanguageService implements Localizer {
  private static readonly LANGUAGE_KEY: string = 'yti-terminology-ui.language-service.language';
  private static readonly FILTER_LANGUAGE_KEY: string = 'yti-terminology-ui.language-service.filter-language';

  language$ = new BehaviorSubject<Language>(getFromLocalStorage(LanguageService.LANGUAGE_KEY, 'fi'));
  filterLanguage$ = new BehaviorSubject<Language>(getFromLocalStorage(LanguageService.FILTER_LANGUAGE_KEY, ''));
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
      setToLocalStorage(LanguageService.LANGUAGE_KEY, language);
    }
  }

  get filterLanguage(): Language {
    return this.filterLanguage$.getValue();
  }

  set filterLanguage(language: Language) {
    if (this.filterLanguage !== language) {
      this.filterLanguage$.next(language);
      setToLocalStorage(LanguageService.FILTER_LANGUAGE_KEY, language);
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

  translateToGivenLanguage(localizable: Localizable, languageToUse: string | null): string {
    if (!isDefined(localizable)) {
      return '';
    }

    if (languageToUse) {
      const primaryLocalization = localizable[languageToUse];
      if (primaryLocalization) {
        return primaryLocalization;
      }
    }

    return this.translate(localizable, true);
  }

  isLocalizableEmpty(localizable: Localizable): boolean {

    if (!localizable) {
      return true;
    }

    for (const prop in localizable) {
      if (localizable.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(localizable) === JSON.stringify({});
  }
}
