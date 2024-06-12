import {
  translateLanguage,
  translateModelFormErrors,
} from '@app/common/utils/translation-helpers';
import { TFunction } from 'next-i18next';
import { InputErrors } from '@app/modules/form/validate-form';

export default function getErrors(
  t: TFunction,
  errors?: InputErrors
): string[] {
  if (!errors) {
    return [];
  }

  const langsWithError = Object.entries(errors)
    .filter(([_, value]) => Array.isArray(value))
    ?.flatMap(([key, value]) =>
      (value as string[]).map(
        (lang) =>
          `${translateModelFormErrors(key, t)} ${translateLanguage(lang, t)}`
      )
    );

  const otherErrors = Object.entries(errors)
    .filter(([_, value]) => value && !Array.isArray(value))
    ?.map(([key, _]) => translateModelFormErrors(key, t));

  return [...langsWithError, ...otherErrors];
}
