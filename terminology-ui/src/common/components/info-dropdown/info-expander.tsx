import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import {
  Button,
  ExpanderContent,
  ExpanderTitleButton,
  ExternalLink,
  IconDownload,
  IconEdit,
  IconPlus,
  VisuallyHidden,
} from 'suomifi-ui-components';
import {
  ActionBlock,
  InfoExpanderWrapper,
  PropertyList,
} from './info-expander.styles';
import { VocabularyInfoDTO } from '@app/common/interfaces/vocabulary.interface';
import Separator from 'yti-common-ui/separator';
import { BasicBlock, BasicBlockExtraWrapper } from 'yti-common-ui/block';
import {
  MultilingualPropertyBlock,
  PropertyBlock,
} from '@app/common/components/block';
import FormattedDate from 'yti-common-ui/formatted-date';
import { useSelector } from 'react-redux';
import { selectLogin } from '@app/common/components/login/login.slice';
import HasPermission from '@app/common/utils/has-permission';
import {
  translateLanguage,
  translateTerminologyType,
} from '@app/common/utils/translation-helpers';
import { getPropertyValue } from '../property-value/get-property-value';
import PropertyValue from '../property-value';
import RemovalModal from '../removal-modal';
import NewConceptModal from '../new-concept-modal';
import ConceptImportModal from '../concept-import';
import { useGetConceptResultQuery } from '../vocabulary/vocabulary.slice';
import useUrlState from '@app/common/utils/hooks/use-url-state';
import axios from 'axios';
import { useStoreDispatch } from '@app/store';
import { setAlert } from '../alert/alert.slice';
import UpdateWithFileModal from '../update-with-file-modal';
import StatusMassEdit from '../status-mass-edit';
import isEmail from 'validator/lib/isEmail';
import { useRouter } from 'next/router';

const Subscription = dynamic(
  () => import('@app/common/components/subscription/subscription')
);
const CopyTerminologyModal = dynamic(() => import('../copy-terminology-modal'));

interface InfoExpanderProps {
  data?: VocabularyInfoDTO;
}

