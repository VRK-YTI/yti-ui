import React from "react";
import DesktopImpersonateWrapper from "../impersonate/desktop-impersonate-wrapper";
import { DesktopAuthenticationPanelWrapper } from "./authentication-panel.styles";
import LoginButtons from "./login-buttons";
import UserInfo from "./user-info";

export default function DesktopAuthenticationPanel() {
  return (
    <DesktopAuthenticationPanelWrapper>
      <DesktopImpersonateWrapper>
        <UserInfo breakpoint="large" />
        <LoginButtons />
      </DesktopImpersonateWrapper>
    </DesktopAuthenticationPanelWrapper>
  );
}
