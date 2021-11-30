import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownItem } from 'suomifi-ui-components';

interface DropdownProps {
  data?: any;
  title: string;
}

export default function DropdownArea({ data, title }: DropdownProps) {
  const { t } = useTranslation('common');

  if (data === undefined) {
    return (
      <div>
        <Dropdown
          labelText={t('terminology-search-filter-by-organization')}
          visualPlaceholder={<i>{t('terminology-search-filter-pick-organization')}</i>}
        >
          <DropdownItem value={'Placeholder1'}>
            Placeholder1
          </DropdownItem>
          <DropdownItem value={'Placeholder2'}>
            Placeholder2
          </DropdownItem>

        </Dropdown>
      </div>
    );
  }

  return (
    <div>
      <Dropdown
        labelText={t('terminology-search-filter-by-organization')}
        visualPlaceholder={<i>{t('terminology-search-filter-pick-organization')}</i>}
      >
        {data.map((value:any, idx:number) => {
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
