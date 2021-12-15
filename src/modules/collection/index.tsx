import React from 'react';
import { Link } from 'suomifi-ui-components';
import {
  useGetCollectionQuery,
  useGetCollectionsQuery
} from '../../common/components/collection/collection-slice';
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
import { useGetVocabularyQuery } from '../../common/components/vocabulary/vocabulary-slice';
import { MainContent, PageContent } from './collection.styles';

interface CollectionProps {
  terminologyId: string;
  collectionId: string;
}

export default function Collection({ terminologyId, collectionId }: CollectionProps) {
  const { breakpoint } = useBreakpoints();
  const { data: terminology } = useGetVocabularyQuery(terminologyId);
  const { data: collection } = useGetCollectionQuery({ terminologyId, collectionId });
  const { data: collections } = useGetCollectionsQuery(terminologyId);

  return (
    <PageContent breakpoint={breakpoint}>
      <MainContent>
      </MainContent>
      <Sidebar>
        <SidebarHeader>Lisää käsitevalikoimista</SidebarHeader>

        <SidebarDivider />

        <SidebarSubHeader>Muut käsitekokoelmat tässä sanastossa</SidebarSubHeader>
        <SidebarLinkList>
          {collections?.map(collection => (
            <SidebarLinkListItem key={collection.id}>
              <Link href={`/terminology/${terminologyId}/collection/${collection.id}`}>
                <PropertyValue property={collection.properties?.prefLabel} />
              </Link>
            </SidebarLinkListItem>
          ))}
        </SidebarLinkList>
      </Sidebar>
    </PageContent>
  );
};
