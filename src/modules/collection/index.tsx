import { useTranslation } from 'next-i18next';
import React from 'react';
import { Heading, Text } from 'suomifi-ui-components';
import { BasicBlock, MultilingualPropertyBlock, PropertyBlock } from '../../common/components/block';
import { ConceptListBlock } from '../../common/components/block';
import { Breadcrumb, BreadcrumbLink } from '../../common/components/breadcrumb';
import { useGetCollectionQuery } from '../../common/components/collection/collection-slice';
import FormattedDate from '../../common/components/formatted-date';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import PropertyValue from '../../common/components/property-value';
import Separator from '../../common/components/separator';
import { useGetVocabularyQuery } from '../../common/components/vocabulary/vocabulary-slice';
import CollectionSidebar from './collection-sidebar';
import { BadgeBar, HeadingBlock, MainContent, PageContent } from './collection.styles';

/**
 * Error handling:
 * - if an error occurs in data fetching an alert
 *   should be displayed for user about the error
 * - if collection is missing the page's format
 *   shouldn't change. Breadcrumb value is also
 *   missing. Should there be something else there
 *   when collection value is undefined?
 * - if terminology is missing the breacrumb has
 *   an empty value. Could there be something to
 *   put there instead if the value is missing?
 * - if some data is undefined in a collection
 *   should some titles be hidden from the page?
 *   e.g. "Valikoimaan kuuluvien käsitteiden yläkäsitteet"
 *   and "Valikoimaan kuuluvat käsitteet"
 * - errors could be logged in console
 * - could some things be also wrapped in <ErrorBoundary> to display
 *   a message for user
 */

interface CollectionProps {
  terminologyId: string;
  collectionId: string;
}

export default function Collection({ terminologyId, collectionId }: CollectionProps) {
  const { breakpoint } = useBreakpoints();
  const { data: terminology } = useGetVocabularyQuery(terminologyId);
  const { data: collection } = useGetCollectionQuery({ terminologyId, collectionId });
  const { t } = useTranslation('collection');

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink url={`/terminology/${terminologyId}`}>
          <PropertyValue property={terminology?.properties.prefLabel} />
        </BreadcrumbLink>
        <BreadcrumbLink url={`/terminology/${terminologyId}/collections/${collectionId}`} current>
          <PropertyValue property={collection?.properties.prefLabel} />
        </BreadcrumbLink>
      </Breadcrumb>

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

          <MultilingualPropertyBlock
            title={t('field-name')}
            data={collection?.properties.prefLabel}
          />
          <MultilingualPropertyBlock
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

          <PropertyBlock
            title={t('vocabulary-info-organization', { ns: 'common' })}
            property={terminology?.references.contributor?.[0]?.properties.prefLabel}
            fallbackLanguage="fi"
          />
          <BasicBlock title={t('vocabulary-info-created-at', { ns: 'common' })}>
            <FormattedDate date={collection?.createdDate} />, {collection?.createdBy}
          </BasicBlock>
          <BasicBlock title={t('vocabulary-info-modified-at', { ns: 'common' })}>
            <FormattedDate date={collection?.lastModifiedDate} />, {collection?.lastModifiedBy}
          </BasicBlock>
          <BasicBlock title="URI">
            {collection?.uri}
          </BasicBlock>
        </MainContent>
        {collection && <CollectionSidebar collection={collection} />}
      </PageContent>
    </>
  );
};
