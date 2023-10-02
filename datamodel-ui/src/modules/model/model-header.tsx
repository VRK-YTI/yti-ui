import { MainTitle, BadgeBar } from 'yti-common-ui/title-block';
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
import { Status } from 'yti-common-ui/search-results/result-card.styles';

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slug, ...query } = router.query;
    router.replace({
      pathname: router.asPath.split('?')[0],
      query: { ...query, lang: lang },
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
        <BadgeBar larger={true} smBottom={true}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {modelInfo?.type === 'PROFILE' ? (
              <IconApplicationProfile color="hsl(212, 63%, 49%)" />
            ) : (
              <IconGrid color="hsl(212, 63%, 49%)" />
            )}{' '}
            {translateModelType(getType(modelInfo), t)}
          </div>
          {modelInfo?.version && <span>{modelInfo?.version}</span>}
          <span>{modelInfo?.prefix}</span>
          <Status status={model.status}>
            {translateStatus(getStatus(modelInfo), t)}
          </Status>
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
