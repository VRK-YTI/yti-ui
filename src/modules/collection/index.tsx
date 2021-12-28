import { useTranslation } from 'next-i18next';
import React from 'react';
import { Heading, Text } from 'suomifi-ui-components';
import { BasicBlock, PropertyBlock } from '../../common/components/block';
import ConceptListBlock from '../../common/components/block/concept-list-block';
import { useGetCollectionQuery } from '../../common/components/collection/collection-slice';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import PropertyValue from '../../common/components/property-value';
import { getPropertyValue } from '../../common/components/property-value/get-property-value';
import Separator from '../../common/components/separator';
import { useGetVocabularyQuery } from '../../common/components/vocabulary/vocabulary-slice';
import FormatISODate from '../../common/utils/format-iso-date';
import CollectionSidebar from './collection-sidebar';
import { BadgeBar, HeadingBlock, MainContent, PageContent } from './collection.styles';

interface CollectionProps {
  terminologyId: string;
  collectionId: string;
}

export default function Collection({ terminologyId, collectionId }: CollectionProps) {
  const { breakpoint } = useBreakpoints();
  const { data: terminology } = useGetVocabularyQuery(terminologyId);
  const { data: collection } = useGetCollectionQuery({ terminologyId, collectionId });
  const { t, i18n } = useTranslation('collection');

  return (
    <PageContent breakpoint={breakpoint}>
      <MainContent>
        <HeadingBlock>
          <Text>
            <PropertyValue
              property={terminology?.references.contributor?.[0].properties.prefLabel}
            />
          </Text>
          <Heading variant="h1">
            <PropertyValue
              property={collection?.properties.prefLabel}
            />
          </Heading>
          <BadgeBar>
            {t('heading')} &middot; <PropertyValue property={terminology?.properties.prefLabel} />
          </BadgeBar>
          <Text>{t('description')}</Text>
        </HeadingBlock>

        <PropertyBlock
          title={t('field-name')}
          data={collection?.properties.prefLabel}
        />
        <PropertyBlock
          title={t('field-definition')}
          data={collection?.properties.definition}
        />
        <ConceptListBlock
          title={t('field-broader')}
          data={collection?.references.broader}
        />
        <ConceptListBlock
          title={t('field-member')}
          data={collection?.references.member}
        />

        <Separator />

        <BasicBlock
          title={t('vocabulary-info-organization', { ns: 'common' })}
          data={getPropertyValue({
            property: terminology?.references.contributor?.[0]?.properties.prefLabel,
            language: i18n.language,
            fallbackLanguage: 'fi',
          })}
        />
        <BasicBlock
          title={t('vocabulary-info-created-at', { ns: 'common' })}
          data={`${FormatISODate(collection?.createdDate)}, ${collection?.createdBy}`}
        />
        <BasicBlock
          title={t('vocabulary-info-modified-at', { ns: 'common' })}
          data={`${FormatISODate(collection?.lastModifiedDate)}, ${collection?.lastModifiedBy}`}
        />
        <BasicBlock
          title={'URI'}
          data={collection?.uri}
        />
      </MainContent>
      {collection && <CollectionSidebar collection={collection} />}
    </PageContent>
  );
};
