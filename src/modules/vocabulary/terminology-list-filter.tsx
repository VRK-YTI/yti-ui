import { useTranslation } from 'next-i18next';
import { Counts } from '../../common/interfaces/counts.interface';
import Separator from '../../common/components/separator';
import { Filter } from '../../common/components/filter/filter';
import StatusFilter from '../../common/components/filter/status-filter';
import { KeywordFilter } from '../../common/components/filter/keyword-filter';
import TypeFilter from '../../common/components/filter/type-filter';
import useUrlState from '../../common/utils/hooks/useUrlState';

export interface TerminologyListFilterProps {
  isModal?: boolean;
  onModalClose?: () => void;
  resultCount?: number;
  counts?: Counts;
}

export function TerminologyListFilter({
  isModal,
  onModalClose,
  resultCount,
  counts
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
      <TypeFilter
        title={t('vocabulary-filter-show-only')}
        isModal={isModal}
        counts={{
          concepts: counts?.counts.categories.concepts,
          collections: counts?.counts.categories.collections,
        }}
      />
      <Separator />
      {shouldRenderStatusFilter && (
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
      )}
      {shouldRenderStatusFilter && <Separator />}
      <KeywordFilter
        title={t('vocabulary-filter-filter-by-keyword')}
        visualPlaceholder={t('vocabulary-filter-visual-placeholder')}
        isModal={isModal}
      />
    </Filter>
  );
}
