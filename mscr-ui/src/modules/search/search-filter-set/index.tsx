import { FacetTitle } from '@app/modules/search/search-filter-set/search-filter-set.styles';
import { Aggregations, Facet } from '@app/common/interfaces/search.interface';
import SearchFacet from '@app/modules/search/search-facet';

interface SearchFilterProps {
  title: string;
  aggregations?: Aggregations;
}

export default function SearchFilterSet({ title, aggregations }: SearchFilterProps) {

  if (!aggregations) {
    return (
      <></>
    );
  }

  return (
    <>
      <FacetTitle variant="h2">{title}</FacetTitle>
      {Object.keys(aggregations).map((key) => (
          <SearchFacet
            key={key}
            facetKey={key.substring(7) as Facet}
            buckets={aggregations[key].buckets}
          />
        )
      )}
    </>
  );
}

