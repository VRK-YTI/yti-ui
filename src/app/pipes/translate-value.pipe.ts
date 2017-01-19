import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { LanguageService, Language } from '../services/language.service';
import { isDefined } from '../utils/object';
import { Subscription } from 'rxjs';
import { Localizable } from '../entities/localization';

@Pipe({
  name: 'translateValue',
  pure: false
})
export class TranslateValuePipe implements PipeTransform, OnDestroy {

  localization?: string;
  changeSubscription?: Subscription;

  constructor(private languageService: LanguageService) {
  }

  transform(value: Localizable): string {

    if (!isDefined(this.localization)) {
      this.localization = TranslateValuePipe.getLocalization(value, this.languageService.language);
    }

    this.languageService.languageChange$.subscribe(language => {
      this.localization = TranslateValuePipe.getLocalization(value, language);
    });

    return this.localization;
  }

  private static getLocalization(value: Localizable, language: Language) {

    if (value.hasOwnProperty(language)) {
      return value[language];
    } else {

      for (const entry of Object.entries(value)) {
        return `${entry[1]} (${entry[0]})`;
      }

      return '';
    }
  }

  ngOnDestroy() {
    if (isDefined(this.changeSubscription)) {
      this.changeSubscription.unsubscribe();
    }
  }
}
