import useUrlState, { initialUrlState } from '../../utils/hooks/use-url-state';
import CheckboxFilter from './checkbox-filter';

interface Item {
  value: string;
  label: React.ReactNode;
}

export interface TypeCheckboxFilterProps {
  title: string;
  items: Item[];
  isModal?: boolean;
}

export default function TypeCheckboxFilter({
  title,
  items,
  isModal,
}: TypeCheckboxFilterProps) {
  const { urlState, patchUrlState } = useUrlState();

  return (
    <CheckboxFilter
      items={items}
      selectedItems={urlState.types}
      title={title}
      checkboxVariant={isModal ? 'large' : 'small'}
      onChange={(types) =>
        patchUrlState({
          types,
          page: initialUrlState.page,
        })
      }
    />
  );
}
