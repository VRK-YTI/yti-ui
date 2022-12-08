import useUrlState, { initialUrlState } from '../../utils/hooks/use-url-state';
import RadioButtonFilter, { Item } from './radio-button-filter';

export interface StatusFilterRadioProps {
  title: string;
  items: Item[];
  isModal?: boolean;
}

export default function StatusFilterRadio({
  title,
  items,
  isModal,
}: StatusFilterRadioProps) {
  const { urlState, patchUrlState } = useUrlState();

  return (
    <RadioButtonFilter
      title={title}
      items={items}
      onChange={(status) => {
        patchUrlState({
          status: status === 'VALID,DRAFT' ? [] : status.split(','),
          page: initialUrlState.page,
        });
      }}
      radioButtonVariant={isModal ? 'large' : 'small'}
      selectedItem={urlState.status.length < 1 ? 'VALID,DRAFT' : urlState.status.join(',')}
    />
  );
}
