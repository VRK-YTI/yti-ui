import { compareLocales } from 'yti-common-ui/utils/compare-locales';
import { LocalizedListItem } from '../interfaces/interfaces-v2';

/**
 * Preserves order withing the language
 *
 * @param properties
 * @returns
 */
export function sortPropertyListByLanguage(
  properties?: LocalizedListItem[]
): LocalizedListItem[] {
  // map properties by language
  const propertiesByLanguage =
    properties?.slice().reduce((result, property) => {
      if (!result[property.language]) {
        result[property.language] = [];
      }
      result[property.language].unshift(property);
      return result;
    }, {} as { [key: string]: LocalizedListItem[] }) ?? {};

  // sort by key (=language) and flat map
  return Object.keys(propertiesByLanguage)
    .sort(compareLocales)
    .flatMap((lang) => propertiesByLanguage[lang]);
}
