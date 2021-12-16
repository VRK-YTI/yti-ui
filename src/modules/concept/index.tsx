import React from 'react';
import { useGetConceptQuery } from '../../common/components/concept/concept-slice';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import PropertyValue from '../../common/components/property-value';
import ConceptSidebar from './concept-sidebar';
import { MainContent, PageContent } from './concept.styles';

export interface ConceptProps {
  terminologyId: string;
  conceptId: string;
}

export default function Concept({ terminologyId, conceptId }: ConceptProps) {
  const { breakpoint } = useBreakpoints();
  const { data: concept } = useGetConceptQuery({ terminologyId, conceptId });

  return (
    <>
      <PageContent breakpoint={breakpoint}>
        <MainContent>
          <PropertyValue property={concept?.references.prefLabelXl?.[0].properties.prefLabel} />
        </MainContent>
        <ConceptSidebar concept={concept} />
      </PageContent>
    </>
  );
};
