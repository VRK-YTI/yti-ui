import { Link, Text } from "suomifi-ui-components";
import { useTranslation } from "react-i18next";
import { UserInfoWrapper } from "./authentication-panel.styles";
import { Breakpoint } from "../media-query";
import { useSelector } from "react-redux";
import { selectLogin } from "@app/common/components/login/login.slice";

export interface UserInfoProps {
  breakpoint: Breakpoint;
}

export default function UserInfo({ breakpoint }: UserInfoProps) {
  const { t, i18n } = useTranslation("common");
  const user = useSelector(selectLogin());

  if (!(user?.anonymous ?? true)) {
    return (
      <UserInfoWrapper $breakpoint={breakpoint}>
        <Text>{`${user?.firstName} ${user?.lastName}`}</Text>
        <Link href={`/api/auth/logout?target=/${i18n.language}`}>
          {t("site-logout")}
        </Link>
      </UserInfoWrapper>
    );
  }

  return null;
}
