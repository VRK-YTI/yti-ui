import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import {
  Expander,
  ExpanderGroup,
  ExpanderTitleButton,
  ExternalLink,
  Heading,
} from 'suomifi-ui-components';
import { BasicBlock, MultilingualBlock } from 'yti-common-ui/block';
import {
  getBaseModelPrefix,
  getComments,
  getContact,
  getCreated,
  getDataVocabularies,
  getIsPartOf,
  getLanguages,
  getLink,
  getOrganization,
  getReferenceData,
  getTerminology,
  getTitles,
  getUri,
} from '@app/common/utils/get-value';
import { ModelInfoListWrapper, ModelInfoWrapper } from './model.styles';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import { compareLocales } from '@app/common/utils/compare-locals';
import Separator from 'yti-common-ui/separator';
import FormattedDate from 'yti-common-ui/formatted-date';

export default function ModelInfoView() {
  const { t, i18n } = useTranslation('common');
  const { query } = useRouter();
  const [modelId] = useState(
    Array.isArray(query.modelId) ? query.modelId[0] : query.modelId ?? ''
  );
  const { data: modelInfo } = useGetModelQuery(modelId);

  const data = useMemo(() => {
    if (!modelInfo) {
      return undefined;
    }

    return {
      title: getTitles(modelInfo),
      description: getComments(modelInfo),
      prefix: getBaseModelPrefix(modelInfo),
      uri: getUri(modelInfo),
      isPartOf: getIsPartOf(modelInfo, i18n.language),
      languages: getLanguages(modelInfo),
      terminologies: getTerminology(modelInfo, i18n.language),
      referenceData: getReferenceData(modelInfo, i18n.language),
      dataVocabularies: getDataVocabularies(modelInfo, i18n.language),
      links: getLink(modelInfo),
      organizations: getOrganization(modelInfo, i18n.language),
      contact: getContact(modelInfo),
      created: getCreated(modelInfo),
    };
  }, [modelInfo, i18n.language]);

  if (!modelInfo || !data) {
    return <ModelInfoWrapper />;
  }

  return (
    <ModelInfoWrapper>
      <Heading variant="h2">{t('details')}</Heading>

      <BasicBlock title={t('name')}>
        <MultilingualBlock
          data={data.title
            .map((title) => ({
              lang: title['@language'],
              value: title['@value'],
            }))
            .sort((a, b) => compareLocales(a.lang, b.lang))}
        />
      </BasicBlock>
      <BasicBlock title={t('description')}>
        {data.description.length > 0 ? (
          <MultilingualBlock
            data={data.description
              .map((comment) => ({
                lang: comment['@language'],
                value: comment['@value'],
              }))
              .sort((a, b) => compareLocales(a.lang, b.lang))}
          />
        ) : (
          t('not-added')
        )}
      </BasicBlock>
      <BasicBlock title={t('prefix')}>{data.prefix}</BasicBlock>
      <BasicBlock title={t('model-uri')}>{data.uri}</BasicBlock>
      <BasicBlock title={t('information-domains')}>
        {data.isPartOf.join(', ')}
      </BasicBlock>
      <BasicBlock title={t('model-languages')}>
        {data.languages
          .map((lang) => `${translateLanguage(lang, t)} ${lang.toUpperCase()}`)
          .join(', ')}
      </BasicBlock>

      <BasicBlock title={t('terminologies-used')}>
        {data.terminologies.length > 0
          ? data.terminologies.map((terminology, idx) => (
              <div key={`model-terminologies-${idx}`}>
                <ExternalLink
                  href={terminology.url}
                  labelNewWindow={`${t('link-opens-new-window-external')} ${
                    terminology.url
                  }`}
                >
                  {terminology.title}
                </ExternalLink>
                <br />
                {terminology.description}
              </div>
            ))
          : t('not-added')}
      </BasicBlock>
      <BasicBlock title={t('reference-data-used')}>
        {data.referenceData.length > 0
          ? data.referenceData.map((reference, idx) => (
              <div key={`model-data-references-${idx}`}>
                <ExternalLink
                  href={reference.url}
                  labelNewWindow={`${t('link-opens-new-window-external')} ${
                    reference.url
                  }`}
                >
                  {reference.title}
                </ExternalLink>
                <br />
                {reference.description}
              </div>
            ))
          : t('not-added')}
      </BasicBlock>
      <BasicBlock title={t('data-vocabularies-used')}>
        {data.dataVocabularies.length > 0
          ? data.dataVocabularies.map((vocab, idx) => (
              <div key={`model-data-references-${idx}`}>
                <ExternalLink
                  href={vocab.url}
                  labelNewWindow={`${t('link-opens-new-window-external')} ${
                    vocab.url
                  }`}
                >
                  {vocab.title}
                </ExternalLink>
              </div>
            ))
          : t('not-added')}
      </BasicBlock>
      <BasicBlock title={t('links')}>
        <ModelInfoListWrapper>
          {data.links.length > 0 ? (
            data.links.map((link, idx) => (
              <div key={`model-link-${idx}`}>
                <ExternalLink
                  href={link.url}
                  labelNewWindow={`${t('link-opens-new-window-external')} ${
                    link.url
                  }`}
                >
                  {link.title}
                </ExternalLink>
                <br />
                {link.description}
              </div>
            ))
          ) : (
            <div>{t('not-added')}</div>
          )}
        </ModelInfoListWrapper>
      </BasicBlock>

      <ExpanderGroup closeAllText="" openAllText="" showToggleAllButton={false}>
        <Expander>
          <ExpanderTitleButton>{t('usage-from-other')}</ExpanderTitleButton>
        </Expander>
      </ExpanderGroup>

      <Separator isLarge />

      <BasicBlock title={t('contributors')}>
        {data.organizations.join(', ')}
      </BasicBlock>

      <BasicBlock title={t('feedback')}>
        <ExternalLink
          href={`mailto:${data.contact}?subject=${data.title}`}
          labelNewWindow=""
        >
          {data.contact}
        </ExternalLink>
      </BasicBlock>

      <BasicBlock title={t('created')}>
        <FormattedDate date={data.created} />
      </BasicBlock>
    </ModelInfoWrapper>
  );
}
