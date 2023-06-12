import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  ExternalLink,
  IconMenu,
  Text,
  Tooltip,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import {
  LinkedItem,
  LinkedWrapper,
  LinkExtraInfo,
} from './linked-data-view.styles';
import { TooltipWrapper } from '../model/model.styles';
import LinkedDataForm from '../linked-data-form';
import HasPermission from '@app/common/utils/has-permission';
import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';

export default function LinkedDataView({
  modelId,
  isApplicationProfile,
}: {
  modelId: string;
  isApplicationProfile: boolean;
}) {
  const { t, i18n } = useTranslation('common');
  const ref = useRef<HTMLDivElement>(null);
  const hasPermission = HasPermission({
    actions: ['ADMIN_DATA_MODEL'],
  });
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [renderForm, setRenderForm] = useState(false);
  const { data, refetch } = useGetModelQuery(modelId);

  const handleShowForm = () => {
    setRenderForm(true);
    setShowTooltip(false);
  };

  const handleFormReturn = () => {
    setRenderForm(false);
    refetch();
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  if (renderForm && data) {
    return (
      <LinkedDataForm
        hasCodelist={isApplicationProfile}
        model={data}
        handleReturn={handleFormReturn}
      />
    );
  }

  return (
    <>
      <StaticHeader ref={ref}>
        <div
          style={{
            display: 'flex',
            alignItems: 'space-between',
          }}
        >
          <Text variant="bold">{t('links')}</Text>

          {hasPermission && (
            <div>
              <Button
                variant="secondary"
                iconRight={<IconMenu />}
                onClick={() => setShowTooltip(!showTooltip)}
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
                    onClick={() => handleShowForm()}
                  >
                    {t('edit', { ns: 'admin' })}
                  </Button>
                </Tooltip>
              </TooltipWrapper>
            </div>
          )}
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight}>
        <BasicBlock title={t('linked-terminologies')}>
          {data && data.terminologies.length > 0 ? (
            <LinkedWrapper>
              {data.terminologies.map((terminology, idx) => {
                const label = getLanguageVersion({
                  data: terminology.label,
                  lang: i18n.language,
                  appendLocale: true,
                });

                return (
                  <LinkedItem key={`linked-terminology-${idx}`}>
                    <ExternalLink
                      labelNewWindow={t('link-opens-new-window-external')}
                      href={terminology.uri}
                    >
                      {label !== '' ? label : terminology.uri}
                    </ExternalLink>
                  </LinkedItem>
                );
              })}
            </LinkedWrapper>
          ) : (
            <>{t('no-linked-terminologies')}</>
          )}
        </BasicBlock>

        {isApplicationProfile ? (
          <BasicBlock title={t('linked-codelists')}>
            {data && data.codeLists.length > 0 ? (
              <LinkedWrapper>
                {data.codeLists.map((codeList, idx) => {
                  const label = getLanguageVersion({
                    data: codeList.prefLabel,
                    lang: i18n.language,
                    appendLocale: true,
                  });

                  return (
                    <LinkedItem key={`linked-codeList-${idx}`}>
                      <ExternalLink
                        labelNewWindow={t('link-opens-new-window-external')}
                        href={codeList.id}
                      >
                        {label !== '' ? label : codeList.id}
                      </ExternalLink>
                    </LinkedItem>
                  );
                })}
              </LinkedWrapper>
            ) : (
              <>{t('no-linked-codelists')}</>
            )}
          </BasicBlock>
        ) : (
          <></>
        )}

        <BasicBlock title={t('linked-datamodels')}>
          {data &&
          (data.internalNamespaces.length > 0 ||
            data.externalNamespaces.length > 0) ? (
            <LinkedWrapper>
              {data.internalNamespaces.map((namespace, idx) => {
                return (
                  <LinkedItem key={`linked-terminology-${idx}`}>
                    <LinkExtraInfo>
                      <ExternalLink
                        labelNewWindow={t('link-opens-new-window-external')}
                        href={namespace}
                      >
                        {namespace}
                      </ExternalLink>
                      <div>Tunnus: {namespace.split('/').pop()}</div>
                      <div>{namespace}</div>
                    </LinkExtraInfo>
                  </LinkedItem>
                );
              })}
              {data.externalNamespaces.map((namespace, idx) => {
                return (
                  <LinkedItem key={`linked-ext-terminology-${idx}`}>
                    <LinkExtraInfo>
                      <ExternalLink
                        labelNewWindow={t('link-opens-new-window-external')}
                        href={namespace.namespace}
                      >
                        {namespace.name}
                      </ExternalLink>
                      <div>Tunnus: {namespace.prefix}</div>
                      <div>{namespace.namespace}</div>
                    </LinkExtraInfo>
                  </LinkedItem>
                );
              })}
            </LinkedWrapper>
          ) : (
            <>{t('no-linked-datamodels')}</>
          )}
        </BasicBlock>
      </DrawerContent>
    </>
  );
}
