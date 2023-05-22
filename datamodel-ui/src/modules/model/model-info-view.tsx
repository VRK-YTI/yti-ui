import {
  setView,
  useGetModelQuery,
} from '@app/common/components/model/model.slice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Button, ExternalLink, Text, Tooltip } from 'suomifi-ui-components';
import { BasicBlock, MultilingualBlock } from 'yti-common-ui/block';
import {
  getIsPartOfWithId,
  getOrganizationsWithId,
  getUri,
} from '@app/common/utils/get-value';
import { TooltipWrapper } from './model.styles';
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
        externalNamespaces: modelInfo.externalNamespaces ?? [],
        internalNamespaces: modelInfo.internalNamespaces ?? [],
        codeLists: modelInfo.codeLists ?? [],
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

  if (!modelInfo) {
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
            data={Object.entries(modelInfo.label)
              .sort((a, b) => compareLocales(a[0], b[0]))
              .map((l) => ({ lang: l[0], value: l[1] }))}
          />
        </BasicBlock>
        <BasicBlock title={t('description')}>
          {Object.keys(modelInfo.description).length > 0 ? (
            <MultilingualBlock
              data={Object.entries(modelInfo.description)
                .sort((a, b) => compareLocales(a[0], b[0]))
                .map((d) => ({ lang: d[0], value: d[1] }))}
            />
          ) : (
            t('not-added')
          )}
        </BasicBlock>
        <BasicBlock title={t('prefix')}>{modelInfo.prefix}</BasicBlock>
        <BasicBlock title={t('model-uri')}>{getUri(modelInfo)}</BasicBlock>
        <BasicBlock title={t('information-domains')}>
          {modelInfo.groups
            .map((group) =>
              getLanguageVersion({ data: group.label, lang: i18n.language })
            )
            .sort()
            .join(', ')}
        </BasicBlock>
        <BasicBlock title={t('model-languages')}>
          {modelInfo.languages
            .map(
              (lang) => `${translateLanguage(lang, t)} ${lang.toUpperCase()}`
            )
            .join(', ')}
        </BasicBlock>

        <BasicBlock title={t('links-to-additional-information')}>
          {t('not-added')}
        </BasicBlock>

        <BasicBlock title={t('references-from-other-components')}>
          {t('no-references')}
        </BasicBlock>

        <Separator isLarge />

        <BasicBlock title={t('created')}>
          <FormattedDate date={modelInfo.created} />
          {modelInfo.creator && `, ${modelInfo.creator.name}`}
        </BasicBlock>

        <Separator isLarge />

        <BasicBlock title={t('contributors')}>
          {modelInfo.organizations
            .map((org) =>
              getLanguageVersion({ data: org.label, lang: i18n.language })
            )
            .sort()
            .join(', ')}
        </BasicBlock>
        <BasicBlock title={t('feedback')}>
          <ExternalLink
            href={`mailto:${
              modelInfo.contact && modelInfo.contact !== ''
                ? modelInfo.contact
                : 'yhteentoimivuus@dvv.fi'
            }?subject=${getLanguageVersion({
              data: modelInfo.label,
              lang: i18n.language,
            })}`}
            labelNewWindow=""
          >
            {modelInfo.contact ?? 'yhteentoimivuus@dvv.fi'}
          </ExternalLink>
        </BasicBlock>
      </DrawerContent>
    </>
  );
}
