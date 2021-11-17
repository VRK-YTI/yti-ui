import React from 'react';
import { Grid } from '@material-ui/core';
import { TerminologySearchResults } from './terminology-search-results';
import { useSelector } from 'react-redux';
import { selectFilter, useGetSearchResultQuery } from './states/terminology-search-slice';
import TerminologySearchFilter from './terminology-search-filter';
import { Heading, Text } from 'suomifi-ui-components';
import { SearchCountWrapper } from './terminology-search.styles';
import { useTranslation } from 'react-i18next';

export default function TerminologySearch() {
  const { t } = useTranslation();
  const filter = useSelector(selectFilter());
  const { data } = useGetSearchResultQuery(filter);

  return (
    <>
      <Grid container spacing={1} justifyContent='space-between' style={{ maxWidth: '100%' }}>
        <Grid item xs={12}>
          {filter != '' && <Heading variant='h1'>{t('terminology-search-keyword')} &quot;{filter}&quot;</Heading>}
        </Grid>
        <Grid item xs={12}>
          <Text smallScreen>
            {t('terminology-search-info')}
          </Text>
        </Grid>
        <Grid item xs={12}>
          {data?.totalHitCount ?
            <SearchCountWrapper>
              <Text variant='bold'>
                {data?.totalHitCount === 1 ?
                  `${data?.totalHitCount} ${t('terminology-search-result')}`
                  :
                  `${data?.totalHitCount} ${t('terminology-search-results')}`
                }
              </Text>
            </SearchCountWrapper>
            :
            <></>}
        </Grid>
      </Grid>

      <div style={{ display: 'flex' }}>
        <TerminologySearchResults results={data} />
        <div style={{ margin: 10 }} />
        <TerminologySearchFilter />
      </div>
    </>
  );
}
