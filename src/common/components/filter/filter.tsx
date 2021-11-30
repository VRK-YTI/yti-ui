import { useTranslation } from 'react-i18next';
import CheckboxArea from './checkbox-area';
import RadioButtonArea from './radio-button-area';
import Remove from './remove';
import SearchInputArea from './search-input-area';

import {
  FilterWrapper,
  Header,
  Hr
} from './filter.styles';
import DropdownArea from './dropdown-area';


export default function Filter() {
  const { t } = useTranslation('common');

  return (
    <FilterWrapper>
      <Header>
        {t('vocabulary-filter-filter-list')}
      </Header>
      <Remove />
      <Hr />
      <CheckboxArea title={'Näytä tilat'} />
      <Hr />
      <CheckboxArea title={'Näytä tietoalueittain'} data={['Asuminen', 'Demokratia', 'Elinkeinot']}/>
      <Hr />
      <RadioButtonArea title={'Näytä vain'}/>
      <Hr />
      <RadioButtonArea title={'Näytä vain'} data={['concepts', 'collections']}/>
      <Hr />
      <DropdownArea title={'Rajaa organisaatio mukaan'} />
      <Hr />
      <DropdownArea title={'Rajaa organisaatio mukaan'} data={['Value1', 'Value2']} />
      <Hr />
      <SearchInputArea />
    </FilterWrapper>
  );
}
