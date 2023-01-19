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
      organizations: getOrganization(modelInfo),
      contact: getContact(modelInfo),
      created: getCreated(modelInfo),
    };
  }, [modelInfo, i18n.language]);

  if (!modelInfo || !data) {
    return <ModelInfoWrapper />;
  }

  return (
    <ModelInfoWrapper>
      <Heading variant="h2">Tiedot</Heading>

      <BasicBlock title="Nimi">
        <MultilingualBlock
          data={data.title
            .map((title) => ({
              lang: title['@language'],
              value: title['@value'],
            }))
            .sort((a, b) => compareLocales(a.lang, b.lang))}
        />
      </BasicBlock>
      <BasicBlock title="Kuvaus">
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
          'Ei lisätty'
        )}
      </BasicBlock>
      <BasicBlock title="Tunnus">{data.prefix}</BasicBlock>
      <BasicBlock title="Tietomallin URI">{data.uri}</BasicBlock>
      <BasicBlock title="Tietoalueet">{data.isPartOf.join(', ')}</BasicBlock>
      <BasicBlock title="Tietomallin kielet">
        {data.languages
          .map((lang) => `${translateLanguage(lang, t)} ${lang.toUpperCase()}`)
          .join(', ')}
      </BasicBlock>

      <BasicBlock title="Käytetyt sanastot">
        {data.terminologies.length > 0
          ? data.terminologies.map((t, idx) => (
              <div key={`model-terminologies-${idx}`}>
                <ExternalLink href={t.url} labelNewWindow="avaa uuden sivun">
                  {t.title}
                </ExternalLink>
                <br />
                {t.description}
              </div>
            ))
          : 'Ei lisätty'}
      </BasicBlock>
      <BasicBlock title="Käytetyt koodistot">
        {data.referenceData.length > 0
          ? data.referenceData.map((t, idx) => (
              <div key={`model-data-references-${idx}`}>
                <ExternalLink href={t.url} labelNewWindow="avaa uuden sivun">
                  {t.title}
                </ExternalLink>
                <br />
                {t.description}
              </div>
            ))
          : 'Ei lisätty'}
      </BasicBlock>
      <BasicBlock title="Käytetyt tietomallit">
        {data.dataVocabularies.length > 0
          ? getDataVocabularies(modelInfo, i18n.language).map((t, idx) => (
              <div key={`model-data-references-${idx}`}>
                <ExternalLink href={t.url} labelNewWindow="avaa uuden sivun">
                  {t.title}
                </ExternalLink>
              </div>
            ))
          : 'Ei lisätty'}
      </BasicBlock>
      <BasicBlock title="Linkit">
        <ModelInfoListWrapper>
          {data.links.length > 0 ? (
            data.links.map((link, idx) => (
              <div key={`model-link-${idx}`}>
                <ExternalLink href={link.url} labelNewWindow="avaa uuden sivun">
                  {link.title}
                </ExternalLink>
                <br />
                {link.description}
              </div>
            ))
          ) : (
            <div>Ei lisätty</div>
          )}
        </ModelInfoListWrapper>
      </BasicBlock>

      <ExpanderGroup closeAllText="" openAllText="" showToggleAllButton={false}>
        <Expander>
          <ExpanderTitleButton>
            Viittaukset muista komponenteista
          </ExpanderTitleButton>
        </Expander>
      </ExpanderGroup>

      <Separator isLarge />

      <BasicBlock title="Sisällöntuottajat">
        {data.organizations.join(', ')}
      </BasicBlock>

      <BasicBlock title="Palaute">
        <ExternalLink
          href={`mailto:${data.contact}?subject=Yhteydenotto`}
          labelNewWindow=""
        >
          {data.contact}
        </ExternalLink>
      </BasicBlock>

      <BasicBlock title="Luotu">
        <FormattedDate date={data.created} />
      </BasicBlock>
    </ModelInfoWrapper>
  );
}
