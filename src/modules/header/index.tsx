import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Icon, LanguageMenu, LanguageMenuItem, Link, SearchInput } from 'suomifi-ui-components';
import AuthenticationPanel from '../../common/components/authentication-panel/desktop-authentication-panel';
import { LayoutProps } from '../../layouts/layout-props';
import HamburgerMenu from '../../common/components/menu/hamburger-menu';
import {
  AuthenticationPanelWrapper,
  HeaderWrapper,
  SearchAndLanguageWrapper,
  SearchWrapper,
  SiteLogo,
  SmallSearchButton,
  SearchIconButton,
} from './header.styles';
import { useStoreDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { selectFilter, setFilter } from '../../common/components/terminology-search/terminology-search-slice';

export default function Header({ props }: { props: LayoutProps }) {
  const { t } = useTranslation('common');
  const isSmall = props.isSmall;
  const router = useRouter();
  const [smallSearch, setSmallSearch] = useState<boolean>(false);

  const dispatch = useStoreDispatch();
  const filter = useSelector(selectFilter());

  const languageMenuItems = {
    fi: 'Suomeksi (FI)',
    sv: 'På svenska (SV)',
    en: 'In English (EN)'
  } as { [key: string]: string };

  const currentLocale = router.locale?.toLowerCase() || 'fi';
  return (
    <>
      {!smallSearch ?
        <HeaderWrapper isSmall={isSmall}>
          <SiteLogo isSmall={isSmall}>
            <Link href="/">
              <Image src={isSmall ? '/logo-small.svg' : '/logo.svg'} width="300" height="43" alt="Logo" />
            </Link>
          </SiteLogo>
          <SearchAndLanguageWrapper>
            <SearchWrapper isSmall={isSmall}>
              {!isSmall ? (
                <SearchInput
                  clearButtonLabel=""
                  labelText=""
                  defaultValue={filter}
                  labelMode="hidden"
                  searchButtonLabel={t('terminology-search')}
                  visualPlaceholder={t('terminology-search-placeholder')}
                  // wrapperProps={{ style: { minWidth: '10px', maxWidth: '400px', width: '65vw' } }}
                  onSearch={value => {
                    if (typeof value === 'string') dispatch(setFilter(value));
                  }}
                  onChange={value => {
                    if (value === '') dispatch(setFilter(value));
                  }}
                />
              ) : (
                <SearchIconButton onClick={() => setSmallSearch(true)}><Icon icon="search" /></SearchIconButton>
              )}
            </SearchWrapper>
            {!isSmall ? (
              <LanguageMenu name={languageMenuItems[currentLocale]}>
                <LanguageMenuItem
                  onSelect={() => {
                    router.push(router.asPath, router.asPath, {
                      locale: 'fi',
                    });
                  }}
                  selected={currentLocale === 'fi'}
                >
                  {languageMenuItems['fi']}
                </LanguageMenuItem>
                <LanguageMenuItem
                  onSelect={() => {
                    router.push(router.asPath, router.asPath, {
                      locale: 'sv',
                    });
                  }}
                  selected={currentLocale === 'sv'}
                >
                  {languageMenuItems['sv']}
                </LanguageMenuItem>
                <LanguageMenuItem
                  onSelect={() => {
                    router.push(router.asPath, router.asPath, {
                      locale: 'en',
                    });
                  }}
                  selected={currentLocale === 'en'}
                >
                  {languageMenuItems['en']}
                </LanguageMenuItem>
              </LanguageMenu>
            ) : null}
          </SearchAndLanguageWrapper>
          {!isSmall ? (
            <AuthenticationPanelWrapper>
              <AuthenticationPanel props={props} />
            </AuthenticationPanelWrapper>
          ) : null}
          {isSmall ? <HamburgerMenu props={props} /> : null}
        </HeaderWrapper>
        :
        <HeaderWrapper isSmall={isSmall}>
          <SearchInput
            clearButtonLabel=""
            labelText=""
            labelMode="hidden"
            defaultValue={filter}
            searchButtonLabel={t('terminology-search')}
            visualPlaceholder={t('terminology-search-placeholder')}
            wrapperProps={{ style: { 'flexGrow': 1 } }}
            onSearch={value => {
              if (typeof value === 'string') dispatch(setFilter(value));
            }}
            onChange={value => {
              if (value === '') dispatch(setFilter(value));
            }}
          />
          <SmallSearchButton onClick={() => setSmallSearch(false)} variant="secondaryNoBorder">
            {t('close')}
          </SmallSearchButton>
        </HeaderWrapper>
      }
    </>

  );
}
