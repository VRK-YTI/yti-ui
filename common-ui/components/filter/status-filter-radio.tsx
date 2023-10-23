import useUrlState, { initialUrlState } from '../../utils/hooks/use-url-state';
import RadioButtonFilter, { Item } from './radio-button-filter';

export interface StatusFilterRadioProps {
  title: string;
  items: Item[];
  defaultValue?: string;
  isModal?: boolean;
}

export default function StatusFilterRadio({
  title,
  items,
  defaultValue,
  isModal,
}: StatusFilterRadioProps) {
  const { urlState, patchUrlState } = useUrlState();

  return (
    <RadioButtonFilter
      title={title}
      items={items}
      onChange={(status) => {
        patchUrlState({
          status: status.split(','),
          page: initialUrlState.page,
        });
      }}
      radioButtonVariant={isModal ? 'large' : 'small'}
      selectedItem={
        urlState.status.length < 1
          ? defaultValue ?? 'VALID,DRAFT'
          : urlState.status.join(',')
      }
    />
  );
}
