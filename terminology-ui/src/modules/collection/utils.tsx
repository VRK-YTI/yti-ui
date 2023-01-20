import { Collection } from '@app/common/interfaces/collection.interface';
import { Property } from '@app/common/interfaces/termed-data-types.interface';
import { compareLocales } from '@app/common/utils/compare-locals';
import { useEffect, useState } from 'react';

export function useGetBlockData(collection?: Collection) {
  const [prefLabels, setPrefLabels] = useState<Property[] | undefined>();
  const [definitions, setDefinitions] = useState<Property[] | undefined>();

  useEffect(() => {
    if (!collection) {
      setPrefLabels(undefined);
      setDefinitions(undefined);
      return;
    }

    if (!prefLabels && collection.properties.prefLabel) {
      const sortedPrefLabels = collection.properties.prefLabel
        .slice()
        .sort((l1, l2) => compareLocales(l1, l2));

      setPrefLabels(sortedPrefLabels);
    }

    if (!definitions && collection.properties.definition) {
      const sortedDefinitions = collection.properties.definition
        .slice()
        .sort((d1, d2) => compareLocales(d1, d2));

      setDefinitions(sortedDefinitions);
    }
  }, [collection, prefLabels, definitions]);

  return { prefLabels, definitions };
}
