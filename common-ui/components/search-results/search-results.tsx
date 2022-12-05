import { useBreakpoints } from '../media-query';
import SearchCountTags from './search-count-tags';
import { CardConcepts, ResultWrapper } from './search-results.styles';
import ResultCard from './result-card';
import { BaseIconKeys } from 'suomifi-ui-components';
import ResultCardExpander from './result-card-expander';
import SanitizedTextContent from '../sanitized-text-content';

export interface SearchResultData {
  id: string;
  contributors?: string[];
  description?: string;
  icon?: BaseIconKeys;
  status?: string;
  partOf?: string[];
  title: string;
  titleLink: string;
  type: string;
}

interface SearchResultsProps {
  data?: SearchResultData[];
  organizations?: {
    label: string;
    id: string;
  }[];
  domains?: {
    label: string;
    id: string;
  }[];
  partOfText?: string;
  noDescriptionText: string;
  noChip?: boolean;
  tagsTitle: string;
  tagsHiddenTitle: string;
  extra?: {
    expander: {
      buttonLabel: string;
      contentLabel: string;
      deepHits: {
        [key: string]: {
          label: string;
          id: string;
          uri?: string;
        }[];
      };
    };
  } |
  {
    other: {
      title: string;
      items: {
        [key: string]: string;
      };
    };
  };
}

