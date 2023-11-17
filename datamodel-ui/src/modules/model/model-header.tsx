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
import { StatusChip } from 'yti-common-ui/status-chip';

export default function ModelHeader({ modelInfo }: { modelInfo?: ModelType }) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const displayLang = useSelector(selectDisplayLang());
  const dispatch = useStoreDispatch();
  const router = useRouter();

  const handleDisplayLangChange = (lang: string) => {
    dispatch(setDisplayLang(lang));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slug, ...query } = router.query;
    router.replace({
      pathname: router.asPath.split('?')[0],
      query: { ...query, lang: lang },
    });
  };

  if (!modelInfo) {
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
            {getTitle(modelInfo, displayLang ?? i18n.language)}
          </BreadcrumbLink>
        </Breadcrumb>
        <MainTitle>
          {getTitle(modelInfo, displayLang ?? i18n.language)}
        </MainTitle>
        <BadgeBar larger={true} smBottom={true}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {modelInfo?.type === 'PROFILE' ? (
              <IconApplicationProfile color="hsl(212, 63%, 49%)" />
            ) : (
              <IconGrid color="hsl(212, 63%, 49%)" />
            )}{' '}
            {translateModelType(getType(modelInfo), t)}
          </div>
          <span>{modelInfo?.prefix}</span>
          {modelInfo?.version ? (
            <span style={{ textTransform: 'uppercase' }}>{`${t('version')} ${
              modelInfo.version
            }`}</span>
          ) : (
            <span style={{ textTransform: 'uppercase' }}>
              {t('working-version')}
            </span>
          )}
          <StatusChip status={getStatus(modelInfo)}>
            {translateStatus(getStatus(modelInfo), t)}
          </StatusChip>
        </BadgeBar>
      </div>

      {!isSmall && (
        <LanguagePickerWrapper>
          <Dropdown
            labelText=""
            value={displayLang}
            onChange={(e) => handleDisplayLangChange(e)}
          >
            {[...modelInfo.languages]
              .sort((a, b) => compareLocales(a, b))
              .map((lang) => (
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
