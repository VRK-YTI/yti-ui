import React from 'react';
import { Grid } from '@material-ui/core';
import { TerminologySearchResults } from './terminology-search-results';
import { useSelector } from 'react-redux';
import { selectFilter, useGetSearchResultQuery } from './states/terminology-search-slice';
import TerminologySearchFilter from './terminology-search-filter';
import { Text } from 'suomifi-ui-components';

export default function TerminologySearch() {

  const filter = useSelector(selectFilter());
  const { data, error, isLoading } = useGetSearchResultQuery(filter);

  return (
    <Grid container spacing={1} justifyContent='space-between'>
      <Grid item xs={12}>
        <Text>Tuloksia {data?.totalHitCount} kpl</Text>
      </Grid>
      <Grid item xl={10} lg={9} md={8} sm={6} xs={12}>
        <TerminologySearchResults results={data} />
      </Grid>
      <Grid item xl={2} lg={3} md={4} sm={6}>
        <TerminologySearchFilter />
      </Grid>
    </Grid>
  );
}
