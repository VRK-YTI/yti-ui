import { useMediaQuery } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Link } from "suomifi-ui-components";
import { NavigationWrapper } from "./navigation.styles";

export default function Navigation() {

  const { t } = useTranslation("common")
  const isLarge = useMediaQuery('(min-width:945px)');

  return (

      <NavigationWrapper hidden={!isLarge}>
        <li>
          <Link href="/">{t("site-frontpage")}</Link>
        </li>
        <li>
          <Link href="/">{t("site-services")}</Link>
        </li>
        <li>
          <Link href="/">{t("site-information")}</Link>
        </li>
        <li>
          <Link href="/">{t("site-for-developers")}</Link>
        </li>
        <li>
          <Link href="/">{t("site-for-administrators")}</Link>
        </li>
      </NavigationWrapper>
    
  );
}