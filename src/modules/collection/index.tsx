import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { Heading, Text, VisuallyHidden } from 'suomifi-ui-components';
import { setAlert } from '@app/common/components/alert/alert.slice';
import {
  BasicBlock,
  MultilingualPropertyBlock,
  PropertyBlock,
  ConceptListBlock,
} from '@app/common/components/block';
import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import FormattedDate from '@app/common/components/formatted-date';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import PropertyValue from '@app/common/components/property-value';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import Separator from '@app/common/components/separator';
import { Error } from '@app/common/interfaces/error.interface';
import { useStoreDispatch } from '@app/store';
import CollectionSidebar from './collection-sidebar';
import {
  BadgeBar,
  HeadingBlock,
  MainContent,
  PageContent,
} from './collection.styles';
import { setTitle } from '@app/common/components/title/title.slice';
import { useGetCollectionQuery } from '@app/common/components/collection/collection.slice';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { getProperty } from '@app/common/utils/get-property';

interface CollectionProps {
  terminologyId: string;
  collectionId: string;
  setCollectionTitle: (title?: string) => void;
}

export default function Collection({
  terminologyId,
  collectionId,
  setCollectionTitle,
}: CollectionProps) {
  const { breakpoint } = useBreakpoints();
  const { t, i18n } = useTranslation('collection');
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { data: terminology, error: terminologyError } = useGetVocabularyQuery(
    terminologyId,
    {
      skip: router.isFallback,
    }
  );
  const { data: collection, error: collectionError } = useGetCollectionQuery(
    { terminologyId, collectionId },
    {
      skip: router.isFallback,
    }
  );

  if (
    collectionError &&
    'status' in collectionError &&
    collectionError.status === 404
  ) {
    router.push('/404');
  }

  const prefLabel = getPropertyValue({
    property: collection?.properties.prefLabel,
    language: i18n.language,
    fallbackLanguage: 'fi',
  });

  useEffect(() => {
    setCollectionTitle(prefLabel);
  }, [setCollectionTitle, prefLabel]);

  useEffect(() => {
    dispatch(setAlert([terminologyError as Error, collectionError as Error]));
  }, [dispatch, terminologyError, collectionError]);

  useEffect(() => {
    if (collection) {
      dispatch(setTitle(prefLabel ?? ''));
    }
  }, [collection, dispatch, prefLabel]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [titleRef]);

  return (
    <>
      <Breadcrumb>
        {!terminologyError && (
          <BreadcrumbLink url={`/terminology/${terminologyId}`}>
            <PropertyValue
              property={terminology?.properties.prefLabel}
              fallbackLanguage="fi"
            />
          </BreadcrumbLink>
        )}
        {!collectionError && (
          <BreadcrumbLink
            url={`/terminology/${terminologyId}/collections/${collectionId}`}
            current
          >
            <PropertyValue
              property={collection?.properties.prefLabel}
              fallbackLanguage="fi"
            />
          </BreadcrumbLink>
        )}
      </Breadcrumb>

      <PageContent breakpoint={breakpoint}>
        <MainContent id="main">
          <HeadingBlock>
            <Text>
              <PropertyValue
                property={getProperty(
                  'prefLabel',
                  terminology?.references.contributor
                )}
                fallbackLanguage="fi"
              />
            </Text>
            <Heading variant="h1" tabIndex={-1} ref={titleRef}>
              <PropertyValue
                property={collection?.properties.prefLabel}
                fallbackLanguage="fi"
              />
            </Heading>
            <BadgeBar>
              {t('heading')} &middot;{' '}
              <PropertyValue
                property={terminology?.properties.prefLabel}
                fallbackLanguage="fi"
              />
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
            title={<h2>{t('field-member')}</h2>}
            data={collection?.references.member}
          />

          <Separator />

          <VisuallyHidden as="h2">
            {t('additional-technical-information', { ns: 'common' })}
          </VisuallyHidden>

          <PropertyBlock
            title={t('vocabulary-info-organization', { ns: 'common' })}
            property={
              terminology?.references.contributor?.[0]?.properties.prefLabel
            }
            fallbackLanguage="fi"
          />
          <BasicBlock title={t('vocabulary-info-created-at', { ns: 'common' })}>
            <FormattedDate date={collection?.createdDate} />,{' '}
            {collection?.createdBy}
          </BasicBlock>
          <BasicBlock
            title={t('vocabulary-info-modified-at', { ns: 'common' })}
          >
            <FormattedDate date={collection?.lastModifiedDate} />,{' '}
            {collection?.lastModifiedBy}
          </BasicBlock>
          <BasicBlock title="URI">{collection?.uri}</BasicBlock>
        </MainContent>
        {collection && <CollectionSidebar collection={collection} />}
      </PageContent>
    </>
  );
}
