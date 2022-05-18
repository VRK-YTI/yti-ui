import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { VisuallyHidden } from 'suomifi-ui-components';
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
import { useStoreDispatch } from '@app/store';
import CollectionSidebar from './collection-sidebar';
import { MainContent, PageContent } from './collection.styles';
import { setTitle } from '@app/common/components/title/title.slice';
import { useGetCollectionQuery } from '@app/common/components/collection/collection.slice';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { getProperty } from '@app/common/utils/get-property';
import {
  SubTitle,
  MainTitle,
  BadgeBar,
} from '@app/common/components/title-block';

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
    dispatch(setAlert([terminologyError, collectionError], []));
  }, [dispatch, terminologyError, collectionError]);

  useEffect(() => {
    if (collection) {
      dispatch(setTitle(prefLabel ?? ''));
    }
  }, [collection, dispatch, prefLabel]);

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

      <PageContent $breakpoint={breakpoint}>
        <MainContent id="main">
          <SubTitle>
            <PropertyValue
              property={getProperty(
                'prefLabel',
                terminology?.references.contributor
              )}
              fallbackLanguage="fi"
            />
          </SubTitle>
          <MainTitle>
            <PropertyValue
              property={collection?.properties.prefLabel}
              fallbackLanguage="fi"
            />
          </MainTitle>
          <BadgeBar>
            {t('heading')}
            <PropertyValue
              property={terminology?.properties.prefLabel}
              fallbackLanguage="fi"
            />
          </BadgeBar>

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
