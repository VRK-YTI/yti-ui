import { normalizeAsArray } from '../utils/array';
import { Attribute } from './node-api';

export interface Localization {
  lang: string;
  value: string;
}

export interface Localizable { [language: string]: string; }
export interface LocalizableArray { [language: string]: string[]; }

export function asLocalizable(localizations: (Localization|Attribute)[], ignoreConflicts = false): Localizable {

  const result: Localizable = {};

  for (const localization of normalizeAsArray(localizations)) {
    if (localization.lang) {

      if (!ignoreConflicts && result.hasOwnProperty(localization.lang)) {
        throw new Error('Localization already defined for language: ' + localization.lang);
      }

      result[localization.lang] = localization.value;
    }
  }

  return result;
}

export function withFirstLocalizations(localizable: Localizable|LocalizableArray): Localizable {

  const result: Localizable = {};

  for (const [lang, value] of Object.entries(localizable)) {
    result[lang] = normalizeAsArray(value)[0];
  }

  return result;
}
