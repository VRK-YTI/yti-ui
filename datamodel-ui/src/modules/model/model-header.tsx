import { MainTitle, BadgeBar, Badge } from 'yti-common-ui/title-block';
import { TitleWrapper } from './model.styles';
import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import {
  Button,
  IconApplicationProfile,
  IconDownload,
  IconFullscreen,
  IconGrid,
  IconMapMyLocation,
  IconMenu,
  IconMinus,
  IconPlus,
  IconSave,
  IconSwapRounded,
} from 'suomifi-ui-components';
import { getStatus, getTitle, getType } from '@app/common/utils/get-value';
import {
  translateModelType,
  translateStatus,
} from '@app/common/utils/translation-helpers';
import { ToolsButtonGroup } from 'yti-common-ui/drawer/drawer.styles';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { ModelType } from '@app/common/interfaces/model.interface';

export default function ModelHeader({ modelInfo }: { modelInfo?: ModelType }) {
  const { isSmall, isLarge } = useBreakpoints();
  const { t, i18n } = useTranslation('common');

  const model = useMemo(
    () => ({
      title: getTitle(modelInfo, i18n.language),
      status: getStatus(modelInfo),
    }),
    [modelInfo, i18n.language]
  );

  if (!model) {
    return <></>;
  }

  return (
    <TitleWrapper $fullScreen={true}>
      <div
        style={{
          flexGrow: '1',
          maxWidth: '100%',
          minWidth: 0,
          whiteSpace: 'nowrap',
          overflow: 'visible',
        }}
      >
        <Breadcrumb baseUrl={t('datamodel-title')}>
          <BreadcrumbLink current={true} url="">
            {model.title}
          </BreadcrumbLink>
        </Breadcrumb>
        <MainTitle>{model.title}</MainTitle>
        <BadgeBar larger={true}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {modelInfo?.type === 'PROFILE' ? (
              <IconApplicationProfile color="hsl(212, 63%, 49%)" />
            ) : (
              <IconGrid color="hsl(212, 63%, 49%)" />
            )}{' '}
            {translateModelType(getType(modelInfo), t)}
          </div>
          <span>{modelInfo?.prefix}</span>
          <Badge $isValid={model.status === 'VALID'}>
            {translateStatus(getStatus(modelInfo), t)}
          </Badge>
        </BadgeBar>
      </div>

      {isLarge && (
        <div className="tools">
          <>
            <ToolsButtonGroup $isSmall={isSmall}>
              <>
                <Button icon={<IconPlus />} />
                <Button icon={<IconMinus />} />
                <Button icon={<IconFullscreen />} />
                <Button icon={<IconSwapRounded />} />
                <Button icon={<IconMapMyLocation />} />
                <Button icon={<IconDownload />} />
                <Button icon={<IconSave />} />
                <Button icon={<IconMenu />} variant="secondary" />
              </>
            </ToolsButtonGroup>
          </>
        </div>
      )}
    </TitleWrapper>
  );
}
