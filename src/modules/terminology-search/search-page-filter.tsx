import { useTranslation } from 'next-i18next';
import { Counts } from '@app/common/interfaces/counts.interface';
import {
  GroupSearchResult,
  OrganizationSearchResult,
} from '@app/common/interfaces/terminology.interface';
import Separator from '@app/common/components/separator';
import { Filter } from '@app/common/components/filter/filter';
import InformationDomainFilter from '@app/common/components/filter/information-domain-filter';
import OrganizationFilter from '@app/common/components/filter/organization-filter';
import StatusFilter from '@app/common/components/filter/status-filter';
import { KeywordFilter } from '@app/common/components/filter/keyword-filter';
import LanguageFilter from '@app/common/components/filter/language-filter';

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
      <OrganizationFilter
        title={t('terminology-search-filter-by-organization')}
        visualPlaceholder={t('terminology-search-filter-pick-organization')}
        organizations={organizations}
      />
      <Separator />
      <LanguageFilter />
      <Separator />
      <KeywordFilter
        title={t('vocabulary-filter-filter-by-keyword')}
        visualPlaceholder={t('vocabulary-filter-visual-placeholder')}
        isModal={isModal}
      />
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
            name: group.properties.prefLabel,
          })) ?? []
        }
        isModal={isModal}
        counts={counts?.counts.groups ?? {}}
      />
    </Filter>
  );
}
