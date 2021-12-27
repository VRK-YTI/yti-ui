import { useTranslation } from 'next-i18next';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useGetConceptQuery } from '../../common/components/concept/concept-slice';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import PropertyValue, { getPropertyValue } from '../../common/components/property-value';
import ConceptSidebar from './concept-sidebar';
import { MainContent, PageContent } from './concept.styles';

export interface ConceptProps {
  terminologyId: string;
  conceptId: string;
  setConceptTitle: Dispatch<SetStateAction<string>>;
}

export default function Concept({ terminologyId, conceptId, setConceptTitle }: ConceptProps) {
  const { breakpoint } = useBreakpoints();
  const { data: concept } = useGetConceptQuery({ terminologyId, conceptId });
  const { i18n } = useTranslation('concept');

  useEffect(() => {
    const title = getPropertyValue(concept?.references.prefLabelXl?.[0].properties.prefLabel, i18n.language, 'fi');
    setConceptTitle(title ? title : '');
  }, [concept]);

  return (
    <>
      <PageContent breakpoint={breakpoint}>
        <MainContent>
          <PropertyValue
            property={concept?.references.prefLabelXl?.[0].properties.prefLabel}
            fallbackLanguage="fi"
          />
        </MainContent>
        <ConceptSidebar concept={concept} />
      </PageContent>
    </>
  );
};
