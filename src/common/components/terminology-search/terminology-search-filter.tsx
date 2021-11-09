import { Grid } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownItem, Text } from 'suomifi-ui-components';
import {
  SearchFilterCheckbox,
  SearchFilterSelections,
  SearchFilterHeader,
  SearchFilterHr,
  SearchFilterRemove,
  SearchFilterRemoveWrapper,
  SearchFilterWrapper
} from './terminology-search-filter.styles';

export default function TerminologySearchFilter() {
  const { t } = useTranslation('common');

  return (
    <SearchFilterWrapper>
      <SearchFilterHeader>
        <Text style={{ color: 'white' }}>
          {t('terminology-search-filter-list')}
        </Text>
      </SearchFilterHeader>

      <SearchFilterSelections>
        <Grid container>

          <Grid item xs={12}>
            <SearchFilterRemoveWrapper>
              <SearchFilterRemove icon='remove' />
              <Text
                smallScreen
                color='highlightBase'
                variant='bold'
              >
                {t('terminology-search-filter-remove-all')}
              </Text>
            </SearchFilterRemoveWrapper>
          </Grid>

          <Grid item xs={12}>
            <SearchFilterHr />
          </Grid>

          <Grid item xs={12}>
            <Dropdown
              labelText={t('terminology-search-filter-by-organization')}
              visualPlaceholder={<i>{t('terminology-search-filter-pick-organization')}</i>}
            >
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
          </Grid>

          <Grid item xs={12}>
            <SearchFilterHr />
          </Grid>

          <Grid item xs={12}>
            <Text smallScreen variant='bold'>
              {t('terminology-search-filter-show-only')}
            </Text>
            <SearchFilterCheckbox>
              Terminologiset sanastot (n kpl)
            </SearchFilterCheckbox>
            <SearchFilterCheckbox>
              Käsitevalikoima (n kpl)
            </SearchFilterCheckbox>
            <SearchFilterCheckbox>
              Käsitteet (n kpl)
            </SearchFilterCheckbox>
          </Grid>

          <Grid item xs={12}>
            <SearchFilterHr />
          </Grid>

          <Grid item xs={12}>
            <Text smallScreen variant='bold'>
              {t('terminology-search-filter-show-states')}
            </Text>
            <SearchFilterCheckbox>
              Voimassa oleva (n kpl)
            </SearchFilterCheckbox>
            <SearchFilterCheckbox>
              Luonnos (n kpl)
            </SearchFilterCheckbox>
            <SearchFilterCheckbox>
              Korvattu (n kpl)
            </SearchFilterCheckbox>
          </Grid>

          <Grid item xs={12}>
            <SearchFilterHr />
          </Grid>

          <Grid item xs={12}>
            <Text smallScreen variant='bold'>
              {t('terminology-search-filter-show-by-information-domain')}
            </Text>
            <SearchFilterCheckbox>
              Asuminen (n kpl)
            </SearchFilterCheckbox>
            <SearchFilterCheckbox>
              Eläkkeet (n kpl)
            </SearchFilterCheckbox>
            <SearchFilterCheckbox>
              Koulutus (n kpl)
            </SearchFilterCheckbox>
          </Grid>
        </Grid>

      </SearchFilterSelections>
    </SearchFilterWrapper>
  );
};
