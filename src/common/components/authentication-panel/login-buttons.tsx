import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button } from "suomifi-ui-components";
import LoginModalView from "../login-modal/login-modal";
import { selectLogin } from "../login/login-slice";
import { useBreakpoints } from "../media-query/media-query-context";
import { LoginButtonsWrapper } from "./authentication-panel.styles";

export default function LoginButtons() {
  const { t } = useTranslation("common");
  const [visible, setVisible] = useState(false);
  const { breakpoint } = useBreakpoints();
  const user = useSelector(selectLogin());

  if (user?.anonymous ?? true) {
    return (
      <LoginButtonsWrapper breakpoint={breakpoint}>
        <Button icon="login" onClick={() => setVisible(true)}>
          {t("site-login")}
        </Button>

        {visible ? <LoginModalView setVisible={setVisible} /> : null}
      </LoginButtonsWrapper>
    );
  }

  return null;
}
