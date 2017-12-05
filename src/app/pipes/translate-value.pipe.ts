import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { isDefined } from 'yti-common-ui/utils/object';
import { Subscription } from 'rxjs';
import { Localizable } from 'yti-common-ui/types/localization';

@Pipe({
  name: 'translateValue',
  pure: false
})
export class TranslateValuePipe implements PipeTransform, OnDestroy {

  localization?: string;
  languageSubscription?: Subscription;

  constructor(private languageService: LanguageService) {
  }

  transform(value: Localizable, useFilterLanguage = true): string {

    this.cleanSubscription();
    this.localization = this.languageService.translate(value, useFilterLanguage);

    this.languageSubscription = this.languageService.translateLanguage$.subscribe(() => {
      this.localization = this.languageService.translate(value, useFilterLanguage);
    });

    return this.localization;
  }

  cleanSubscription() {
    if (isDefined(this.languageSubscription)) {
      this.languageSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.cleanSubscription();
  }
}
