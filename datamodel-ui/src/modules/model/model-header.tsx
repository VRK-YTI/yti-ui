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
import { useSelector } from 'react-redux';
import {
  selectDisplayLang,
  setDisplayLang,
} from '@app/common/components/model/model.slice';
import { useStoreDispatch } from '@app/store';
import { compareLocales } from '@app/common/utils/compare-locals';
import { useRouter } from 'next/router';

export default function ModelHeader({ modelInfo }: { modelInfo?: ModelType }) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const displayLang = useSelector(selectDisplayLang());
  const dispatch = useStoreDispatch();
  const router = useRouter();

  const model = useMemo(
    () => ({
      title: getTitle(modelInfo, displayLang ?? i18n.language),
      status: getStatus(modelInfo),
      languages: modelInfo
        ? [...modelInfo.languages].sort((a, b) => compareLocales(a, b))
        : [],
    }),
    [modelInfo, i18n.language, displayLang]
  );

  const handleDisplayLangChange = (lang: string) => {
    dispatch(setDisplayLang(lang));
    router.replace({
      pathname: router.asPath.split('?lang')[0],
      query: { lang: lang },
    });
  };

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
            value={displayLang}
            onChange={(e) => handleDisplayLangChange(e)}
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
