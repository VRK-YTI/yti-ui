import { useTranslation } from 'next-i18next';
import { Counts } from '@app/common/interfaces/counts.interface';
import Separator from 'yti-common-ui/separator';
import Filter, {
  KeywordFilter,
  LanguageFilter,
  TypeFilter,
  StatusFilter,
} from 'yti-common-ui/filter';
import useUrlState from '@app/common/utils/hooks/use-url-state';
import { FilterTopPartBlock } from './vocabulary.styles';
import { Property } from '@app/common/interfaces/termed-data-types.interface';
import { compareLocales } from '@app/common/utils/compare-locals';

export interface TerminologyListFilterProps {
  isModal?: boolean;
  onModalClose?: () => void;
  resultCount?: number;
  counts?: Counts;
  languages?: string[];
}

export function TerminologyListFilter({
  isModal,
  onModalClose,
  resultCount,
  counts,
  languages,
}: TerminologyListFilterProps) {
  const { t } = useTranslation('common');
  const { urlState } = useUrlState();
  const shouldRenderStatusFilter = urlState.type === 'concept';

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
        <LanguageFilter
          labelText={t('display-by-language')}
          languages={
            languages
              ?.slice()
              ?.sort((a, b) => compareLocales(a, b))
              ?.map((lang) => ({
                labelText: lang,
                uniqueItemId: lang,
              })) ?? []
          }
        />
      </FilterTopPartBlock>
      <Separator />
      <TypeFilter
        title={t('vocabulary-filter-show-only')}
        isModal={isModal}
        counts={{
          concepts: counts?.counts.categories?.Concept,
          collections: counts?.counts.categories?.Collection,
        }}
      />
      {shouldRenderStatusFilter && (
        <>
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
        </>
      )}
    </Filter>
  );
}