export default function SearchResults({
  data,
  organizations,
  domains,
  partOfText,
  noDescriptionText,
  noChip,
  tagsTitle,
  tagsHiddenTitle,
  extra,
}: SearchResultsProps) {
  const { isSmall } = useBreakpoints();

  if (!data) {
    return null;
  }

  return (
    <>
      <SearchCountTags
        title={tagsTitle}
        hiddenTitle={tagsHiddenTitle}
        organizations={organizations}
        domains={domains}
      />
      <ResultWrapper $isSmall={isSmall} id="search-results">
        {data.map((d) => {
          return (
            <ResultCard
              key={d.id}
              description={d.description}
              title={d.title}
              titleLink={d.titleLink}
              type={d.type}
              contributors={d.contributors}
              icon={d.icon}
              status={d.status}
              partOf={d.partOf}
              partOfText={partOfText}
              noDescriptionText={noDescriptionText}
              noChip={noChip}
              extra={
                extra &&
                ('expander' in extra ?
                  extra.expander.deepHits[d.id] && <ResultCardExpander
                    buttonLabel={extra.expander.buttonLabel}
                    contentLabel={extra.expander.contentLabel}
                    deepHits={extra.expander.deepHits[d.id]}
                  />
                  :
                  extra.other.items[d.id] &&
                  <CardConcepts value={extra.other.title}>
                    <SanitizedTextContent text={extra.other.items[d.id]} />
                  </CardConcepts>
                )
              }
            />
          );
        })}
      </ResultWrapper>
    </>
  );

  // TODO: Add support extra
  // function renderTerminologiesSearchResults() {
  //   if ("terminologies" in data) {
  //     return (
  //       <>
  //         <SearchCountTags
  //           title={t("terminology-search-terminologies", {
  //             count: data?.totalHitCount ?? 0,
  //           })}
  //           organizations={organizations}
  //           domains={domains}
  //           renderQBeforeStatus
  //           count={data?.totalHitCount}
  //         />
  //         <ResultWrapper $isSmall={isSmall} id="search-results">
  //           {data?.terminologies?.map((terminology) => {
  //             return (
  //               <ResultCard
  //                 key={terminology.id}
  //                 contributors={terminology.contributors}
  //                 description={getDescription(terminology)}
  //                 icon="registers"
  //                 partOf={terminology.informationDomains}
  //                 status={terminology.status}
  //                 title={getLabel(terminology)}
  //                 titleLink={`/terminology/${terminology.id}`}
  //                 type={translateTerminologyType(
  //                   terminology.type ?? "TERMINOLOGICAL_VOCABULARY",
  //                   t
  //                 )}
  //                 extra={
  //                   data.deepHits?.[terminology.id]?.[0] && (
  //                     <ResultCardExpander
  //                       deepHits={data.deepHits[terminology.id]}
  //                       buttonLabel={t("results-with-query-from-terminology")}
  //                       contentLabel={t("concepts")}
  //                       parentId={terminology.id}
  //                     />
  //                   )
  //                 }
  //               />
  //             );
  //           })}
  //         </ResultWrapper>
  //       </>
  //     );
  //   }

  //   return null;
  // }

  // function renderConceptSearchResults() {
  //   if ("concepts" in data) {
  //     if (data && !Array.isArray(data)) {
  //       return (
  //         <>
  //           <SearchCountTags
  //             title={t("vocabulary-results-concepts", {
  //               count: data?.totalHitCount ?? 0,
  //             })}
  //             organizations={organizations}
  //             domains={domains}
  //             count={data?.totalHitCount}
  //           />
  //           <ResultWrapper $isSmall={isSmall}>
  //             {data?.concepts.map((concept) => {
  //               return (
  //                 <ResultCard
  //                   key={concept.id}
  //                   description={getDefinition(concept)}
  //                   noChip
  //                   status={concept.status}
  //                   title={getLabel(concept)}
  //                   titleLink={`/terminology/${concept.terminology.id}/concept/${concept.id}`}
  //                   type={t("vocabulary-info-concept")}
  //                 />
  //               );
  //             })}
  //           </ResultWrapper>
  //         </>
  //       );
  //     }
  //   }

  //   return null;
  // }

  // function renderConceptCollections() {
  //   if (Array.isArray(data)) {
  //     return (
  //       <>
  //         <SearchCountTags
  //           title={t("vocabulary-results-collections", {
  //             count: data.length,
  //           })}
  //           count={data.length}
  //         />
  //         {data.length > 0 && (
  //           <ResultWrapper $isSmall={isSmall}>
  //             {data
  //               .filter((collection, idx) => {
  //                 const minId = Math.max(0, (urlState.page - 1) * 10);
  //                 const maxId = minId + 10;
  //                 if (idx >= minId && idx < maxId) {
  //                   return collection;
  //                 }
  //               })
  //               .map((collection) => {
  //                 return (
  //                   <ResultCard
  //                     key={collection.id}
  //                     description={
  //                       <PropertyValue
  //                         property={collection.properties.definition}
  //                         fallback={t("vocabulary-results-no-description")}
  //                       />
  //                     }
  //                     extra={
  //                       <CardConcepts
  //                         value={t("vocabulary-filter-concepts") as string}
  //                       >
  //                         {renderCollectionMembers(
  //                           collection.references?.member
  //                         )}
  //                       </CardConcepts>
  //                     }
  //                     noStatus
  //                     title={getPropertyValue({
  //                       property: collection.properties.prefLabel,
  //                       language: urlState.lang ? urlState.lang : i18n.language,
  //                     })}
  //                     titleLink={`/terminology/${collection.type.graph.id}/collection/${collection.id}`}
  //                     type={t("vocabulary-info-collection")}
  //                   />
  //                 );
  //               })}
  //           </ResultWrapper>
  //         )}
  //       </>
  //     );
  //   }

  //   return null;
  // }

  // function renderCollectionMembers(members?: Concept[]) {
  //   return members ? (
  //     members.map((m, idx) => {
  //       const comma =
  //         idx < 4 && members.length > 1 && idx < members.length - 1 ? "," : "";

  //       if (idx < 5 && m.references.prefLabelXl) {
  //         if (m.references.prefLabelXl.length === 1) {
  //           if (
  //             m.references.prefLabelXl[0].properties.prefLabel?.[0].lang ===
  //             i18n.language
  //           ) {
  //             const value =
  //               m.references.prefLabelXl[0].properties.prefLabel?.[0].value;

  //             return (
  //               <div key={`${value}-${idx}`}>
  //                 {value}
  //                 {comma}&nbsp;
  //               </div>
  //             );
  //           } else {
  //             const value =
  //               m.references.prefLabelXl[0].properties.prefLabel?.[0].value;
  //             const lang =
  //               m.references.prefLabelXl[0].properties.prefLabel?.[0].lang;

  //             return (
  //               <div key={`${value}-${idx}`}>
  //                 {value} ({lang}){comma}&nbsp;
  //               </div>
  //             );
  //           }
  //         } else if (m.references.prefLabelXl.length > 1) {
  //           let value;

  //           m.references.prefLabelXl?.forEach((pLabelXl) => {
  //             if (pLabelXl.properties.prefLabel?.[0].lang === i18n.language) {
  //               value = pLabelXl.properties.prefLabel?.[0].value;
  //             }
  //           });

  //           if (value !== "") {
  //             return (
  //               <div key={`${value}-${idx}`}>
  //                 {value}
  //                 {comma}&nbsp;
  //               </div>
  //             );
  //           } else {
  //             value =
  //               m.references.prefLabelXl?.[0].properties.prefLabel?.[0].value;
  //             const lang =
  //               m.references.prefLabelXl?.[0].properties.prefLabel?.[0].lang;

  //             return (
  //               <div key={`${value}-${idx}`}>
  //                 {value} ({lang}){comma}&nbsp;
  //               </div>
  //             );
  //           }
  //         }
  //       } else if (idx === 5) {
  //         const surplus = members.length - idx;
  //         return (
  //           <div key={`surplus-${idx}`}>
  //             + {surplus} {t("vocabulary-results-more")}
  //           </div>
  //         );
  //       }
  //     })
  //   ) : (
  //     <>{t("vocabulary-results-no-concepts")}</>
  //   );
  // }

  // function getLabel(
  //   dto: VocabularyConceptDTO | TerminologyDTO | Collection,
  //   isConcept = true
  // ) {
  //   // If dto is of type Collection
  //   if ("properties" in dto) {
  //     let retVal = getPropertyValue({
  //       property: dto.properties.prefLabel,
  //       language: urlState.lang,
  //     });

  //     if (retVal !== "") {
  //       return retVal.replaceAll(/<\/*[^>]>/g, "");
  //     }

  //     retVal = !urlState.lang
  //       ? getPropertyValue({
  //           property: dto.properties.prefLabel,
  //           language: i18n.language,
  //         })
  //       : `${dto.properties.prefLabel?.[0].value} (${dto.properties.prefLabel?.[0].lang})`;
  //     return retVal.replaceAll(/<\/*[^>]>/g, "");
  //   }

  //   // If language is defined in urlState and dto is Concept
  //   // get label without trailing language code
  //   if (isConcept && urlState.lang && dto.label?.[urlState.lang]) {
  //     return dto.label[urlState.lang].replaceAll(/<\/*[^>]>/g, "");
  //   }

  //   // If label exists in current UI language get label without trailing language code
  //   if (!urlState.lang && dto.label?.[i18n.language]) {
  //     return dto.label[i18n.language].replaceAll(/<\/*[^>]>/g, "");
  //   }

  //   if (isConcept && dto.label) {
  //     // Otherwise return label with trailing language code
  //     return `${dto?.label?.[Object.keys(dto.label)[0]].replaceAll(
  //       /<\/*[^>]>/g,
  //       ""
  //     )} (${Object.keys(dto.label)[0]})`;
  //   } else if (dto.label) {
  //     return `${dto?.label?.[Object.keys(dto.label)[0]].replaceAll(
  //       /<\/*[^>]>/g,
  //       ""
  //     )}`;
  //   } else {
  //     return t("concept-label-undefined");
  //   }
  // }

  // function getDescription(terminology: TerminologyDTO) {
  //   if (terminology?.description?.[i18n.language] !== undefined) {
  //     return terminology?.description?.[i18n.language];
  //   }

  //   if (terminology?.description?.[Object.keys(terminology?.description)[0]]) {
  //     return terminology?.description?.[
  //       Object.keys(terminology?.description)[0]
  //     ];
  //   }

  //   return t("terminology-search-no-description");
  // }

  // function getDefinition(concept: VocabularyConceptDTO) {
  //   if (concept.definition?.[i18n.language]) {
  //     return (
  //       <SanitizedTextContent text={concept.definition?.[i18n.language]} />
  //     );
  //   }

  //   if (concept.definition?.[Object.keys(concept.definition)[0]]) {
  //     return (
  //       <SanitizedTextContent
  //         text={concept?.definition?.[Object.keys(concept?.definition)[0]]}
  //       />
  //     );
  //   }

  //   return t("terminology-search-no-definition");
  // }
}
