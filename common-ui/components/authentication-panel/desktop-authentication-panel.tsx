import React from 'react';
// import DesktopImpersonateWrapper from "@app/common/components/impersonate/desktop-impersonate-wrapper";
import { DesktopAuthenticationPanelWrapper } from './authentication-panel.styles';
import LoginButtons from './login-buttons';
import UserInfo from './user-info';

export default function DesktopAuthenticationPanel() {
  return (
    <DesktopAuthenticationPanelWrapper id="top-header-authentication">
      {/* <DesktopImpersonateWrapper> */}
      <UserInfo breakpoint="large" />
      <LoginButtons />
      {/* </DesktopImpersonateWrapper> */}
    </DesktopAuthenticationPanelWrapper>
  );
}
