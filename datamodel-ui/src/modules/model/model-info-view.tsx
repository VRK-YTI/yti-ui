import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import {
  Button,
  Expander,
  ExpanderGroup,
  ExpanderTitleButton,
  ExternalLink,
  Heading,
  Tooltip,
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
import {
  ModelInfoListWrapper,
  ModelInfoWrapper,
  TooltipWrapper,
} from './model.styles';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import { compareLocales } from '@app/common/utils/compare-locals';
import Separator from 'yti-common-ui/separator';
import FormattedDate from 'yti-common-ui/formatted-date';
import ModelForm from '../model-form';

export default function ModelInfoView() {
  const { t, i18n } = useTranslation('common');
  const { query } = useRouter();
  const [modelId] = useState(
    Array.isArray(query.modelId) ? query.modelId[0] : query.modelId ?? ''
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
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

  if (showEditView) {
    return (
      <ModelInfoWrapper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <Heading variant="h2">{t('details')}</Heading>
          <div>
            <Button>Tallenna</Button>
            <Button
              variant="secondary"
              style={{ marginLeft: '10px' }}
              onClick={() => setShowEditView(false)}
            >
              Peruuta
            </Button>
          </div>
        </div>

        <ModelForm
          formData={{
            contact: 'yhteystieto@mail.com',
            languages: [
              {
                labelText: t('language-finnish-with-suffix', { ns: 'admin' }),
                uniqueItemId: 'fi',
                title: 'Tietomalli',
                description: 'Tietomallin kuvaus',
                selected: true,
              },
            ],
            organizations: [],
            prefix: 'demo123',
            serviceCategories: [],
            type: 'profile',
          }}
          setFormData={() => null}
          userPosted={false}
          editMode={true}
        />
      </ModelInfoWrapper>
    );
  }

  return (
    <ModelInfoWrapper>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Heading variant="h2">{t('details')}</Heading>
        <div>
          <Button
            variant="secondary"
            onClick={() => setShowTooltip(!showTooltip)}
            iconRight={'menu'}
          >
            Toiminnot
          </Button>
          <TooltipWrapper>
            <Tooltip
              ariaCloseButtonLabelText=""
              ariaToggleButtonLabelText=""
              open={showTooltip}
              onCloseButtonClick={() => setShowTooltip(false)}
            >
              <Button
                variant="secondaryNoBorder"
                onClick={() => setShowEditView(true)}
              >
                Muokkaa
              </Button>
              <Button variant="secondaryNoBorder">Näytä tiedostona</Button>
              <Button variant="secondaryNoBorder">Lataan tiedostona</Button>
              <Button variant="secondaryNoBorder">
                Muuta tietomallin resurssin tiloja
              </Button>
              <Button variant="secondaryNoBorder">
                Luo kopio tietomallista
              </Button>
              <Button variant="secondaryNoBorder">
                Tilaa sähköposti-ilmoitukset
              </Button>
              <hr />
              <Button variant="secondaryNoBorder">Poista</Button>
            </Tooltip>
          </TooltipWrapper>
        </div>
      </div>

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
