import { Grid, useMediaQuery } from "@material-ui/core";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Heading, Icon, LanguageMenu, LanguageMenuItem, Link, SearchInput, Text } from "suomifi-ui-components";
import AuthenticationPanel from "../authentication-panel/authentication-panel";
import { HeaderTitle, HeaderWrapper, SiteLogo } from "./header.styles";

export default function Header() {
  const { t } = useTranslation('common');
  const isLarge = useMediaQuery('(min-width:945px)');
  const router = useRouter();

  const languageMenuItems = {
    fi: "Suomeksi (FI)",
    sv: "På svenska (SV)",
    en: "In English (EN)"
  } as { [key: string]: string };

  const currentLocale = router.locale?.toLowerCase() || "fi";
  return (
    <>
      <HeaderWrapper>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6} md={3} lg={3}>
            <SiteLogo>
              <Link href="/">
                <>
                  <HeaderTitle>{t('site-title')}</HeaderTitle>
                </>
              </Link>
            </SiteLogo>
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3}>
            {isLarge ? (
              <SearchInput
                clearButtonLabel=""
                labelText=""
                searchButtonLabel={t("terminology-search")}
                visualPlaceholder={t("terminology-search-placeholder")}
              />
            ) : (
              <span><Icon icon="search" /></span>
            )}
          </Grid>
          <Grid item md={3} lg={4} hidden={!isLarge}>
            <AuthenticationPanel />
          </Grid>
          <Grid item md={3} lg={2} hidden={!isLarge}>
            <LanguageMenu name={languageMenuItems[currentLocale]}>
              <LanguageMenuItem
                onSelect={() => {
                  router.push(router.asPath, router.asPath, {
                    locale: 'fi',
                  });
                }}
                selected={currentLocale === 'fi'}
              >
                {languageMenuItems["fi"]}
              </LanguageMenuItem>
              <LanguageMenuItem
                onSelect={() => {
                  router.push(router.asPath, router.asPath, {
                    locale: 'sv',
                  });
                }}
                selected={currentLocale === 'sv'}
              >
                {languageMenuItems["sv"]}
              </LanguageMenuItem>
              <LanguageMenuItem
                onSelect={() => {
                  router.push(router.asPath, router.asPath, {
                    locale: 'en',
                  });
                }}
                selected={currentLocale === 'en'}
              >
                {languageMenuItems["en"]}
              </LanguageMenuItem>
            </LanguageMenu>
          </Grid>
          <Grid item xs={3} sm={3} hidden={isLarge}>
            Menu!
          </Grid>
        </Grid>
      </HeaderWrapper>
    </>

  );
}