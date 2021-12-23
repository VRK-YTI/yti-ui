import { DropdownItem } from 'suomifi-ui-components';
import { AppThunk, useStoreDispatch } from '../../../store';
import { SearchState } from '../terminology-search/terminology-search-slice';
import { DropdownPlaceholder, DropdownWrapper } from './filter.styles';

interface DropdownProps {
  data?: string[];
  filter: SearchState['filter'];
  setFilter: (x: any) => AppThunk;
  title: string;
  visualPlaceholder?: string;
  isModal?: boolean;
}

export default function DropdownArea({
  data,
  filter,
  isModal = false,
  setFilter,
  title,
  visualPlaceholder
}: DropdownProps) {
  const dispatch = useStoreDispatch();

  const handleChange = (value: string) => {
    dispatch(setFilter({ ...filter, showByOrg: value }));
  };

  if (!data) {
    return <></>;
  }

  // Returns dropdown with given data values.
  return (
    <div>
      <DropdownWrapper
        labelText={title}
        visualPlaceholder={
          <DropdownPlaceholder>
            {visualPlaceholder}
          </DropdownPlaceholder>
        }
        value={filter.showByOrg}
        onChange={(value) => handleChange(value)}
        isModal={isModal}
      >
        {data.map((value: string, idx: number) => {
          return (
            <DropdownItem
              value={value}
              key={`dropdown-${value}-${idx}`}
            >
              {value}
            </DropdownItem>
          );
        })}
      </DropdownWrapper>
    </div>
  );

}
