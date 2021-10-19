import { useTranslation } from "react-i18next";
import { Heading, Link, Text } from "suomifi-ui-components";
import { FooterContentWrapper, FooterLinkWrapper } from "./footer.style";

export default function Footer() {
  const { t } = useTranslation('common');
  return (
    <>
        <Heading variant="h3">Suomi.fi</Heading>

        <FooterContentWrapper>
            <Text>{t("terminology-footer-text")}</Text>
        </FooterContentWrapper>

        <FooterLinkWrapper>
            <Link.external href="/" labelNewWindow={t("site-open-link-new-window")}>{t("terminology-footer-feedback")}</Link.external>
            <Link.external href="/" labelNewWindow={t("site-open-link-new-window")}>{t("terminology-footer-information-security")}</Link.external>
            <Link.external href="/" labelNewWindow={t("site-open-link-new-window")}>{t("terminology-footer-accessibility")}</Link.external>
        </FooterLinkWrapper>
        
    </>

  );
}