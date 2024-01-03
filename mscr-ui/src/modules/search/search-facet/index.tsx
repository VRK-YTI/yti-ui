import { Bucket, Facet } from '@app/common/interfaces/search.interface';
import useUrlState, { UrlState } from '@app/common/utils/hooks/use-url-state';
import { Checkbox, CheckboxGroup } from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';

interface SearchFacetProps {
  facetKey: Facet;
  buckets: Bucket[];
}
export default function SearchFacet({ facetKey, buckets }: SearchFacetProps) {
  const { urlState, patchUrlState } = useUrlState();
  const { t } = useTranslation('common');

  if (facetKey == 'organization' || facetKey == 'isReferenced')
    return <>{/* These don't work yet, so don't show */}</>;

  const facetTranslations = {
    state: t('search.facets.state'),
    type: t('search.facets.type'),
    format: t('search.facets.format'),
    organization: t('search.facets.organization'),
    isReferenced: t('search.facets.isReferenced'),
  };

  const handleClick = (clickedOption: string) => {
    const currentFilter: string[] = urlState[facetKey];
    let newFilter: string[];
    if (currentFilter.includes(clickedOption)) {
      newFilter = currentFilter.filter((option) => option !== clickedOption);
    } else {
      newFilter = currentFilter.concat(clickedOption);
    }
    const patch: Partial<UrlState> = {};
    patch[facetKey] = newFilter;
    patchUrlState(patch);
  };

  const options = buckets.map((bucket) => {
    return {
      // The keys work as labels for now, might change when we have organizations working
      label: bucket.key,
      key: bucket.key,
      count: bucket.doc_count,
    };
  });

  return (
    <CheckboxGroup labelText={facetTranslations[facetKey]}>
      {options.map((option) => (
        <Checkbox
          key={option.key}
          onClick={() => handleClick(option.key)}
          checked={urlState[facetKey].includes(option.key)}
        >
          {option.label} ({option.count})
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}
