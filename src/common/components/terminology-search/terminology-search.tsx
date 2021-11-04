import React from 'react';
import { Grid } from '@material-ui/core';
import { TerminologySearchResults } from './terminology-search-results';
import { useSelector } from 'react-redux';
import { selectFilter, useGetSearchResultQuery } from './states/terminology-search-slice';
import TerminologySearchFilter from './terminology-search-filter';
import { Heading, Text } from 'suomifi-ui-components';

export default function TerminologySearch() {

  const filter = useSelector(selectFilter());
  const { data, error, isLoading } = useGetSearchResultQuery(filter);

  return (
    <Grid container spacing={1} justifyContent='space-between'>
      <Grid item xs={12}>
        {filter != '' && <Heading variant='h1'>Hakusana &quot;{filter}&quot;</Heading>}
      </Grid>
      <Grid item xs={12}>
        <Text smallScreen>
          Hakutulokset näytetään palveluittain ja voit täsmentää hakutuloksia rajaamalla listaa.
          Huomaa, että listan rajaukset eroavat palveluittain.
        </Text>
      </Grid>
      <Grid item xs={12}>
        <Text>Tuloksia {data?.totalHitCount} kpl</Text>
      </Grid>
      <Grid item xl={9} lg={8} md={7} sm={12} xs={12}>
        <TerminologySearchResults results={data} />
      </Grid>
      <Grid item xl={3} lg={4} md={5}>
        <TerminologySearchFilter />
      </Grid>
    </Grid>
  );
}
