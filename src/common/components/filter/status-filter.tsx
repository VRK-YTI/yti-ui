import { useTranslation } from 'next-i18next';
import useUrlState, { initialUrlState } from '@app/common/utils/hooks/useUrlState';
import CheckboxFilter from './checkbox-filter';

export interface StatusFilterProps {
  title: string;
  isModal?: boolean;
  counts: {
    valid?: number;
    draft?: number;
    retired?: number;
    superseded?: number;
  };
}

export default function StatusFilter({
  title,
  isModal,
  counts,
}: StatusFilterProps) {
  const { t } = useTranslation('common');
  const { urlState, patchUrlState } = useUrlState();

  return (
    <CheckboxFilter
      title={title}
      items={[
        {
          value: 'valid',
          label: t('filter-status-valid', { count: counts.valid ?? 0 }),
        },
        {
          value: 'draft',
          label: t('filter-status-draft', { count: counts.draft ?? 0 }),
        },
        {
          value: 'superseded',
          label: t('filter-status-superseded', {
            count: counts.superseded ?? 0,
          }),
        },
        {
          value: 'retired',
          label: t('filter-status-retired', { count: counts.retired ?? 0 }),
        },
      ]}
      selectedItems={urlState.status}
      onChange={(status) =>
        patchUrlState({
          status,
          page: initialUrlState.page,
        })
      }
      checkboxVariant={isModal ? 'large' : 'small'}
    />
  );
}
