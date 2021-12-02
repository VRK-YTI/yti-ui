import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectFilter, useGetSearchResultQuery, setFilter } from '../../common/components/terminology-search/terminology-search-slice';
import Title from '../../common/components/title/title';
import { ResultAndFilterContainer, ResultAndStatsWrapper } from './terminology-search.styles';
import SearchResults from '../../common/components/search-results/search-results';
import Filter from '../../common/components/filter/filter';

export default function TerminologySearch() {
  const { t } = useTranslation();
  const filter = useSelector(selectFilter());
  const { data } = useGetSearchResultQuery(filter.keyword);

  return (
    <>
      <Title info={'test'} />
      <ResultAndFilterContainer>
        <ResultAndStatsWrapper>
          <SearchResults
            data={data}
            filter={filter}
            setSomeFilter={setFilter}
            type={'terminology-search'}
          />
        </ResultAndStatsWrapper>
        <Filter
          filter={filter}
          type={'vocabulary'}
          setSomeFilter={setFilter}
          // resetSomeFilter={resetVocabularyFilter}
        />
      </ResultAndFilterContainer>




      {/* <Grid container spacing={1} justifyContent='space-between' style={{ maxWidth: '100%' }}>
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
      </div> */}
    </>
  );
};
