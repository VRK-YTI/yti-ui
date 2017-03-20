import { normalizeAsArray } from '../utils/array';
import { Attribute } from './node-api';

export interface Localization {
  lang: string;
  value: string;
}

export type Localizable = { [language: string]: string; }

export function asLocalizable(localizations: (Localization|Attribute)[]): Localizable {

  const result: Localizable = {};

  for (const localization of normalizeAsArray(localizations)) {
    if (localization.lang) {
      result[localization.lang] = localization.value;
    }
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
