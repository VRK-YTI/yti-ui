import { Term } from '../interfaces/term.interface';
import { Property } from '../interfaces/termed-data-types.interface';

export interface TermBlockType {
  term: Term;
  type: string;
}

// Prioritizes Finnish and Swedish over other languages
export function compareLocales(
  t1: Property | string,
  t2: Property | string
): number {
  const t1Lang = typeof t1 === 'object' ? t1.lang.toLowerCase() : t1;
  const t2Lang = typeof t2 === 'object' ? t2.lang.toLowerCase() : t2;

  if (t1Lang === 'fi' || t2Lang === 'fi') {
    return t1Lang === 'fi' ? -1 : 1;
  }

  if (t1Lang === 'sv' || t2Lang === 'sv') {
    return t1Lang === 'sv' ? -1 : 1;
  }

  if (t1Lang === 'en' || t2Lang === 'en') {
    return t1Lang === 'en' ? -1 : 1;
  }

  if (t1Lang !== t2Lang) {
    return t1Lang > t2Lang ? 1 : -1;
  }

  return 0;
}

/**
 * Preserves order withing the language
 *
 * @param properties
 * @returns
 */
export function sortPropertyListByLanguage(
  properties?: Property[]
): Property[] {
  // map properties by language
  const propertiesByLanguage =
    properties?.slice().reduce((result, property) => {
      if (!result[property.lang]) {
        result[property.lang] = [];
      }
      result[property.lang].unshift(property);
      return result;
    }, {} as { [key: string]: Property[] }) ?? {};

  // sort by key (=language) and flat map
  return Object.keys(propertiesByLanguage)
    .sort(compareLocales)
    .flatMap((lang) => propertiesByLanguage[lang]);
}
