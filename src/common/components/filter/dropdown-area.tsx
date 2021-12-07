import { Dropdown, DropdownItem } from 'suomifi-ui-components';
import { useStoreDispatch } from '../../../store';
import { DropdownPlaceholder } from './filter.styles';

interface DropdownProps {
  data?: any;
  filter: any;
  setFilter: any;
  title: string;
  visualPlaceholder?: string;
}

export default function DropdownArea({ data, filter, setFilter, title, visualPlaceholder }: DropdownProps) {
  const dispatch = useStoreDispatch();

  const handleChange = (value: string) => {
    dispatch(setFilter({...filter, showByOrg: value}));
  };

  if (data !== undefined) {
    return (
      <div>
        <Dropdown
          labelText={title}
          visualPlaceholder={
            <DropdownPlaceholder>
              {visualPlaceholder}
            </DropdownPlaceholder>
          }
          value={filter.showByOrg || ''}
          onChange={(value) => handleChange(value)}
        >
          {data.map((value: any, idx: number) => {
            return (
              <DropdownItem
                value={value}
                key={`dropdown-${value}-${idx}`}
              >
                {value}
              </DropdownItem>
            );
          })}
        </Dropdown>
      </div>
    );
  }

  return <></>;
}