export default function InfoExpander({ data }: InfoExpanderProps) {
  const { t, i18n } = useTranslation('common');
  const { urlState } = useUrlState();
  const router = useRouter();
  const user = useSelector(selectLogin());
  const terminologyId =
    data?.type?.graph.id ?? data?.identifier?.type.graph?.id ?? '';
  const { refetch: refetchConcepts } = useGetConceptResultQuery({
    id: terminologyId,
    urlState,
    language: i18n.language,
  });
  const dispatch = useStoreDispatch();

  if (!data) {
    return null;
  }

  const contact = getPropertyValue({
    property: data.properties.contact,
  }).trim();

  const handleDownloadClick = async () => {
    const result = await axios.get(
      `/terminology-api/api/v1/export/${data.type.graph.id}?format=xlsx`,
      { responseType: 'arraybuffer' }
    );

    if (result.status !== 200) {
      dispatch(
        setAlert(
          [
            {
              note: result,
              displayText: t('error-occured_download-excel', { ns: 'alert' }),
            },
          ],
          []
        )
      );
      return;
    }

    const url = window.URL.createObjectURL(new Blob([result.data]));
    const fileName = result.headers['content-disposition']
      .split('=')[1]
      .endsWith('.xlsx')
      ? result.headers['content-disposition'].split('=')[1].trim()
      : `${getPropertyValue({
          property: data.properties.prefLabel,
          language: i18n.language,
        })}_export.xlsx`;
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <InfoExpanderWrapper id="info-expander">
      <ExpanderTitleButton asHeading="h2">
        {t('vocabulary-info-terminology')}
      </ExpanderTitleButton>
      <ExpanderContent>
        <MultilingualPropertyBlock
          title={t('vocabulary-info-name')}
          data={data.properties.prefLabel}
          id="preferred-label"
        />
        <MultilingualPropertyBlock
          title={t('vocabulary-info-description')}
          data={data.properties.description}
          id="description"
        />
        <BasicBlock
          title={t('vocabulary-info-information-domain')}
          id="information-domains"
        >
          {data.references.inGroup
            ?.map((group) =>
              getPropertyValue({
                property: group.properties.prefLabel,
                language: i18n.language,
              })
            )
            .join(', ')}
        </BasicBlock>

        <PropertyBlock
          title={t('vocabulary-info-languages')}
          property={data.properties.language}
          delimiter=", "
          valueAccessor={({ value }) => {
            // if no translation found for language, return only language code
            const tr = translateLanguage(value, t);
            if (tr === value) {
              return value;
            }
            return `${tr} ${value.toUpperCase()}`;
          }}
          id="languages"
        />
        <BasicBlock title={t('vocabulary-info-vocabulary-type')} id="type">
          {translateTerminologyType(
            data.properties?.terminologyType?.[0].value ??
              'TERMINOLOGICAL_VOCABULARY',
            t
          )}
        </BasicBlock>

        {contact && (
          <BasicBlock title={t('contact')}>
            <ExternalLink
              href={`mailto:${
                isEmail(contact) ? contact : 'yhteentoimivuus@dvv.fi'
              }?subject=${t('feedback-vocabulary')} - ${getPropertyValue({
                property: data.properties.prefLabel,
                language: i18n.language,
              })}`}
              labelNewWindow={`${t('site-open-new-email')} ${contact}`}
              style={{ fontSize: '16px' }}
            >
              {contact}
            </ExternalLink>
          </BasicBlock>
        )}

        {HasPermission({
          actions: 'EDIT_TERMINOLOGY',
          targetOrganization: data.references.contributor,
        }) && (
          <>
            <Separator isLarge />
            <BasicBlock
              title={t('terminology-actions', { ns: 'admin' })}
              extra={
                <BasicBlockExtraWrapper>
                  <ActionBlock>
                    <Button
                      icon={<IconEdit />}
                      variant="secondary"
                      id="edit-terminology-button"
                      onClick={() =>
                        router.push(`/terminology/${terminologyId}/edit`)
                      }
                    >
                      {t('edit-terminology', { ns: 'admin' })}
                    </Button>

                    <UpdateWithFileModal />

                    <CopyTerminologyModal
                      terminologyId={terminologyId}
                      noWrap
                    />

                    <RemovalModal
                      removalData={{ type: 'terminology', data: data }}
                      targetId={terminologyId}
                      targetName={getPropertyValue({
                        property: data.properties.prefLabel,
                        language: i18n.language,
                      })}
                      nonDescriptive
                    />
                  </ActionBlock>
                </BasicBlockExtraWrapper>
              }
            />
          </>
        )}

        {HasPermission({
          actions: 'EDIT_TERMINOLOGY',
          targetOrganization: data.references.contributor,
        }) && (
          <>
            <Separator isLarge />
            <BasicBlock
              title={t('concept-actions', { ns: 'admin' })}
              extra={
                <BasicBlockExtraWrapper>
                  <ActionBlock>
                    <NewConceptModal
                      terminologyId={terminologyId}
                      languages={
                        data.properties.language?.map(({ value }) => value) ??
                        []
                      }
                    />

                    <ConceptImportModal
                      refetch={() => refetchConcepts()}
                      terminologyId={terminologyId}
                    />

                    <Button
                      icon={<IconPlus />}
                      variant="secondary"
                      id="create-collection-button"
                      onClick={() =>
                        router.push(
                          `/terminology/${terminologyId}/new-collection`
                        )
                      }
                    >
                      {t('add-new-collection', { ns: 'admin' })}
                    </Button>

                    <StatusMassEdit terminologyId={terminologyId} />
                  </ActionBlock>
                </BasicBlockExtraWrapper>
              }
            />
          </>
        )}

        <Separator isLarge />

        <BasicBlock
          title={t('vocabulary-info-vocabulary-export')}
          extra={
            <BasicBlockExtraWrapper>
              <Button
                icon={<IconDownload />}
                variant="secondary"
                onClick={() => handleDownloadClick()}
                id="export-terminology-button"
              >
                {t('vocabulary-info-vocabulary-button')}
              </Button>
            </BasicBlockExtraWrapper>
          }
          id="export-terminology-block"
        >
          {t('vocabulary-info-vocabulary-export-description')}
        </BasicBlock>

        <Separator isLarge />

        {!user.anonymous && (
          <>
            <BasicBlock
              title={t('email-subscription')}
              extra={
                <BasicBlockExtraWrapper>
                  <Subscription
                    uri={data.uri?.replace(/\/terminological[\w-]+/g, '/')}
                  />
                </BasicBlockExtraWrapper>
              }
              id="email-subscription-block"
            >
              {t('email-subscription-description')}
            </BasicBlock>

            <Separator isLarge />
          </>
        )}

        <VisuallyHidden as="h3">
          {t('additional-technical-information', { ns: 'common' })}
        </VisuallyHidden>
        <BasicBlock title={t('vocabulary-info-organization')} id="organization">
          <PropertyList>
            {data.references.contributor
              ?.filter((c) => c && c.properties.prefLabel)
              .map((contributor) => (
                <li key={contributor.id}>
                  <PropertyValue property={contributor?.properties.prefLabel} />
                </li>
              ))}
          </PropertyList>
        </BasicBlock>
        <BasicBlock title={t('vocabulary-info-created-at')} id="created-at">
          <FormattedDate date={data.createdDate} />
          {data.createdBy && `, ${data.createdBy}`}
        </BasicBlock>
        {data.properties.origin && (
          <BasicBlock
            title={t('vocabulary-info-copied-from')}
            id="copied-from-terminology"
          >
            {data.properties.origin[0].value}
          </BasicBlock>
        )}
        <BasicBlock title={t('vocabulary-info-modified-at')} id="modified-at">
          <FormattedDate date={data.lastModifiedDate} />
          {data.lastModifiedBy && `, ${data.lastModifiedBy}`}
        </BasicBlock>
        <BasicBlock title="URI" id="uri">
          {data.uri}
        </BasicBlock>
      </ExpanderContent>
    </InfoExpanderWrapper>
  );
}
