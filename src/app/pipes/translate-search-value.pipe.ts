import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Localizable } from 'yti-common-ui/types/localization';
import { Language, LanguageService } from 'app/services/language.service';
import { Subscription } from 'rxjs';
import { isDefined } from 'yti-common-ui/utils/object';

@Pipe({
  name: 'translateSearchValue',
  pure: false
})
export class TranslateSearchValuePipe implements PipeTransform, OnDestroy {

  previousSearch: RegExp | undefined;
  localization?: string;
  languageSubscription?: Subscription;

  constructor(private languageService: LanguageService) {
  }

  transform(value: Localizable, searchRegexp: RegExp | undefined): string {

    this.cleanSubscription();

    if (!isDefined(this.localization) || this.previousSearch !== searchRegexp) {
      this.localization = this.formatText(value, searchRegexp);
    }

    this.languageSubscription = this.languageService.translateLanguage$.subscribe(() => {
      this.localization = this.formatText(value, searchRegexp);
    });

    this.previousSearch = searchRegexp;

    return this.localization;
  }

  formatText(value: Localizable, searchRegexp: RegExp | undefined) {

    if (!value) {
      return '';
    }

    if (!searchRegexp) {
      return this.languageService.translate(value, false);
    }

    const primaryTranslation = this.languageService.translate(value, false);

    if (searchRegexp.test(primaryTranslation)) {
      return primaryTranslation;
    } else {

      const secondaryMatch = findSecondaryLanguageMatch(value, searchRegexp);

      if (secondaryMatch) {
        return `${primaryTranslation} [${formatSecondaryLanguageMatch(value, secondaryMatch)}]`;
      } else {
        return primaryTranslation;
      }
    }
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

function findSecondaryLanguageMatch(value: Localizable, regex: RegExp): { language: Language, startIndex: number, endIndex: number } | null {

  for (const [language, text] of Object.entries(value)) {

    const match = regex.exec(text);

    if (match) {
      const startIndex = match.index;
      const endIndex = startIndex + match[0].length;

      return { language: language as Language, startIndex, endIndex };
    }
  }

  return null;
}

function formatSecondaryLanguageMatch(value: Localizable, match: { language: Language, startIndex: number, endIndex: number }) {

  const secondaryTranslation = value[match.language];
  const excessiveThreshold = 30;
  const startIndex = Math.max(0, match.startIndex - excessiveThreshold);
  const endIndex = Math.min(secondaryTranslation.length, match.endIndex + excessiveThreshold);

  let abbreviatedText = '';

  if (startIndex > 0) {
    abbreviatedText += '&hellip;';
  }

  abbreviatedText += secondaryTranslation.slice(startIndex, endIndex);

  if (endIndex < secondaryTranslation.length) {
    abbreviatedText += '&hellip;';
  }

  return `${match.language}: ${abbreviatedText}`;
}
