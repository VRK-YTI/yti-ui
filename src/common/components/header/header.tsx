import { Grid } from "@material-ui/core";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Icon, LanguageMenu, LanguageMenuItem, Link, SearchInput } from "suomifi-ui-components";
import AuthenticationPanel from "../authentication-panel/authentication-panel";
import { LayoutProps } from "../layout/layout-props";
import HamburgerMenu from "../menu/hamburger-menu";
import { HeaderWrapper, SiteLogo } from "./header.styles";

export default function Header( { props }: { props: LayoutProps } ) {
  const { t } = useTranslation('common');
  const isLarge = props.isLarge;
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
                {isLarge ? (
                  <img src="logo-suomi.fi.png" />
                ) : (
                  <img height="40" width="40" src="logo.png" />
                )
                }
              </Link>
            </SiteLogo>
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3}>
            {isLarge ? (
              <SearchInput
                fullWidth
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
            <AuthenticationPanel props={props} />
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
            <HamburgerMenu props={props} />
          </Grid>
        </Grid>
      </HeaderWrapper>
    </>

  );
}