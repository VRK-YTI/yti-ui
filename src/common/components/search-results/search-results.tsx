import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Heading } from 'suomifi-ui-components';
import { AppThunk } from '../../../store';
import { TerminologySearchResult } from '../../interfaces/terminology.interface';
import { VocabularyConcepts } from '../../interfaces/vocabulary.interface';
import filterData from '../../utils/filter-data';
import { SearchState } from '../terminology-search/terminology-search-slice';
import { VocabularyState } from '../vocabulary/vocabulary-slice';
import SearchCountTags from './search-count-tags';
import {
  Card,
  CardChip,
  CardContributor,
  CardDescription,
  CardInfoDomain,
  CardPill,
  CardSubtitle,
  CardTitle,
  CardTitleIcon,
  CardTitleLink,
  CardTitleWrapper,
  CardWrapper
} from './search-results.styles';

interface SearchResultsProps {
  data: TerminologySearchResult | VocabularyConcepts;
  filter: SearchState['filter'] | VocabularyState['filter'];
  type?: string;
  setSomeFilter: (x: any) => AppThunk;
}

export default function SearchResults({ data, filter, type, setSomeFilter }: SearchResultsProps) {
  const { t, i18n } = useTranslation('common');

  if (type === 'terminology-search' && 'terminologies' in data) {
    return (
      renderTerminologiesSearchResults()
    );
  } else if ('concepts' in data) {
    return (
      renderConceptSearchResults()
    );
  }

  return <></>;

  function renderTerminologiesSearchResults() {
    if ('terminologies' in data) {
      return (
        <>
          <SearchCountTags
            count={data?.totalHitCount}
            filter={filter}
            setFilter={setSomeFilter}
          />
          <CardWrapper>
            {data?.terminologies?.map((terminology, idx: number) => {
              return (
                <Card key={`search-result-${idx}`}>
                  <CardContributor>
                    {terminology.contributors[0].label[i18n.language]}
                  </CardContributor>

                  <CardTitleWrapper>
                    <Link passHref href={'/terminology/' + terminology.id}>
                      <CardTitleLink href=''>
                        <CardTitleIcon icon='registers' />
                        <CardTitle variant='h3'>
                          {terminology.label[i18n.language] !== undefined
                            ?
                            terminology.label[i18n.language]
                            :
                            terminology?.label?.[Object.keys(terminology.label)[0]]
                          }
                        </CardTitle>
                      </CardTitleLink>
                    </Link>
                  </CardTitleWrapper>

                  <CardSubtitle>
                    <span>{t('terminology-search-results-terminology').toUpperCase()}</span>
                    <span>&middot;</span>
                    <CardChip valid={terminology.status === 'VALID' ? 'true' : undefined}>
                      {t(terminology.status ?? '')}
                    </CardChip>
                  </CardSubtitle>

                  <CardDescription>
                    {terminology?.description?.[i18n.language] !== undefined
                      ?
                      terminology?.description?.[i18n.language]
                      :
                      terminology?.description?.[Object.keys(terminology?.description)[0]]
                        ?
                        terminology?.description?.[Object.keys(terminology?.description)[0]]
                        :
                        t('terminology-search-no-description')}
                  </CardDescription>

                  <CardInfoDomain>
                    <b>
                      {t('terminology-search-results-information-domains')}:
                    </b>
                    {terminology.informationDomains.map((term, i: number) => {
                      let comma = i !== terminology.informationDomains.length - 1 ? ',' : '';
                      return <span key={`term-label-${term}-${i}`}> {term.label[i18n.language]}{comma}</span>;
                    })}
                  </CardInfoDomain>
                </Card>
              );
            })}
          </CardWrapper>
        </>
      );
    }

    return null;
  }

  function renderConceptSearchResults() {
    if ('concepts' in data) {
      // Note: This should be replaced when backend request for terminology has been updated
      let filteredData = filterData(data, filter, i18n.language);

      return (
        <>
          <SearchCountTags count={filteredData.totalHitCount} filter={filter} setFilter={setSomeFilter} />
          <CardWrapper>
            {filteredData?.concepts.map((concept, idx: number) => {
              return (
                <Card key={`search-result-${idx}`}>
                  <CardTitle variant='h2'>
                    <Link passHref href={`/terminology/${concept.terminology.id}/concept/${concept.id}`}>
                      <CardTitleLink href=''>
                        <span>
                          {concept.label[i18n.language] !== undefined ? concept.label[i18n.language] : concept?.label?.[Object.keys(concept.label)[0]]}
                        </span>
                      </CardTitleLink>
                    </Link>
                  </CardTitle>

                  <CardSubtitle>
                    {t('vocabulary-info-concept').toUpperCase()} &middot; {t(`${concept.status}`).toUpperCase()}
                  </CardSubtitle>

                  <CardDescription>
                    {concept.definition?.[i18n.language] !== undefined ? concept.definition[i18n.language] : concept.definition?.[Object.keys(concept.definition)[0]]}
                  </CardDescription>
                </Card>
              );
            })}
          </CardWrapper>
        </>
      );
    }

    return null;
  }
}
