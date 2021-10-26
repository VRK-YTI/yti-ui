import { Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Icon, LanguageMenu, LanguageMenuItem, Link, SearchInput } from 'suomifi-ui-components';
import AuthenticationPanel from '../authentication-panel/authentication-panel';
import { LayoutProps } from '../layout/layout-props';
import HamburgerMenu from '../menu/hamburger-menu';
import { HeaderWrapper, LanguageMenuWrapper, SearchWrapper, SiteLogo } from './header.styles';

export default function Header({ props }: { props: LayoutProps }) {
  const { t } = useTranslation('common');
  const isLarge = props.isLarge;
  const router = useRouter();

  const languageMenuItems = {
    fi: 'Suomeksi (FI)',
    sv: 'På svenska (SV)',
    en: 'In English (EN)'
  } as { [key: string]: string };

  const currentLocale = router.locale?.toLowerCase() || 'fi';
  return (
    <>
      <HeaderWrapper>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6} md={3} lg={3}>
            <SiteLogo>
              <Link href="/">
                {isLarge ? (
                  <Image src="/logo-suomi.fi.png" width="254" height="70" alt="Logo" />
                ) : (
                  <Image height="40" width="40" src="/logo.png"  alt="Logo" />
                )
                }
              </Link>
            </SiteLogo>
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3}>
            <SearchWrapper isLarge={isLarge}>
              {isLarge ? (
                <SearchInput
                  clearButtonLabel=""
                  labelText=""
                  searchButtonLabel={t('terminology-search')}
                  visualPlaceholder={t('terminology-search-placeholder')}
                />
              ) : (
                <div><Icon icon="search" /></div>
              )}
            </SearchWrapper>
          </Grid>

          <Grid item md={3} lg={3} hidden={!isLarge}>
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
          <Grid item md={3} lg={3} hidden={!isLarge}>
            <AuthenticationPanel props={props} />
          </Grid>
          <Grid item xs={3} sm={3} hidden={isLarge}>
            <HamburgerMenu props={props} />
          </Grid>
        </Grid>
      </HeaderWrapper>
    </>

  );
}
