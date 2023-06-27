import {
  setView,
  useGetModelQuery,
} from '@app/common/components/model/model.slice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Expander,
  ExpanderGroup,
  ExpanderTitleButton,
  ExternalLink,
  Text,
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
import { ModelInfoListWrapper, TooltipWrapper } from './model.styles';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import { compareLocales } from '@app/common/utils/compare-locals';
import Separator from 'yti-common-ui/separator';
import FormattedDate from 'yti-common-ui/formatted-date';
import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import ModelEditView from './model-edit-view';
import AsFileModal from '../as-file-modal';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import HasPermission from '@app/common/utils/has-permission';
import DeleteModal from '../delete-modal';
import { useStoreDispatch } from '@app/store';
import { getModelId } from '@app/common/utils/parse-slug';

export default function ModelInfoView() {
  const { t, i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const { query } = useRouter();
  const [modelId] = useState(getModelId(query.slug) ?? '');
  const [showTooltip, setShowTooltip] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [formData, setFormData] = useState<ModelFormType | undefined>();
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasPermission = HasPermission({ actions: ['ADMIN_DATA_MODEL'] });
  const { data: modelInfo, refetch } = useGetModelQuery(modelId);

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
      organizations: getOrganizations(modelInfo, i18n.language),
      contact: getContact(modelInfo),
      created: getCreated(modelInfo),
    };
  }, [modelInfo, i18n.language]);

  useEffect(() => {
    if (modelInfo) {
      setFormData({
        contact: '',
        languages:
          modelInfo.languages.map((lang) => ({
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
        organizations: getOrganizationsWithId(modelInfo, i18n.language) ?? [],
        prefix: modelInfo?.prefix ?? '',
        serviceCategories: getIsPartOfWithId(modelInfo, i18n.language) ?? [],
        status: modelInfo?.status ?? 'DRAFT',
        type: modelInfo?.type ?? 'PROFILE',
        terminologies: modelInfo.terminologies ?? [],
      });
    }
  }, [modelInfo, t, i18n.language]);

  const handleSuccess = () => {
    refetch();
    setShowEditView(false);
  };

  const handleEditViewItemClick = (setItem: (value: boolean) => void) => {
    setItem(true);
    dispatch(setView('info', 'edit'));
    setShowTooltip(false);
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  if (!modelInfo || !data) {
    return <DrawerContent />;
  }

  if (showEditView && formData) {
    return (
      <ModelEditView
        model={modelInfo}
        setShow={setShowEditView}
        handleSuccess={handleSuccess}
      />
    );
  }

  return (
    <>
      <StaticHeader ref={ref}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text variant="bold">{t('details')}</Text>
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
                {hasPermission && (
                  <Button
                    variant="secondaryNoBorder"
                    onClick={() => handleEditViewItemClick(setShowEditView)}
                    disabled={!formData}
                  >
                    {t('edit', { ns: 'admin' })}
                  </Button>
                )}
                <AsFileModal type="show" modelId={modelId} />
                <AsFileModal
                  type="download"
                  modelId={modelId}
                  filename={getLanguageVersion({
                    data: modelInfo.label,
                    lang: i18n.language,
                  })}
                />
                {hasPermission && (
                  <>
                    <Button variant="secondaryNoBorder">
                      {t('update-models-resources-statuses', { ns: 'admin' })}
                    </Button>
                    <Button variant="secondaryNoBorder">
                      {t('create-copy-from-model', { ns: 'admin' })}
                    </Button>
                    <Button variant="secondaryNoBorder">
                      {t('add-email-subscription')}
                    </Button>
                    <Separator />
                    <DeleteModal
                      modelId={modelId}
                      label={getLanguageVersion({
                        data: modelInfo.label,
                        lang: i18n.language,
                      })}
                      type="model"
                    />
                  </>
                )}
              </Tooltip>
            </TooltipWrapper>
          </div>
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight}>
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
            .map(
              (lang) => `${translateLanguage(lang, t)} ${lang.toUpperCase()}`
            )
            .join(', ')}
        </BasicBlock>

        <BasicBlock title={t('terminologies-used')}>
          {data.terminologies.length > 0 ? (
            <ModelInfoListWrapper>
              {data.terminologies.map((terminology, idx) => (
                <li key={`model-terminologies-${idx}`}>
                  <ExternalLink
                    href={terminology.url}
                    labelNewWindow={`${t('link-opens-new-window-external')} ${
                      terminology.url
                    }`}
                  >
                    {terminology.label}
                  </ExternalLink>
                </li>
              ))}
            </ModelInfoListWrapper>
          ) : (
            t('not-added')
          )}
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
          {data.links.length > 0 ? (
            <ModelInfoListWrapper>
              {data.links.map((link, idx) => (
                <li key={`model-link-${idx}`}>
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
                </li>
              ))}{' '}
            </ModelInfoListWrapper>
          ) : (
            <div>{t('not-added')}</div>
          )}
        </BasicBlock>

        <ExpanderGroup
          closeAllText=""
          openAllText=""
          showToggleAllButton={false}
        >
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
            href={`mailto:${data.contact}?subject=${getLanguageVersion({
              data: data.title.reduce(
                (acc, curr) => ({ ...acc, [curr.lang]: curr.value }),
                {}
              ),
              lang: i18n.language,
            })}`}
            labelNewWindow=""
          >
            {data.contact}
          </ExternalLink>
        </BasicBlock>

        <BasicBlock title={t('created')}>
          <FormattedDate date={data.created} />
        </BasicBlock>
      </DrawerContent>
    </>
  );
}
