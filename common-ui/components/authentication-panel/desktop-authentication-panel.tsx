import { FakeableUser } from '../../interfaces/fakeable-user.interface';
import React from 'react';
import DesktopImpersonateWrapper from '../impersonate/desktop-impersonate-wrapper';
import { DesktopAuthenticationPanelWrapper } from './authentication-panel.styles';
import LoginButtons from './login-buttons';
import UserInfo from './user-info';
import { User } from '../../interfaces/user.interface';

export default function DesktopAuthenticationPanel({
  user,
  fakeableUsers,
}: {
  user?: User;
  fakeableUsers?: FakeableUser[];
}) {
  return (
    <DesktopAuthenticationPanelWrapper id="top-header-authentication">
      <DesktopImpersonateWrapper fakeableUsers={fakeableUsers}>
        <UserInfo breakpoint="large" user={user} />
        <LoginButtons user={user} />
      </DesktopImpersonateWrapper>
    </DesktopAuthenticationPanelWrapper>
  );
}
