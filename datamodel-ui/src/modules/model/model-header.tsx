import { MainTitle, BadgeBar, Badge } from 'yti-common-ui/title-block';
import { LanguagePickerWrapper, TitleWrapper } from './model.styles';
import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import {
  Dropdown,
  DropdownItem,
  IconApplicationProfile,
  IconGrid,
} from 'suomifi-ui-components';
import { getStatus, getTitle, getType } from '@app/common/utils/get-value';
import {
  translateModelType,
  translateStatus,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { ModelType } from '@app/common/interfaces/model.interface';
import { useBreakpoints } from 'yti-common-ui/media-query';

export default function ModelHeader({ modelInfo }: { modelInfo?: ModelType }) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();

  const model = useMemo(
    () => ({
      title: getTitle(modelInfo, i18n.language),
      status: getStatus(modelInfo),
      languages: modelInfo
        ? [...modelInfo.languages].sort((a, b) => (a > b ? 1 : -1))
        : [],
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

      {!isSmall && (
        <LanguagePickerWrapper>
          <Dropdown
            labelText=""
            defaultValue={
              model.languages.includes(i18n.language)
                ? i18n.language
                : model.languages[0]
            }
          >
            {model.languages.map((lang) => (
              <DropdownItem value={lang} key={lang}>
                {t('content-in-language')} {lang}
              </DropdownItem>
            ))}
          </Dropdown>
        </LanguagePickerWrapper>
      )}
    </TitleWrapper>
  );
}
