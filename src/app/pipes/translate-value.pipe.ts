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

  transform(value: Localizable): string {

    this.localization = this.languageService.translate(value);

    this.languageService.languageChange$.subscribe(() => {
      this.localization = this.languageService.translate(value);
    });

    return this.localization;
  }

  ngOnDestroy() {
    if (isDefined(this.changeSubscription)) {
      this.changeSubscription.unsubscribe();
    }
  }
}
