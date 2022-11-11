import { useTranslation } from 'next-i18next';
import useUrlState, {
  initialUrlState,
} from '@app/common/utils/hooks/use-url-state';
import RadioButtonFilter from './radio-button-filter';

export interface TypeFilterProps {
  title: string;
  isModal?: boolean;
  counts: {
    concepts?: number;
    collections?: number;
  };
}

export default function TypeFilter({
  title,
  isModal,
  counts,
}: TypeFilterProps) {
  const { t } = useTranslation('common');
  const { urlState, patchUrlState } = useUrlState();

  return (
    <RadioButtonFilter
      title={title}
      items={[
        {
          value: 'concept',
          label: t('filter-type-concepts', { count: counts.concepts ?? 0 }),
        },
        {
          value: 'collection',
          label: t('filter-type-collections', {
            count: counts.collections ?? 0,
          }),
        },
      ]}
      selectedItem={urlState.type}
      onChange={(type) =>
        patchUrlState({
          type,
          page: initialUrlState.page,
          status: initialUrlState.status,
        })
      }
      radioButtonVariant={isModal ? 'large' : 'small'}
    />
  );
}
