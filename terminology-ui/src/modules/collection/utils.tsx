import { Collection } from '@app/common/interfaces/collection.interface';
import { compareLocales } from '@app/common/utils/compare-locals';

export function getBlockData(collection?: Collection) {
  if (!collection) {
    return { prefLabels: [], definitions: [] };
  }

  const prefLabels =
    collection.properties.prefLabel
      ?.slice()
      .sort((l1, l2) => compareLocales(l1, l2)) ?? [];

  const definitions =
    collection.properties.definition
      ?.slice()
      .sort((d1, d2) => compareLocales(d1, d2)) ?? [];

  return { prefLabels, definitions };
}
