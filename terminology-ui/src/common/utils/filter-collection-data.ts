import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { Collection } from '@app/common/interfaces/collection.interface';
import { isEqual } from 'lodash';
import { initialUrlState, UrlState } from './hooks/use-url-state';

export default function filterCollectionData(
  data: Collection[],
  urlState: UrlState,
  language: string
) {
  if (
    isEqual(
      { ...urlState, type: 'collection' },
      { ...initialUrlState, type: 'collection' }
    )
  ) {
    return data;
  }

  return data.filter((collection) => {
    const prefLabel = getPropertyValue({
      property: collection.properties.prefLabel,
      language,
    });

    const memberLabels =
      collection.references.member?.map((m) =>
        getPropertyValue({
          property: m.references.prefLabelXl?.[0].properties.prefLabel,
          language: language,
        })
      ) ?? [];

    if (
      prefLabel?.toLowerCase().includes(urlState.q.toLowerCase()) ||
      memberLabels.some((label) =>
        label.toLowerCase().includes(urlState.q.toLowerCase())
      )
    ) {
      return true;
    }
  });
}
