import React from 'react';
import User from '../../interfaces/user-interface';
import DesktopImpersonateWrapper from '../impersonate/desktop-impersonate-wrapper';
import { DesktopAuthenticationPanelWrapper } from './authentication-panel.styles';
import LoginButtons from './login-buttons';
import UserInfo from './user-info';

export interface DesktopAuthenticationPanelProps {
  user?: User;
}

export default function DesktopAuthenticationPanel({ user }: DesktopAuthenticationPanelProps) {
  return (
    <DesktopAuthenticationPanelWrapper>
      <DesktopImpersonateWrapper>
        <UserInfo user={user} breakpoint="large" />
        <LoginButtons user={user} />
      </DesktopImpersonateWrapper>
    </DesktopAuthenticationPanelWrapper>
  );
}
