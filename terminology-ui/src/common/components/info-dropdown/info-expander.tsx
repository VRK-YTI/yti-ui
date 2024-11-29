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
import Separator from 'yti-common-ui/separator';
import {
  BasicBlock,
  BasicBlockExtraWrapper,
  MultilingualBlock,
} from 'yti-common-ui/block';
import FormattedDate from 'yti-common-ui/formatted-date';
import { useSelector } from 'react-redux';
import { selectLogin } from '@app/common/components/login/login.slice';
import HasPermission from '@app/common/utils/has-permission';
import {
  translateLanguage,
  translateTerminologyType,
} from '@app/common/utils/translation-helpers';
import RemovalModal from '../removal-modal';
import NewConceptModal from '../new-concept-modal';
import ConceptImportModal from '../concept-import';
import { useGetConceptResultQuery } from '../vocabulary/vocabulary.slice';
import useUrlState from '@app/common/utils/hooks/use-url-state';
import StatusMassEdit from '../status-mass-edit';
import isEmail from 'validator/lib/isEmail';
import { useRouter } from 'next/router';

import {
  TerminologyInfo,
  TerminologyType,
} from '@app/common/interfaces/interfaces-v2';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';
import { compareLocales } from 'yti-common-ui/utils/compare-locales';
import { useState } from 'react';

const Subscription = dynamic(
  () => import('@app/common/components/subscription/subscription')
);
const CopyTerminologyModal = dynamic(() => import('../copy-terminology-modal'));
const AsFileModal = dynamic(() => import('../as-file-modal'));

interface InfoExpanderProps {
  data?: TerminologyInfo;
  childOrganizations?: string[];
}

export default function InfoExpander({
  data,
  childOrganizations,
}: InfoExpanderProps) {
  const { t, i18n } = useTranslation('common');
  const { urlState } = useUrlState();
  const [showDownloadFileModal, setShowDownloadFileModal] = useState(false);
  const router = useRouter();
  const user = useSelector(selectLogin());
  const terminologyId = data?.prefix ?? '';
  const { refetch: refetchConcepts } = useGetConceptResultQuery({
    id: terminologyId,
    urlState,
    language: i18n.language,
  });

  if (!data) {
    return null;
  }

  const handleDownloadClick = () => {
    setShowDownloadFileModal(true);
  };

  return (
    <InfoExpanderWrapper id="info-expander">
      <ExpanderTitleButton asHeading="h2">
        {t('vocabulary-info-terminology')}
      </ExpanderTitleButton>
      <ExpanderContent>
        <BasicBlock title={t('vocabulary-info-name')}>
          <MultilingualBlock data={data.label} />
        </BasicBlock>

        <BasicBlock title={t('vocabulary-info-description')}>
          {Object.keys(data.description).length > 0 ? (
            <MultilingualBlock data={data.description} renderHtml={true} />
          ) : (
            <></>
          )}
        </BasicBlock>

        <BasicBlock title="URI" id="uri">
          {data.uri}
        </BasicBlock>
        <BasicBlock
          title={t('vocabulary-info-information-domain')}
          id="information-domains"
        >
          {data.groups
            .map((g) =>
              getLanguageVersion({ data: g.label, lang: i18n.language })
            )
            .join(', ')}
        </BasicBlock>

        <BasicBlock title={t('vocabulary-info-languages')} id="languages">
          {data.languages
            ?.slice()
            .sort((a, b) => compareLocales(a, b))
            .map((lang) => {
              const tr = translateLanguage(lang, t);
              if (tr) {
                return `${tr} ${lang.toUpperCase()}`;
              }
              return lang;
            })
            .join(', ')}
        </BasicBlock>

        <BasicBlock title={t('vocabulary-info-vocabulary-type')} id="type">
          {translateTerminologyType(
            data.graphType ?? TerminologyType.TERMINOLOGICAL_VOCABULARY,
            t
          )}
        </BasicBlock>

        {data.contact && (
          <BasicBlock title={t('contact')}>
            <ExternalLink
              href={`mailto:${
                isEmail(data.contact) ? data.contact : 'yhteentoimivuus@dvv.fi'
              }?subject=${t('feedback-vocabulary')} - ${getLanguageVersion({
                data: data.label,
                lang: i18n.language,
              })}`}
              labelNewWindow={`${t('site-open-new-email')} ${data.contact}`}
              style={{ fontSize: '16px' }}
            >
              {data.contact}
            </ExternalLink>
          </BasicBlock>
        )}

        {HasPermission({
          actions: 'EDIT_TERMINOLOGY',
          targetOrganization: data.organizations,
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

                    <CopyTerminologyModal
                      terminologyId={terminologyId ?? ''}
                      noWrap
                    />

                    <RemovalModal
                      dataType="terminology"
                      status={data.status}
                      targetId={terminologyId}
                      targetName={getLanguageVersion({
                        data: data.label,
                        lang: i18n.language,
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
          targetOrganization: data.organizations,
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
                      languages={data.languages}
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

        <AsFileModal
          prefix={terminologyId}
          visible={showDownloadFileModal}
          onClose={() => setShowDownloadFileModal(false)}
          filename={getLanguageVersion({
            data: data.label,
            lang: i18n.language,
          })}
        />

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
            {data.organizations
              .filter((org) => !childOrganizations?.includes(org.id))
              .map((org) => (
                <li key={org.id}>
                  {getLanguageVersion({ data: org.label, lang: i18n.language })}
                </li>
              ))}
          </PropertyList>
        </BasicBlock>
        <BasicBlock title={t('vocabulary-info-created-at')} id="created-at">
          <FormattedDate date={data.created} />
          {data.creator.name && `, ${data.creator.name}`}
        </BasicBlock>
        <BasicBlock title={t('vocabulary-info-modified-at')} id="modified-at">
          <FormattedDate date={data.modified} />
          {data.modifier.name && `, ${data.modifier.name}`}
        </BasicBlock>
      </ExpanderContent>
    </InfoExpanderWrapper>
  );
}
