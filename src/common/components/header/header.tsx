import { useState } from 'react';
import { Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Icon, LanguageMenu, LanguageMenuItem, Link, SearchInput } from 'suomifi-ui-components';
import AuthenticationPanel from '../authentication-panel/authentication-panel';
import { LayoutProps } from '../layout/layout-props';
import HamburgerMenu from '../menu/hamburger-menu';
import { HeaderWrapper, LanguageMenuWrapper, SearchWrapper, SiteLogo, SmallSearchText, SmallSearchWrapper } from './header.styles';
import { useStoreDispatch } from '../../../store';
import { useSelector } from 'react-redux';
import { selectFilter, setFilter } from '../terminology-search/states/terminology-search-slice';

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
        <HeaderWrapper>
          <Grid container spacing={3}>
            <Grid item xs={8} sm={8} md={3} lg={3}>
              <SiteLogo>
                <Link href="/">
                  <Image src={isSmall ? '/logo-small.svg' : '/logo.svg'} width="300" height="43" alt="Logo" />
                </Link>
              </SiteLogo>
            </Grid>
            <Grid item xs={2} sm={2} md={3} lg={3}>
              <SearchWrapper isSmall={isSmall}>
                {!isSmall ? (
                  <SearchInput
                    clearButtonLabel=""
                    labelText=""
                    defaultValue={filter}
                    searchButtonLabel={t('terminology-search')}
                    visualPlaceholder={t('terminology-search-placeholder')}
                    wrapperProps={{ style: { minWidth: '10px', maxWidth: '400px', width: '65vw' } }}
                    onSearch={value => {
                      if (typeof value === 'string') dispatch(setFilter(value));
                    }}
                    onChange={value => {
                      if (value === '') dispatch(setFilter(value));
                    }}
                  />
                ) : (
                  <div onClick={() => setSmallSearch(true)}><Icon icon="search" /></div>
                )}
              </SearchWrapper>
            </Grid>

            <Grid item md={3} lg={3} hidden={isSmall}>
              <LanguageMenuWrapper>
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
              </LanguageMenuWrapper>
            </Grid>
            <Grid item md={3} lg={3} hidden={isSmall}>
              <AuthenticationPanel props={props} />
            </Grid>
            <Grid item xs={2} sm={2} hidden={!isSmall}>
              <HamburgerMenu props={props} />
            </Grid>
          </Grid>
        </HeaderWrapper>
        :
        <HeaderWrapper>
          <SmallSearchWrapper>
            <SearchInput
              clearButtonLabel=""
              labelText=""
              defaultValue={filter}
              searchButtonLabel={t('terminology-search')}
              visualPlaceholder={t('terminology-search-placeholder')}
              wrapperProps={{ style: { minWidth: '10px', maxWidth: '400px', width: '65vw' } }}
              onSearch={value => {
                if (typeof value === 'string') dispatch(setFilter(value));
              }}
              onChange={value => {
                if (value === '') dispatch(setFilter(value));
              }}
            />
            <SmallSearchText
              onClick={() => setSmallSearch(false)}
            >
              {t('close')}
            </SmallSearchText>
          </SmallSearchWrapper>
        </HeaderWrapper>
      }
    </>

  );
}
