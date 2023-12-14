import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button, ExternalLink, Text } from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import {
  LinkedItem,
  LinkedWrapper,
  LinkExtraInfo,
} from './linked-data-view.styles';
import LinkedDataForm from '../linked-data-form';
import HasPermission from '@app/common/utils/has-permission';
import {
  selectDisplayGraphHasChanges,
  selectDisplayLang,
  selectGraphHasChanges,
  setDisplayGraphHasChanges,
  useGetModelQuery,
} from '@app/common/components/model/model.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { HeaderRow } from '@app/common/components/header';
import { useSelector } from 'react-redux';
import { getEnvParam } from '@app/common/components/uri-info';
import { useStoreDispatch } from '@app/store';
import UnsavedAlertModal from '../unsaved-alert-modal';

export default function LinkedDataView({
  modelId,
  version,
  isApplicationProfile,
  organizationIds,
}: {
  modelId: string;
  version?: string;
  isApplicationProfile: boolean;
  organizationIds?: string[];
}) {
  const { t, i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const displayLang = useSelector(selectDisplayLang());
  const displayGraphHasChanges = useSelector(selectDisplayGraphHasChanges());
  const graphHasChanges = useSelector(selectGraphHasChanges());
  const ref = useRef<HTMLDivElement>(null);
  const hasPermission = HasPermission({
    actions: ['EDIT_DATA_MODEL'],
    targetOrganization: organizationIds,
  });
  const [headerHeight, setHeaderHeight] = useState(hasPermission ? 57 : 42);
  const [renderForm, setRenderForm] = useState(false);
  const { data } = useGetModelQuery({
    modelId: modelId,
    version: version,
  });

  const handleFormReturn = () => {
    setRenderForm(false);
  };

  const handleShowForm = () => {
    if (graphHasChanges) {
      dispatch(setDisplayGraphHasChanges(true));
      return;
    }

    setRenderForm(true);
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
        <HeaderRow>
          <Text variant="bold">{t('links')}</Text>
          {!version && hasPermission && (
            <Button
              variant="secondary"
              onClick={() => handleShowForm()}
              id="edit-linked-data-button"
            >
              {t('edit', { ns: 'admin' })}
            </Button>
          )}
        </HeaderRow>

        <UnsavedAlertModal
          visible={displayGraphHasChanges}
          handleFollowUp={() => setRenderForm(true)}
        />
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
                      href={`${terminology.uri}${getEnvParam(
                        terminology.uri,
                        true
                      )}`}
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
                        href={`${codeList.id}${getEnvParam(codeList.id, true)}`}
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
                        href={`${namespace.namespace}${getEnvParam(
                          namespace.namespace
                        )}`}
                      >
                        {getLanguageVersion({
                          data: namespace.name,
                          lang: displayLang ?? i18n.language,
                          appendLocale: true,
                        })}
                      </ExternalLink>
                      <div>
                        {t('linked-datamodel-prefix', {
                          prefix: namespace.prefix,
                        })}
                      </div>
                      <div>{namespace.namespace}</div>
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
                        {getLanguageVersion({
                          lang: displayLang ?? i18n.language,
                          data: namespace.name,
                          appendLocale: true,
                        })}
                      </ExternalLink>
                      <div>
                        {t('linked-datamodel-prefix', {
                          prefix: namespace.prefix,
                        })}
                      </div>
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
