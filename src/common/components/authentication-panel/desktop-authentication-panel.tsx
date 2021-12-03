import React from 'react';
import User from '../../interfaces/user-interface';
import DesktopImpersonateWrapper from '../impersonate/desktop-impersonate-wrapper';
import LoginButtons from './login-buttons';
import UserInfo from './user-info';

export interface DesktopAuthenticationPanelProps {
  user?: User;
}

export default function DesktopAuthenticationPanel({ user }: DesktopAuthenticationPanelProps) {
  return (
    <DesktopImpersonateWrapper>
      <UserInfo user={user} />
      <LoginButtons user={user} />
    </DesktopImpersonateWrapper>
  );
}
