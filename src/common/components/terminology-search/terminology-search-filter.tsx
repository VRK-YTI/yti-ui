import React from 'react';
import { Block, Checkbox, Dropdown, DropdownItem, Text } from 'suomifi-ui-components';
import { SearchFilterContainer, SearchFilterHeader } from './terminology-search-filter.styles';

export default function TerminologySearchFilter() {

  return (
    <>
      <SearchFilterHeader>
        <Text style={{ color: 'white' }}>
          RAJAA LISTAA
        </Text>
      </SearchFilterHeader>

      <SearchFilterContainer>
        <Block variant='main'>


          <Dropdown labelText='Rajaa organisaation mukaan'>
            <DropdownItem value='1'>
              Valinta 1
            </DropdownItem>
            <DropdownItem value='2'>
              Valinta 2
            </DropdownItem>
            <DropdownItem value='3'>
              Valinta 3
            </DropdownItem>
          </Dropdown>

          <Text variant='bold'>Näytä vain</Text>
          <Checkbox>
            Sanastot (n kpl)
          </Checkbox>
          <Checkbox>
            Käsitevalikoima (n kpl)
          </Checkbox>
          <Checkbox>
            Käsitteet (n kpl)
          </Checkbox>

          <hr />

          <Text variant='bold'>Näytä tilat</Text>
          <Checkbox>
            Voimassa oleva (n kpl)
          </Checkbox>
          <Checkbox>
            Luonnos (n kpl)
          </Checkbox>
          <Checkbox>
            Korvattu (n kpl)
          </Checkbox>

          <hr />

          <Text variant='bold'>Näytä tietoalueittain</Text>
          <Checkbox>
            Asuminen (n kpl)
          </Checkbox>
          <Checkbox>
            Eläkkeet (n kpl)
          </Checkbox>
          <Checkbox>
            Koulutus (n kpl)
          </Checkbox>


        </Block>
      </SearchFilterContainer>
    </>
  );
};
