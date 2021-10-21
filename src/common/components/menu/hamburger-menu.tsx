import { Divider, IconButton, Menu, MenuItem } from "@material-ui/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Icon, Text } from "suomifi-ui-components";
import useUser from "../../hooks/useUser";
import AuthenticationPanel from "../authentication-panel/authentication-panel";
import { LayoutProps } from "../layout/layout-props";
import { ButtonWrapper } from "./hamburger-menu-styles";

export default function HamburgerMenu({ props }: { props: LayoutProps }) {
  const { t } = useTranslation('common');
  const { user } = useUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Icon icon="menu" />
      </IconButton>
      <Menu id="long-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem>
          <ButtonWrapper>
            <AuthenticationPanel props={props} />
            {/* user && !user.anonymous ? (
              <>
                <Text>{`${user.firstName} ${user.lastName}`}</Text>
                <Button icon="logout">{t("site-logout")}</Button>
              </>
              ) : (
                <Button icon="login">{t("site-login")}</Button>
              )
              */}
          </ButtonWrapper>
        </MenuItem>
        <Divider />
        <MenuItem>
          {t("site-frontpage")}
        </MenuItem>
        <MenuItem>
          {t("site-services")}
        </MenuItem>
        <MenuItem>
          {t("site-information")}
        </MenuItem>
        <MenuItem>
          {t("site-for-developers")}
        </MenuItem>
        <MenuItem>
          {t("site-for-administrators")}
        </MenuItem>
        <Divider />
        <MenuItem>
          Suomeksi (FI)
        </MenuItem>
        <MenuItem>
          På svenska (SV)
        </MenuItem>
        <MenuItem>
          In English (EN)
        </MenuItem>
      </Menu>
    </>
  );
}