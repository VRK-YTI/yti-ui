import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import {
  Button,
  Notification,
  Paragraph,
  Text,
  VisuallyHidden,
} from 'suomifi-ui-components';
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
import { useSelector } from 'react-redux';
import { selectLogin } from '@app/common/components/login/login.slice';
import HasPermission from '@app/common/utils/has-permission';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import Link from 'next/link';

interface CollectionProps {
  terminologyId: string;
  collectionId: string;
}

export default function Collection({
  terminologyId,
  collectionId,
}: CollectionProps) {
  const { breakpoint } = useBreakpoints();
  const { t, i18n } = useTranslation('collection');
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const loginInformation = useSelector(selectLogin());

  const { data: terminology, error: terminologyError } = useGetVocabularyQuery(
    { id: terminologyId },
    {
      skip: router.isFallback,
    }
  );
  const {
    data: collection,
    error: collectionError,
    refetch,
  } = useGetCollectionQuery(
    { terminologyId, collectionId },
    {
      skip: router.isFallback,
    }
  );

  const prefLabel = getPropertyValue({
    property: collection?.properties.prefLabel,
    language: i18n.language,
  });

  useEffect(() => {
    if (collection) {
      dispatch(setTitle(prefLabel ?? ''));
    }
  }, [collection, dispatch, prefLabel]);

  useEffect(() => {
    if (!loginInformation.anonymous) {
      refetch();
    }
  }, [loginInformation, refetch]);

  if (collectionError) {
    return (
      <>
        <Breadcrumb>
          {!terminologyError && (
            <BreadcrumbLink url={`/terminology/${terminologyId}`}>
              <PropertyValue property={terminology?.properties.prefLabel} />
            </BreadcrumbLink>
          )}
          <BreadcrumbLink url={''} current>
            ...
          </BreadcrumbLink>
        </Breadcrumb>

        <main id="main">
          <Notification
            closeText={t('close')}
            headingText={t('error-not-found', {
              context: 'collection',
              ns: 'common',
            })}
            status="error"
            onCloseButtonClick={() =>
              router.push(
                !terminologyError ? `/terminology/${terminologyId}` : '/'
              )
            }
          >
            <Paragraph>
              <Text smallScreen>
                {t('error-not-found-desc', {
                  context: 'collection',
                  ns: 'common',
                })}
              </Text>
            </Paragraph>
          </Notification>
        </main>
      </>
    );
  }

  return (
    <>
      <Breadcrumb>
        {!terminologyError && (
          <BreadcrumbLink url={`/terminology/${terminologyId}`}>
            <PropertyValue property={terminology?.properties.prefLabel} />
          </BreadcrumbLink>
        )}
        <BreadcrumbLink
          url={`/terminology/${terminologyId}/collections/${collectionId}`}
          current
        >
          <PropertyValue property={collection?.properties.prefLabel} />
        </BreadcrumbLink>
      </Breadcrumb>

      <PageContent $breakpoint={breakpoint}>
        <MainContent id="main">
          <SubTitle>
            <PropertyValue
              property={getProperty(
                'prefLabel',
                terminology?.references.contributor
              )}
            />
          </SubTitle>
          <MainTitle>
            <PropertyValue property={collection?.properties.prefLabel} />
          </MainTitle>
          <BadgeBar>
            {t('heading')}
            <PropertyValue property={terminology?.properties.prefLabel} />
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

          {HasPermission({
            actions: 'EDIT_COLLECTION',
            targetOrganization: terminology?.references.contributor,
          }) && (
            <>
              <BasicBlock
                title="Muokkaa käsitekokoelmaa"
                extra={
                  <BasicBlockExtraWrapper>
                    <Link href={`${router.asPath}/edit`}>
                      <Button
                        variant="secondary"
                        icon="edit"
                        id="edit-collection-button"
                      >
                        Muokkaa käsitekokoelmaa
                      </Button>
                    </Link>
                  </BasicBlockExtraWrapper>
                }
              >
                Sinulla on oikeudet muokata tätä käsitekokoelmaa
              </BasicBlock>

              <Separator />
            </>
          )}

          <VisuallyHidden as="h2">
            {t('additional-technical-information', { ns: 'common' })}
          </VisuallyHidden>

          <PropertyBlock
            title={t('vocabulary-info-organization', { ns: 'common' })}
            property={
              terminology?.references.contributor?.[0]?.properties.prefLabel
            }
          />
          <BasicBlock title={t('vocabulary-info-created-at', { ns: 'common' })}>
            <FormattedDate date={collection?.createdDate} />
            {collection?.createdBy && `, ${collection.createdBy}`}
          </BasicBlock>
          <BasicBlock
            title={t('vocabulary-info-modified-at', { ns: 'common' })}
          >
            <FormattedDate date={collection?.lastModifiedDate} />
            {collection?.lastModifiedBy && `, ${collection.lastModifiedBy}`}
          </BasicBlock>
          <BasicBlock title="URI">{collection?.uri}</BasicBlock>
        </MainContent>
        {collection && <CollectionSidebar collection={collection} />}
      </PageContent>
    </>
  );
}
