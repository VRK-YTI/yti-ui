import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import {
  Button,
  IconEdit,
  Notification,
  Paragraph,
  Text,
  VisuallyHidden,
  Link as SuomiLink,
} from 'suomifi-ui-components';
import {
  BasicBlock,
  BasicBlockExtraWrapper,
  List,
  MultilingualBlock,
} from 'yti-common-ui/block';
import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import FormattedDate from 'yti-common-ui/formatted-date';
import { useBreakpoints } from 'yti-common-ui/media-query';
import Separator from 'yti-common-ui/separator';
import { useStoreDispatch } from '@app/store';
import CollectionSidebar from './collection-sidebar';
import {
  EditToolsBlock,
  MainContent,
  PageContent,
  PropertyList,
} from './collection.styles';
import { setTitle } from '@app/common/components/title/title.slice';
import { useGetCollectionQuery } from '@app/common/components/collection/collection.slice';
import { useGetTerminologyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { SubTitle, MainTitle, BadgeBar } from 'yti-common-ui/title-block';
import HasPermission from '@app/common/utils/has-permission';
import Link from 'next/link';
import RemovalModal from '@app/common/components/removal-modal';
import { useGetOrganizationsQuery } from '@app/common/components/terminology-search/terminology-search.slice';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

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

  const { data: terminology, error: terminologyError } = useGetTerminologyQuery(
    { id: terminologyId },
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
  const {
    data: organizations,
    isLoading,
    isError,
  } = useGetOrganizationsQuery({
    language: i18n.language,
    showChildOrganizations: true,
  });

  const childOrganizations = useMemo(() => {
    if (isLoading || isError) {
      return [];
    }
    return organizations
      ?.filter((org) => org.parentOrganization)
      .map((org) => org.id);
  }, [organizations, isLoading, isError]);

  const prefLabel = getLanguageVersion({
    data: collection?.label,
    lang: i18n.language,
  });

  useEffect(() => {
    if (collection) {
      dispatch(setTitle(prefLabel ?? ''));
    }
  }, [collection, dispatch, prefLabel]);

  if (collectionError) {
    return (
      <>
        <Breadcrumb>
          {!terminologyError && (
            <BreadcrumbLink url={`/terminology/${terminologyId}`}>
              {getLanguageVersion({
                data: terminology?.label,
                lang: i18n.language,
              })}
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
            {getLanguageVersion({
              data: terminology?.label,
              lang: i18n.language,
            })}
          </BreadcrumbLink>
        )}
        <BreadcrumbLink
          url={`/terminology/${terminologyId}/collections/${collectionId}`}
          current
        >
          {getLanguageVersion({ data: collection?.label, lang: i18n.language })}
        </BreadcrumbLink>
      </Breadcrumb>

      <PageContent $breakpoint={breakpoint}>
        <MainContent id="main">
          <SubTitle>
            {terminology?.organizations
              .map((org) =>
                getLanguageVersion({ data: org?.label, lang: i18n.language })
              )
              .join(', ')}
          </SubTitle>
          <MainTitle>
            {getLanguageVersion({
              data: collection?.label,
              lang: i18n.language,
            })}
          </MainTitle>
          <BadgeBar>
            {t('heading')}
            {getLanguageVersion({
              data: terminology?.label,
              lang: i18n.language,
            })}
          </BadgeBar>

          <BasicBlock title="URI">{collection?.uri}</BasicBlock>

          <BasicBlock title={t('field-name')}>
            <MultilingualBlock data={collection?.label ?? {}} />
          </BasicBlock>

          {collection?.description && (
            <BasicBlock title={t('field-definition')}>
              <MultilingualBlock data={collection?.description ?? {}} />
            </BasicBlock>
          )}

          <BasicBlock title={<h2>{t('field-member')}</h2>}>
            <List>
              {collection?.members?.map((concept) => (
                <li key={concept.identifier}>
                  <Link
                    href={`/terminology/${terminology?.prefix}/concept/${concept.identifier}`}
                    passHref
                    legacyBehavior
                  >
                    <SuomiLink href="">
                      {getLanguageVersion({
                        data: concept.label,
                        lang: i18n.language,
                      })}
                    </SuomiLink>
                  </Link>
                </li>
              ))}
            </List>
          </BasicBlock>

          <Separator />

          {HasPermission({
            actions: ['EDIT_COLLECTION', 'DELETE_COLLECTION'],
            targetOrganization: terminology?.organizations,
          }) && (
            <>
              <BasicBlock
                title={t('edit-collection-block-title')}
                extra={
                  <BasicBlockExtraWrapper>
                    <EditToolsBlock>
                      <Link href={`${router.asPath}/edit`}>
                        <Button
                          variant="secondary"
                          icon={<IconEdit />}
                          id="edit-collection-button"
                        >
                          {t('edit-collection')}
                        </Button>
                      </Link>

                      <RemovalModal
                        nonDescriptive={true}
                        dataType="collection"
                        targetPrefix={terminology?.prefix}
                        targetId={collection?.identifier ?? ''}
                        targetName={prefLabel}
                      />
                    </EditToolsBlock>
                  </BasicBlockExtraWrapper>
                }
              ></BasicBlock>

              <Separator isLarge />
            </>
          )}

          <VisuallyHidden as="h2">
            {t('additional-technical-information', { ns: 'common' })}
          </VisuallyHidden>

          <BasicBlock
            title={t('vocabulary-info-organization', { ns: 'common' })}
            id="organization"
          >
            <PropertyList $smBot={true}>
              {terminology?.organizations
                ?.filter(
                  (o) => o && o.label && !childOrganizations?.includes(o.id)
                )
                .map((organization) => (
                  <li key={organization.id}>
                    {getLanguageVersion({
                      data: organization?.label,
                      lang: i18n.language,
                    })}
                  </li>
                ))}
            </PropertyList>
          </BasicBlock>

          <BasicBlock title={t('vocabulary-info-created-at', { ns: 'common' })}>
            <FormattedDate date={collection?.created} />
            {collection?.creator.name && `, ${collection.creator.name}`}
          </BasicBlock>
          <BasicBlock
            title={t('vocabulary-info-modified-at', { ns: 'common' })}
          >
            <FormattedDate date={collection?.modified} />
            {collection?.modifier.name && `, ${collection.modifier.name}`}
          </BasicBlock>
        </MainContent>
        {collection && (
          <CollectionSidebar
            collection={collection}
            prefix={terminology?.prefix ?? ''}
          />
        )}
      </PageContent>
    </>
  );
}
