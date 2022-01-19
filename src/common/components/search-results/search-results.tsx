import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AppThunk } from '../../../store';
import { Collection } from '../../interfaces/collection.interface';
import { TerminologySearchResult } from '../../interfaces/terminology.interface';
import { VocabularyConcepts } from '../../interfaces/vocabulary.interface';
import filterData from '../../utils/filter-data';
import PropertyValue from '../property-value';
import { getPropertyValue } from '../property-value/get-property-value';
import { useBreakpoints } from '../media-query/media-query-context';
import { SearchState } from '../terminology-search/terminology-search-slice';
import { VocabularyState } from '../vocabulary/vocabulary-slice';
import SearchCountTags from './search-count-tags';
import {
  Card,
  CardChip,
  CardConcepts,
  CardContributor,
  CardDescription,
  CardInfoDomain,
  CardSubtitle,
  CardTitle,
  CardTitleIcon,
  CardTitleLink,
  CardTitleWrapper,
  CardWrapper
} from './search-results.styles';
import { Concept } from '../../interfaces/concept.interface';

interface SearchResultsProps {
  data: TerminologySearchResult | VocabularyConcepts | Collection[];
  filter: SearchState['filter'] | VocabularyState['filter'];
  type?: string;
  setSomeFilter: (x: any) => AppThunk;
}

export default function SearchResults({ data, filter, type, setSomeFilter }: SearchResultsProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();

  if (type === 'terminology-search' && 'terminologies' in data) {
    return (
      renderTerminologiesSearchResults()
    );
  } else if ('concepts' in data) {
    return (
      renderConceptSearchResults()
    );
  } else if (type === 'collections') {
    return (
      renderConceptCollections()
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
          <CardWrapper isSmall={isSmall}>
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
                            terminology.label[i18n.language].replaceAll(/<\/*[^>]>/g, '')
                            :
                            terminology?.label?.[Object.keys(terminology.label)[0]].replaceAll(/<\/*[^>]>/g, '')
                          }
                        </CardTitle>
                      </CardTitleLink>
                    </Link>
                  </CardTitleWrapper>

                  <CardSubtitle>
                    <span>{t('terminology-search-results-terminology')}</span>
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
      const filteredData = filterData(data, filter, i18n.language);

      if (filteredData && !Array.isArray(filteredData)) {
        return (
          <>
            <SearchCountTags count={filteredData.concepts?.length} filter={filter} setFilter={setSomeFilter} />
            <CardWrapper isSmall={isSmall}>
              {filteredData?.concepts.map((concept, idx) => {
                return (
                  <Card key={`search-result-${idx}`}>
                    <CardTitle variant='h2'>
                      <Link passHref href={`/terminology/${concept.terminology.id}/concept/${concept.id}`}>
                        <CardTitleLink href=''>
                          {concept.label[i18n.language] !== undefined ? concept.label[i18n.language] : concept?.label?.[Object.keys(concept.label)[0]]}
                        </CardTitleLink>
                      </Link>
                    </CardTitle>

                    <CardSubtitle>
                      {t('vocabulary-info-concept')} &middot; {t(`${concept.status}`)}
                    </CardSubtitle>

                    <CardDescription>
                      {concept.definition?.[i18n.language] !== undefined
                        ?
                        concept.definition[i18n.language]
                        :
                        concept.definition?.[Object.keys(concept.definition)[0]]
                          ?
                          concept?.definition?.[Object.keys(concept?.definition)[0]]
                          :
                          t('terminology-search-no-description')
                      }
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

  function renderConceptCollections() {
    if (Array.isArray(data) && data.length > 0) {
      // Note: This should be replaced when backend request for terminology has been updated
      const filteredData = filterData(data, filter, i18n.language);

      if (filteredData && Array.isArray(filteredData)) {
        return (
          <>
            <SearchCountTags count={filteredData.length} filter={filter} setFilter={setSomeFilter} />
            <CardWrapper isSmall={isSmall}>
              {filteredData.map((collection, idx: number) => {
                return (
                  <Card key={`search-result-${idx}`}>
                    <CardTitle variant='h2'>
                      <Link passHref href={`/terminology/${collection.type.graph.id}/collection/${collection.id}`}>
                        <CardTitleLink href=''>
                          {getPropertyValue({ property: collection.properties.prefLabel, language: i18n.language })
                            ?
                            <PropertyValue property={collection.properties.prefLabel} />
                            :
                            <>{getPropertyValue({ property: collection.properties.prefLabel, language: 'fi' })}</>
                          }
                        </CardTitleLink>
                      </Link>
                    </CardTitle>

                    <CardSubtitle>
                      {t('vocabulary-info-collection')}
                    </CardSubtitle>

                    <CardDescription>
                      {getPropertyValue({ property: collection.properties.definition })
                        ?
                        <PropertyValue property={collection.properties.definition} />
                        :
                        collection.properties.definition
                          ?
                          collection.properties.definition[0].value
                          :
                          t('vocabulary-results-no-description')
                      }
                    </CardDescription>

                    <CardConcepts value='Käsitteet'>
                      {renderCollectionMembers(collection.references.member)}
                    </CardConcepts>
                  </Card>
                );
              })}
            </CardWrapper>
          </>
        );
      }
    }

    return null;
  }

  function renderCollectionMembers(members?: Concept[]) {
    // Getting only the members that have labels in language in use
    const currMembers = members?.filter(m => {
      if (m.references.prefLabelXl) {
        return m.references?.prefLabelXl.filter(plxl => {
          return plxl.properties.prefLabel?.[0].lang === i18n.language;
        }).length > 0;
      }
    });

    return (
      currMembers && currMembers?.length > 0
        ?
        currMembers.map((m, idx) => {
          if (idx < 5) {
            const comma = (idx !== 0 && idx < 5) ? ',' : '';
            const pLabelXl = m.references.prefLabelXl?.filter(plxl => {
              return plxl.properties.prefLabel?.[0].lang === i18n.language;
            }) ?? '';

            return (
              <>{comma} {pLabelXl ? pLabelXl?.[0].properties.prefLabel?.[0].value : ''}</>
            );
          } else if (idx === 5) {
            const surplus = currMembers.length - idx;
            return (
              <> + {surplus} {t('vocabulary-results-more')}</>
            );
          }
        })
        :
        <>{t('vocabulary-results-no-concepts')}</>
    );
  }
}

