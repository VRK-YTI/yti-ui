import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button, ExternalLink, Text, Tooltip } from 'suomifi-ui-components';
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
                iconRight="menu"
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
          {/* <BasicBlock title="Linkitetyt sanastot"> */}
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
            // <>Ei linkitettyjä sanastoja.</>
          )}
        </BasicBlock>

        {isApplicationProfile ? (
          // TODO: Add codelist visualization
          <BasicBlock title={t('linked-codelists')}>
            {t('no-linked-codelists')}
          </BasicBlock>
        ) : (
          // <BasicBlock title="Koodistot">Ei linkitettyjä koodistoja.</BasicBlock>
          <></>
        )}

        {/* <BasicBlock title="Linkitetyt tietomallit"> */}
        <BasicBlock title={t('linked-datamodels')}>
          {/* TODO: Add datamodel visualization */}
          <>{t('no-linked-datamodels')}</>
          {/* <>Ei linkitettyjä tietomalleja.</> */}
        </BasicBlock>
      </DrawerContent>
    </>
  );
}
