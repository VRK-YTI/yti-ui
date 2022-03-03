import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { Heading, Text } from 'suomifi-ui-components';
import { setAlert } from '../../common/components/alert/alert.slice';
import { BasicBlock, MultilingualPropertyBlock, PropertyBlock } from '../../common/components/block';
import { ConceptListBlock } from '../../common/components/block';
import { Breadcrumb, BreadcrumbLink } from '../../common/components/breadcrumb';
import FormattedDate from '../../common/components/formatted-date';
import { useBreakpoints } from '../../common/components/media-query/media-query-context';
import PropertyValue from '../../common/components/property-value';
import { getPropertyValue } from '../../common/components/property-value/get-property-value';
import Separator from '../../common/components/separator';
import { Error } from '../../common/interfaces/error.interface';
import { useStoreDispatch } from '../../store';
import CollectionSidebar from './collection-sidebar';
import { BadgeBar, HeadingBlock, MainContent, PageContent } from './collection.styles';
import { setTitle } from '../../common/components/title/title.slice';
import { useGetCollectionQuery } from '../../common/components/collection/collection-slice';
import { useGetVocabularyQuery } from '../../common/components/vocabulary/vocabulary-slice';

interface CollectionProps {
  terminologyId: string;
  collectionId: string;
  setCollectionTitle: (title: string) => void;
}

export default function Collection({ terminologyId, collectionId, setCollectionTitle }: CollectionProps) {
  const { breakpoint } = useBreakpoints();
  const { t, i18n } = useTranslation('collection');
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { data: terminology, error: terminologyError } = useGetVocabularyQuery(terminologyId, {
    skip: router.isFallback
  });
  const { data: collection, error: collectionError } = useGetCollectionQuery({ terminologyId, collectionId }, {
    skip: router.isFallback
  });

  if (collectionError && 'status' in collectionError && collectionError.status === 404) {
    router.push('/404');
  }

  useEffect(() => {
    setCollectionTitle(getPropertyValue({
      property: collection?.properties.prefLabel,
      language: i18n.language,
      fallbackLanguage: 'fi'
    }) ?? '');
  }, [collection, i18n.language, setCollectionTitle]);

  useEffect(() => {
    dispatch(setAlert([
      terminologyError as Error,
      collectionError as Error
    ]));
  }, [dispatch, terminologyError, collectionError]);

  useEffect(() => {
    if (collection) {
      const title = getPropertyValue({
        property: collection?.properties.prefLabel,
        language: i18n.language,
        fallbackLanguage: 'fi'
      }) ?? '';

      dispatch(setTitle(title));
    }
  }, [collection, dispatch, i18n.language]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [titleRef]);

  return (
    <>
      <Breadcrumb>
        {!terminologyError &&
          <BreadcrumbLink url={`/terminology/${terminologyId}`}>
            <PropertyValue
              property={terminology?.properties.prefLabel}
              fallbackLanguage='fi'
            />
          </BreadcrumbLink>
        }
        {!collectionError &&
          <BreadcrumbLink url={`/terminology/${terminologyId}/collections/${collectionId}`} current>
            <PropertyValue
              property={collection?.properties.prefLabel}
              fallbackLanguage='fi'
            />
          </BreadcrumbLink>
        }
      </Breadcrumb>

      <PageContent breakpoint={breakpoint}>
        <MainContent id="main">
          <HeadingBlock>
            <Text>
              <PropertyValue
                property={terminology?.references.contributor?.[0].properties.prefLabel}
                fallbackLanguage='fi'
              />
            </Text>
            <Heading variant="h1" tabIndex={-1} ref={titleRef}>
              <PropertyValue
                property={collection?.properties.prefLabel}
                fallbackLanguage='fi'
              />
            </Heading>
            <BadgeBar>
              {t('heading')} &middot; <PropertyValue property={terminology?.properties.prefLabel} fallbackLanguage='fi' />
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
