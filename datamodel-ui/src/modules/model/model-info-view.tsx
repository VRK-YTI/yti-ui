import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
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
  getIsPartOfWithId,
  getLanguages,
  getLink,
  getOrganizations,
  getOrganizationsWithId,
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
import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import ModelEditView from './model-edit-view';
import AsFileModal from '../as-file-modal';

export default function ModelInfoView() {
  const { t, i18n } = useTranslation('common');
  const { query } = useRouter();
  const [modelId] = useState(
    Array.isArray(query.modelId) ? query.modelId[0] : query.modelId ?? ''
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [formData, setFormData] = useState<ModelFormType | undefined>();
  const { data: modelInfo, refetch } = useGetModelQuery(modelId);
  const { data: serviceCategories } = useGetServiceCategoriesQuery(
    i18n.language ?? 'fi'
  );
  const { data: organizations } = useGetOrganizationsQuery(
    i18n.language ?? 'fi'
  );

  const data = useMemo(() => {
    if (!modelInfo) {
      return undefined;
    }

    return {
      title: getTitles(modelInfo),
      description: getComments(modelInfo),
      prefix: getBaseModelPrefix(modelInfo),
      uri: getUri(modelInfo),
      isPartOf: getIsPartOf(modelInfo, serviceCategories, i18n.language),
      languages: getLanguages(modelInfo),
      terminologies: getTerminology(modelInfo, i18n.language),
      referenceData: getReferenceData(modelInfo, i18n.language),
      dataVocabularies: getDataVocabularies(modelInfo, i18n.language),
      links: getLink(modelInfo),
      organizations: getOrganizations(modelInfo, organizations, i18n.language),
      contact: getContact(modelInfo),
      created: getCreated(modelInfo),
    };
  }, [modelInfo, i18n.language, organizations, serviceCategories]);

  useEffect(() => {
    if (modelInfo && serviceCategories && organizations) {
      setFormData({
        contact: '',
        languages:
          modelInfo?.languages.map((lang) => ({
            labelText: translateLanguage(lang, t),
            uniqueItemId: lang,
            title:
              Object.entries(modelInfo.label).find((t) => t[0] === lang)?.[1] ??
              '',
            description:
              Object.entries(modelInfo.description).find(
                (d) => d[0] === lang
              )?.[1] ?? '',
            selected: true,
          })) ?? [],
        organizations:
          getOrganizationsWithId(modelInfo, organizations, i18n.language) ?? [],
        prefix: modelInfo?.prefix ?? '',
        serviceCategories:
          getIsPartOfWithId(modelInfo, serviceCategories, i18n.language) ?? [],
        status: modelInfo?.status ?? 'DRAFT',
        type: modelInfo?.type ?? 'PROFILE',
      });
    }
  }, [modelInfo, serviceCategories, organizations, t, i18n.language]);

  const handleSuccess = () => {
    refetch();
    setShowEditView(false);
  };

  const handleEditViewItemClick = (setItem: (value: boolean) => void) => {
    setItem(true);
    setShowTooltip(false);
  };

  if (!modelInfo || !data) {
    return <ModelInfoWrapper />;
  }

  if (showEditView && formData && organizations && serviceCategories) {
    return (
      <ModelEditView
        model={modelInfo}
        organizations={organizations}
        serviceCategories={serviceCategories}
        setShow={setShowEditView}
        handleSuccess={handleSuccess}
      />
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
            {t('actions')}
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
                onClick={() => handleEditViewItemClick(setShowEditView)}
                disabled={!formData}
              >
                {t('edit', { ns: 'admin' })}
              </Button>
              <AsFileModal type="show" />
              <AsFileModal type="download" />
              <Button variant="secondaryNoBorder">
                {t('update-models-resources-statuses', { ns: 'admin' })}
              </Button>
              <Button variant="secondaryNoBorder">
                {t('create-copy-from-model', { ns: 'admin' })}
              </Button>
              <Button variant="secondaryNoBorder">
                {t('add-email-subscription')}
              </Button>
              <hr />
              <Button variant="secondaryNoBorder">
                {t('remove', { ns: 'admin' })}
              </Button>
            </Tooltip>
          </TooltipWrapper>
        </div>
      </div>

      <BasicBlock title={t('name')}>
        <MultilingualBlock
          data={data.title.sort((a, b) => compareLocales(a.lang, b.lang))}
        />
      </BasicBlock>
      <BasicBlock title={t('description')}>
        {data.description.length > 0 ? (
          <MultilingualBlock
            data={data.description.sort((a, b) =>
              compareLocales(a.lang, b.lang)
            )}
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
