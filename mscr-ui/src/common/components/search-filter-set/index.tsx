import {FacetTitle} from "@app/common/components/search-filter-set/search-filter-set.styles";

interface SearchFilterProps {
  title: string;
  all: number;
  schemas: number;
  crosswalks: number;
}

export default function SearchFilterSet(props: SearchFilterProps) {
  return (
    <FacetTitle variant="h2">{props.title}</FacetTitle>
  );
}
