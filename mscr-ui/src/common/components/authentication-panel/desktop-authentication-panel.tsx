import { FakeableUser } from 'yti-common-ui/interfaces/fakeable-user.interface';
import { DesktopAuthenticationPanelWrapper } from 'yti-common-ui/components/authentication-panel/authentication-panel.styles';
import DesktopImpersonateWrapper from 'yti-common-ui/components/impersonate/desktop-impersonate-wrapper';
import React from 'react';
import UserInfo from '@app/common/components/authentication-panel/user-info';
import LoginButtons from '@app/common/components/authentication-panel/login-buttons';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

export default function DesktopAuthenticationPanel({
  user,
  fakeableUsers,
}: {
  user?: MscrUser;
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
