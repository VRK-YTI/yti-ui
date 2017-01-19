import { normalizeAsArray } from '../utils/array';

export interface Localization {

  lang: string;
  value: string;
}

export type Localizable = { [language: string]: string; }

export function asLocalizable(localizations: Localization[]): Localizable {

  const result: Localizable = {};

  for (const localization of normalizeAsArray(localizations)) {
    result[localization.lang] = localization.value;
  }

  return result;
}
