import { useTranslation } from 'next-i18next';
import { Counts } from '@app/common/interfaces/counts.interface';
import Separator from 'yti-common-ui/separator';
import Filter, {
  KeywordFilter,
  OrganizationFilter,
  LanguageFilter,
  StatusFilter,
  InformationDomainFilter,
} from 'yti-common-ui/filter';
import { FilterTopPartBlock } from './terminology-search.styles';
import { Organization } from 'yti-common-ui/interfaces/organization.interface';
import { Group } from 'yti-common-ui/interfaces/group.interface';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';
import { compareLocales } from 'yti-common-ui/utils/compare-locales';

export interface SearchPageFilterProps {
  isModal?: boolean;
  onModalClose?: () => void;
  resultCount?: number;
  organizations?: Organization[];
  groups?: Group[];
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
  const { t, i18n } = useTranslation('common');

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
              labelText: getLanguageVersion({
                data: org.label,
                lang: i18n.language,
              }),
              uniqueItemId: org.id,
            })) ?? []
          }
        />
        <LanguageFilter
          labelText={t('filter-by-language')}
          languages={
            counts && counts.counts.languages
              ? Object.keys(counts?.counts.languages)
                  .sort(compareLocales)
                  .map((key) => ({
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
            id: group.identifier,
            name: getLanguageVersion({
              data: group.label,
              lang: i18n.language,
            }),
          })) ?? []
        }
        isModal={isModal}
        counts={counts?.counts.groups ?? {}}
      />
    </Filter>
  );
}
