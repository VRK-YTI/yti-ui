import { MainTitle, BadgeBar, Badge } from 'yti-common-ui/title-block';
import { TitleWrapper } from './model.styles';
import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import { Button, Icon } from 'suomifi-ui-components';
import {
  getBaseModelPrefix,
  getStatus,
  getTitle,
  getType,
} from '@app/common/utils/get-value';
import {
  translateModelType,
  translateStatus,
} from '@app/common/utils/translation-helpers';
import {
  MoveButton,
  ToolsButtonGroup,
} from 'yti-common-ui/drawer/side-navigation.styles';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { Model } from '@app/common/interfaces/model.interface';

export default function ModelHeader({ modelInfo }: { modelInfo?: Model }) {
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
          overflow: 'visible  ',
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
            <Icon icon="applicationProfile" color="hsl(212, 63%, 49%)" />{' '}
            {translateModelType(getType(modelInfo), t)}
          </div>
          <span>{getBaseModelPrefix(modelInfo)}</span>
          <Badge $isValid={model.status === 'VALID'}>
            {translateStatus(model.status, t)}
          </Badge>
        </BadgeBar>
      </div>

      {isLarge && (
        <div className="tools">
          <>
            <ToolsButtonGroup $isSmall={isSmall}>
              <>
                <Button icon="plus" />
                <Button icon="minus" />
                <MoveButton>
                  <Icon icon="arrowUp" id="up" />
                  <Icon icon="arrowRight" id="right" />
                  <Icon icon="arrowDown" id="down" />
                  <Icon icon="arrowLeft" id="left" />
                </MoveButton>
                <Button icon="swapRounded" />
                <Button icon="mapMyLocation" />
                <Button icon="download" />
                <Button icon="save" />
                <Button icon="menu" variant="secondary" />
              </>
            </ToolsButtonGroup>
          </>
        </div>
      )}
    </TitleWrapper>
  );
}
