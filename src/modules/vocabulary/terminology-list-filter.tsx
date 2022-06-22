import { useTranslation } from 'next-i18next';
import { Counts } from '@app/common/interfaces/counts.interface';
import Separator from '@app/common/components/separator';
import { Filter } from '@app/common/components/filter/filter';
import StatusFilter from '@app/common/components/filter/status-filter';
import { KeywordFilter } from '@app/common/components/filter/keyword-filter';
import TypeFilter from '@app/common/components/filter/type-filter';
import useUrlState from '@app/common/utils/hooks/useUrlState';
import LanguageFilter from '@app/common/components/filter/language-filter';
import { FilterTopPartBlock } from './vocabulary.styles';
import { Property } from '@app/common/interfaces/termed-data-types.interface';

export interface TerminologyListFilterProps {
  isModal?: boolean;
  onModalClose?: () => void;
  resultCount?: number;
  counts?: Counts;
  languages?: Property[];
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
        <LanguageFilter
          labelText={t('filter-by-language')}
          languages={languages}
        />
        <KeywordFilter
          title={t('vocabulary-filter-filter-by-keyword')}
          visualPlaceholder={t('vocabulary-filter-visual-placeholder')}
          isModal={isModal}
        />
      </FilterTopPartBlock>
      <Separator />
      <TypeFilter
        title={t('vocabulary-filter-show-only')}
        isModal={isModal}
        counts={{
          concepts: counts?.counts.categories.Concept,
          collections: counts?.counts.categories.Collection,
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
