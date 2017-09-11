import { normalizeAsArray } from '../utils/array';
import { Attribute } from './node-api';

export interface Localization {
  lang: string;
  value: string;
}

export interface Localizable { [language: string]: string; }
export interface LocalizableArray { [language: string]: string[]; }

export function asLocalizable(localizations: (Localization|Attribute)[]): Localizable {

  const result: Localizable = {};

  for (const localization of normalizeAsArray(localizations)) {
    if (localization.lang) {
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

export function combineLocalizables(localizables: Localizable[]): Localizable {
  const result: Localizable = {};

  for (const localizable of localizables) {
    for (const [lang, localization] of Object.entries(localizable)) {
      if (result.hasOwnProperty(lang)) {
        throw new Error('Language already defined: ' + lang);
      }
      result[lang] = localization;
    }
  }

  return result;
}
