import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AppThunk } from '../../../store';
import { Collection } from '../../interfaces/collection.interface';
import { TerminologySearchResult } from '../../interfaces/terminology.interface';
import { VocabularyConcepts } from '../../interfaces/vocabulary.interface';
import useQueryParam from '../../utils/hooks/useQueryParam';
import PropertyValue from '../property-value';
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
  const [page] = useQueryParam('page');
  const { isSmall } = useBreakpoints();

  if (!data) {
    return null;
  }

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
                          {terminology.label[i18n.language]
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
      if (data && !Array.isArray(data)) {
        return (
          <>
            <SearchCountTags count={data.totalHitCount} filter={filter} setFilter={setSomeFilter} />
            <CardWrapper isSmall={isSmall}>
              {data?.concepts.map((concept, idx) => {
                return (
                  <Card key={`search-result-${idx}`}>
                    <CardTitle variant='h2'>
                      <Link passHref href={`/terminology/${concept.terminology.id}/concept/${concept.id}`}>
                        <CardTitleLink href=''>
                          {concept.label[i18n.language]
                            ?
                            concept.label[i18n.language].replaceAll(/<\/*[^>]>/g, '')
                            :
                            concept?.label?.[Object.keys(concept.label)[0]].replaceAll(/<\/*[^>]>/g, '')
                          }
                        </CardTitleLink>
                      </Link>
                    </CardTitle>

                    <CardSubtitle>
                      {t('vocabulary-info-concept')} &middot; {t(`${concept.status}`)}
                    </CardSubtitle>

                    <CardDescription>
                      {concept.definition?.[i18n.language]
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
    }

    return null;
  }

  function renderConceptCollections() {
    if (!Array.isArray(data) || data.length < 1) {
      return null;
    }

    return (
      <>
        <SearchCountTags count={data.length} filter={filter} setFilter={setSomeFilter} />
        <CardWrapper isSmall={isSmall}>
          {data.map((collection, idx: number) => {
            const maxId = page ? parseInt(page, 10) * 10 : 10;
            const minId = page ? parseInt(page, 10) * 10 - 10 : 0;
            if (idx >= maxId || idx < minId) {
              return null;
            }

            return (
              <Card key={`search-result-${idx}`}>
                <CardTitle variant='h2'>
                  <Link passHref href={`/terminology/${collection.type.graph.id}/collection/${collection.id}`}>
                    <CardTitleLink href=''>
                      <PropertyValue property={collection.properties.prefLabel} fallbackLanguage='fi' />
                    </CardTitleLink>
                  </Link>
                </CardTitle>

                <CardSubtitle>
                  {t('vocabulary-info-collection')}
                </CardSubtitle>

                <CardDescription>
                  <PropertyValue
                    property={collection.properties.definition}
                    fallbackLanguage='fi'
                    fallback={t('vocabulary-results-no-description')}
                  />
                </CardDescription>

                <CardConcepts value={t('vocabulary-filter-concepts') as string}>
                  {renderCollectionMembers(collection.references?.member)}
                </CardConcepts>
              </Card>
            );
          })}
        </CardWrapper>
      </>
    );
  }

  function renderCollectionMembers(members?: Concept[]) {
    return (
      members
        ?
        members.map((m, idx) => {
          const comma = (idx < 4 && members.length > 1) ? ',' : '';

          if (idx < 5 && m.references.prefLabelXl) {
            if (m.references.prefLabelXl.length === 1) {
              if (m.references.prefLabelXl[0].properties.prefLabel?.[0].lang === i18n.language) {
                const value = m.references.prefLabelXl[0].properties.prefLabel?.[0].value;

                return (
                  <div key={`${value}-${idx}`}>
                    {value}{comma}&nbsp;
                  </div>
                );
              } else {
                const value = m.references.prefLabelXl[0].properties.prefLabel?.[0].value;
                const lang = m.references.prefLabelXl[0].properties.prefLabel?.[0].lang;

                return (
                  <div key={`${value}-${idx}`}>
                    {value} ({lang}){comma}&nbsp;
                  </div>
                );
              }

            } else if (m.references.prefLabelXl.length > 1) {
              let value;

              m.references.prefLabelXl?.forEach(pLabelXl => {
                if (pLabelXl.properties.prefLabel?.[0].lang === i18n.language) {
                  value = pLabelXl.properties.prefLabel?.[0].value;
                }
              });

              if (value !== '') {
                return (
                  <div key={`${value}-${idx}`}>
                    {value}{comma}&nbsp;
                  </div>
                );
              } else {
                value = m.references.prefLabelXl?.[0].properties.prefLabel?.[0].value;
                const lang = m.references.prefLabelXl?.[0].properties.prefLabel?.[0].lang;

                return (
                  <div key={`${value}-${idx}`}>
                    {value} ({lang}){comma}&nbsp;
                  </div>
                );
              }

            }
          } else if (idx === 5) {
            const surplus = members.length - idx;
            return (
              <div key={`surplus-${idx}`}>+ {surplus} {t('vocabulary-results-more')}</div>
            );
          }
        })
        :
        <>{t('vocabulary-results-no-concepts')}</>
    );
  }
}
