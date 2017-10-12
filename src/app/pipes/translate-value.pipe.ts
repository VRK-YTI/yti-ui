import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { LanguageService } from '../services/language.service';
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

  transform(value: Localizable, useFilterLanguage = true): string {

    this.localization = this.languageService.translate(value, useFilterLanguage);

    this.languageService.language$.subscribe(() => {
      this.localization = this.languageService.translate(value, useFilterLanguage);
    });

    return this.localization;
  }

  ngOnDestroy() {
    if (isDefined(this.changeSubscription)) {
      this.changeSubscription.unsubscribe();
    }
  }
}
