import { useTranslation } from 'next-i18next';
import { FilterCheckbox } from './filter.styles';
import { Text } from 'suomifi-ui-components';

interface CheckboxProps {
  data?: any;
  title: string;
}

export default function CheckboxArea({ data, title }: CheckboxProps) {
  const { t } = useTranslation('common');

  if (data === undefined) {
    return (
      <div>
        <Text variant='bold' smallScreen>
          {title}
        </Text>
        <FilterCheckbox>
          {t('VALID')} (n {t('vocabulary-filter-items')})
        </FilterCheckbox>
        <FilterCheckbox>
          {t('DRAFT')} (n {t('vocabulary-filter-items')})
        </FilterCheckbox>
        <FilterCheckbox>
          {t('RETIRED')} (n {t('vocabulary-filter-items')})
        </FilterCheckbox>
        <FilterCheckbox>
          {t('SUPERSEDED')} (n {t('vocabulary-filter-items')})
        </FilterCheckbox>
      </div>
    );
  }

  return (
    <div>
      <Text variant='bold' smallScreen>
        {title}
      </Text>
      {data.map((value:any, idx:number) => {
        return (
          <FilterCheckbox key={`checkbox-${value}-${idx}`}>
            {value} (n {t('vocabulary-filter-items')})
          </FilterCheckbox>
        );
      })}
    </div>
  );
}
