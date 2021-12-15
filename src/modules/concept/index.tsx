import React from 'react';
import { Link } from 'suomifi-ui-components';
import { useGetConceptQuery } from '../../common/components/concept/concept-slice';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import PropertyValue from '../../common/components/property-value';
import {
  Sidebar,
  SidebarDivider,
  SidebarHeader,
  SidebarLinkList,
  SidebarLinkListItem,
  SidebarSubHeader
} from '../../common/components/sidebar';
import { MainContent, PageContent } from './concept.styles';

interface ConceptProps {
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
        </MainContent>
        <Sidebar>
          <SidebarHeader>Suhdetiedot</SidebarHeader>

          <SidebarDivider />

          <SidebarSubHeader>Hierarkkinen yläkäsite</SidebarSubHeader>
          <SidebarLinkList>
            {concept?.references?.broader?.map(broader => (
              <SidebarLinkListItem key={broader.id}>
                <Link href={`/terminology/${terminologyId}/concept/${broader.id}`}>
                  <PropertyValue property={broader?.references?.prefLabelXl?.[0]?.properties?.prefLabel} />
                </Link>
              </SidebarLinkListItem>
            ))}
          </SidebarLinkList>

          <SidebarSubHeader>Hierarkkinen alakäsite</SidebarSubHeader>
          <SidebarLinkList>
            {concept?.references?.narrower?.map(narrower => (
              <SidebarLinkListItem key={narrower.id}>
                <Link href={`/terminology/${terminologyId}/concept/${narrower.id}`}>
                  <PropertyValue property={narrower?.references?.prefLabelXl?.[0]?.properties?.prefLabel} />
                </Link>
              </SidebarLinkListItem>
            ))}
          </SidebarLinkList>

          <SidebarSubHeader>Liittyvä käsite</SidebarSubHeader>
          <SidebarLinkList>
            {concept?.references?.related?.map(related => (
              <SidebarLinkListItem key={related.id}>
                <Link href={`/terminology/${terminologyId}/concept/${related.id}`}>
                  <PropertyValue property={related?.references?.prefLabelXl?.[0]?.properties?.prefLabel} />
                </Link>
              </SidebarLinkListItem>
            ))}
          </SidebarLinkList>

          <SidebarSubHeader>Koostumussuhteinen yläkäsite</SidebarSubHeader>
          <SidebarLinkList>
            {concept?.references?.isPartOf?.map(isPartOf => (
              <SidebarLinkListItem key={isPartOf.id}>
                <Link href={`/terminology/${terminologyId}/concept/${isPartOf.id}`}>
                  <PropertyValue property={isPartOf?.references?.prefLabelXl?.[0]?.properties?.prefLabel} />
                </Link>
              </SidebarLinkListItem>
            ))}
          </SidebarLinkList>

          <SidebarSubHeader>Koostumussuhteinen alakäsite</SidebarSubHeader>
          <SidebarLinkList>
            {concept?.references?.hasPart?.map(hasPart => (
              <SidebarLinkListItem key={hasPart.id}>
                <Link href={`/terminology/${terminologyId}/concept/${hasPart.id}`}>
                  <PropertyValue property={hasPart?.references?.prefLabelXl?.[0]?.properties?.prefLabel} />
                </Link>
              </SidebarLinkListItem>
            ))}
          </SidebarLinkList>

          <SidebarSubHeader>Liittyvä käsite toisessa sanastossa</SidebarSubHeader>
          <SidebarLinkList>
            {concept?.references?.relatedMatch?.map(relatedMatch => (
              <SidebarLinkListItem key={relatedMatch.id}>
                <Link href={`/terminology/${terminologyId}/concept/${relatedMatch.id}`}>
                  <PropertyValue property={relatedMatch?.properties?.prefLabel} />
                </Link>
              </SidebarLinkListItem>
            ))}
          </SidebarLinkList>

          <SidebarSubHeader>Vastaava käsite toisessa sanastossa</SidebarSubHeader>
          <SidebarLinkList>
            {concept?.references?.exactMatch?.map(exactMatch => (
              <SidebarLinkListItem key={exactMatch.id}>
                <Link href={`/terminology/${terminologyId}/concept/${exactMatch.id}`}>
                  <PropertyValue property={exactMatch?.properties?.prefLabel} />
                </Link>
              </SidebarLinkListItem>
            ))}
          </SidebarLinkList>

          <SidebarSubHeader>Lähes vastaava käsite toisessa sanastossa</SidebarSubHeader>
          <SidebarLinkList>
            {concept?.references?.closeMatch?.map(closeMatch => (
              <SidebarLinkListItem key={closeMatch.id}>
                <Link href={`/terminology/${terminologyId}/concept/${closeMatch.id}`}>
                  <PropertyValue property={closeMatch?.properties?.prefLabel} />
                </Link>
              </SidebarLinkListItem>
            ))}
          </SidebarLinkList>

          <SidebarDivider />

          <SidebarSubHeader>Käsite muissa sanastoissa</SidebarSubHeader>
          <SidebarLinkList>
            {/* {concept?.references?.closeMatch?.map(closeMatch => (
              <SidebarLinkListItem key={closeMatch.id}>
                <Link href={`/terminology/${terminologyId}/concept/${closeMatch.id}`}>
                  <PropertyValue property={closeMatch?.properties?.prefLabel} />
                </Link>
              </SidebarLinkListItem>
            ))} */}
          </SidebarLinkList>

          <SidebarDivider />

          <SidebarSubHeader>Kuuluu käsitekokoelmaan</SidebarSubHeader>
          <SidebarLinkList>
            {concept?.referrers?.member?.map(collection => (
              <SidebarLinkListItem key={collection.id}>
                <Link href={`/terminology/${terminologyId}/concept/${collection.id}`}>
                  <PropertyValue property={collection?.properties?.prefLabel} />
                </Link>
              </SidebarLinkListItem>
            ))}
          </SidebarLinkList>
        </Sidebar>
      </PageContent>
    </>
  );
};
