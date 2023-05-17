import { useTranslation } from 'next-i18next';
import { Counts } from '@app/common/interfaces/counts.interface';
import {
  GroupSearchResult,
  OrganizationSearchResult,
} from '@app/common/interfaces/terminology.interface';
import Separator from 'yti-common-ui/separator';
import Filter, {
  KeywordFilter,
  OrganizationFilter,
  LanguageFilter,
  StatusFilter,
  InformationDomainFilter,
} from 'yti-common-ui/filter';
import { FilterTopPartBlock } from './terminology-search.styles';

export interface SearchPageFilterProps {
  isModal?: boolean;
  onModalClose?: () => void;
  resultCount?: number;
  organizations?: OrganizationSearchResult[];
  groups?: GroupSearchResult[];
  counts?: Counts;
}

export function SearchPageFilter({
  isModal,
  onModalClose,
  resultCount,
  organizations,
  groups,
  counts,
}: SearchPageFilterProps) {
  const { t } = useTranslation('common');

  return (
    <Filter
      isModal={isModal}
      onModalClose={onModalClose}
      resultCount={resultCount}
    >
      <FilterTopPartBlock>
        <KeywordFilter
          title={t('vocabulary-filter-filter-by-keyword')}
          visualPlaceholder={t('vocabulary-filter-visual-placeholder')}
        />
        <OrganizationFilter
          title={t('terminology-search-filter-by-organization')}
          visualPlaceholder={t('terminology-search-filter-pick-organization')}
          organizations={
            organizations?.map((org) => ({
              labelText: org.properties.prefLabel.value,
              uniqueItemId: org.id,
            })) ?? []
          }
        />
        <LanguageFilter
          labelText={t('filter-by-language')}
          languages={
            counts && counts.counts.languages
              ? Object.keys(counts?.counts.languages).map((key) => ({
                  labelText: key,
                  uniqueItemId: key,
                }))
              : []
          }
        />
      </FilterTopPartBlock>
      <Separator />
      <StatusFilter
        title={t('terminology-search-filter-show-states')}
        isModal={isModal}
        counts={{
          valid: counts?.counts.statuses.VALID,
          draft: counts?.counts.statuses.DRAFT,
          retired: counts?.counts.statuses.RETIRED,
          superseded: counts?.counts.statuses.SUPERSEDED,
        }}
      />
      <Separator />
      <InformationDomainFilter
        title={t('terminology-search-filter-show-by-information-domain')}
        domains={
          groups?.map((group) => ({
            id: group.id,
            name: group.properties.prefLabel.value,
          })) ?? []
        }
        isModal={isModal}
        counts={counts?.counts.groups ?? {}}
      />
    </Filter>
  );
}
