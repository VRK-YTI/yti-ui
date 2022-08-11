import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import {
  Button,
  ExpanderContent,
  ExpanderTitleButton,
  VisuallyHidden,
} from 'suomifi-ui-components';
import { InfoExpanderWrapper } from './info-expander.styles';
import { VocabularyInfoDTO } from '@app/common/interfaces/vocabulary.interface';
import Separator from '@app/common/components/separator';
import {
  BasicBlock,
  MultilingualPropertyBlock,
  PropertyBlock,
} from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import FormattedDate from '@app/common/components/formatted-date';
import { useSelector } from 'react-redux';
import { selectLogin } from '@app/common/components/login/login.slice';
import HasPermission from '@app/common/utils/has-permission';
import {
  translateLanguage,
  translateTerminologyType,
} from '@app/common/utils/translation-helpers';
import Link from 'next/link';
import { getPropertyValue } from '../property-value/get-property-value';

const Subscription = dynamic(
  () => import('@app/common/components/subscription/subscription')
);
const NewConceptModal = dynamic(() => import('../new-concept-modal'));
const CopyTerminologyModal = dynamic(() => import('../copy-terminology-modal'));

interface InfoExpanderProps {
  data?: VocabularyInfoDTO;
}

export default function InfoExpander({ data }: InfoExpanderProps) {
  const { t, i18n } = useTranslation('common');
  const user = useSelector(selectLogin());

  if (!data) {
    return null;
  }

  return (
    <InfoExpanderWrapper>
      <ExpanderTitleButton asHeading="h2">
        {t('vocabulary-info-terminology')}
      </ExpanderTitleButton>
      <ExpanderContent>
        <MultilingualPropertyBlock
          title={t('vocabulary-info-name')}
          data={data.properties.prefLabel}
        />
        <MultilingualPropertyBlock
          title={t('vocabulary-info-description')}
          data={data.properties.description}
        />
        <BasicBlock title={t('vocabulary-info-information-domain')}>
          {data.references.inGroup
            ?.map((group) =>
              getPropertyValue({
                property: group.properties.prefLabel,
                language: i18n.language,
                fallbackLanguage: 'fi',
              })
            )
            .join(', ')}
        </BasicBlock>

        <PropertyBlock
          title={t('vocabulary-info-languages')}
          property={data.properties.language}
          delimiter=", "
          valueAccessor={({ value }) =>
            `${translateLanguage(value, t)} ${value.toUpperCase()}`
          }
        />
        <BasicBlock title={t('vocabulary-info-vocabulary-type')}>
          {translateTerminologyType(
            data.properties?.terminologyType?.[0].value ??
              'TERMINOLOGICAL_VOCABULARY',
            t
          )}
        </BasicBlock>

        {HasPermission({
          actions: 'EDIT_TERMINOLOGY',
          targetOrganization: data.references.contributor?.[0].id,
        }) && (
          <>
            <Separator isLarge />
            <BasicBlock
              title={t('edit-terminology-info', { ns: 'admin' })}
              extra={
                <BasicBlockExtraWrapper>
                  <Link
                    href={`/terminology/${data.identifier.type.graph.id}/edit`}
                  >
                    <Button icon="edit" variant="secondary">
                      {t('edit-terminology', { ns: 'admin' })}
                    </Button>
                  </Link>
                </BasicBlockExtraWrapper>
              }
            >
              {t('you-have-right-edit-terminology', { ns: 'admin' })}
            </BasicBlock>
          </>
        )}

        {HasPermission({
          actions: 'CREATE_CONCEPT',
          targetOrganization: data.references.contributor?.[0].id,
        }) && (
          <NewConceptModal
            terminologyId={data.type.graph.id}
            languages={
              data.properties.language?.map(({ value }) => value) ?? []
            }
          />
        )}

        {HasPermission({
          actions: 'CREATE_COLLECTION',
          targetOrganization: data.references.contributor?.[0].id,
        }) && (
          <>
            <Separator isLarge />
            <BasicBlock
              title={t('new-collection-to-terminology', { ns: 'admin' })}
              extra={
                <BasicBlockExtraWrapper>
                  <Link
                    href={`/terminology/${data.identifier.type.graph.id}/new-collection`}
                  >
                    <Button icon="plus" variant="secondary">
                      {t('add-new-collection', { ns: 'admin' })}
                    </Button>
                  </Link>
                </BasicBlockExtraWrapper>
              }
            >
              {t('you-have-right-new-collection', { ns: 'admin' })}
            </BasicBlock>
          </>
        )}

        <Separator isLarge />

        <BasicBlock
          title={t('vocabulary-info-vocabulary-export')}
          extra={
            <BasicBlockExtraWrapper>
              <Button
                icon="download"
                variant="secondary"
                onClick={() => {
                  window.open(
                    `/terminology-api/api/v1/export/${data.type.graph.id}?format=xlsx`,
                    '_blank'
                  );
                }}
              >
                {t('vocabulary-info-vocabulary-export')} (.xlsx)
              </Button>
            </BasicBlockExtraWrapper>
          }
        >
          {t('vocabulary-info-vocabulary-export-description')}
        </BasicBlock>

        {HasPermission({
          actions: 'CREATE_TERMINOLOGY',
        }) && <CopyTerminologyModal terminologyId={data.type.graph.id} />}

        {!user.anonymous && (
          <>
            <Separator isLarge />

            <BasicBlock
              title={t('email-subscription')}
              extra={
                <BasicBlockExtraWrapper>
                  <Subscription
                    uri={data.uri?.replace(/\/terminological[\w-]+/g, '/')}
                  />
                </BasicBlockExtraWrapper>
              }
            >
              {t('email-subscription-description')}
            </BasicBlock>

            <Separator isLarge />
          </>
        )}

        <VisuallyHidden as="h3">
          {t('additional-technical-information', { ns: 'common' })}
        </VisuallyHidden>

        <PropertyBlock
          title={t('vocabulary-info-organization')}
          property={data.references.contributor?.[0]?.properties.prefLabel}
          fallbackLanguage="fi"
        />
        <BasicBlock title={t('vocabulary-info-created-at')}>
          <FormattedDate date={data.createdDate} />
          {data.createdBy && `, ${data.createdBy}`}
        </BasicBlock>
        <BasicBlock title={t('vocabulary-info-modified-at')}>
          <FormattedDate date={data.lastModifiedDate} />
          {data.lastModifiedBy && `, ${data.lastModifiedBy}`}
        </BasicBlock>
        <BasicBlock title="URI">{data.uri}</BasicBlock>
      </ExpanderContent>
    </InfoExpanderWrapper>
  );
}
