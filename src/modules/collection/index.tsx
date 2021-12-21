import React from 'react';
import { useGetCollectionQuery } from '../../common/components/collection/collection-slice';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import PropertyValue from '../../common/components/property-value';
import { useGetVocabularyQuery } from '../../common/components/vocabulary/vocabulary-slice';
import CollectionSidebar from './collection-sidebar';
import { MainContent, PageContent } from './collection.styles';

interface CollectionProps {
  terminologyId: string;
  collectionId: string;
}

export default function Collection({ terminologyId, collectionId }: CollectionProps) {
  const { breakpoint } = useBreakpoints();
  const { data: terminology } = useGetVocabularyQuery(terminologyId);
  const { data: collection } = useGetCollectionQuery({ terminologyId, collectionId });

  return (
    <PageContent breakpoint={breakpoint}>
      <MainContent>
        <PropertyValue
          property={collection?.properties.prefLabel}
          fallbackLanguage="fi"
        />
      </MainContent>
      {collection && <CollectionSidebar collection={collection} />}
    </PageContent>
  );
};
