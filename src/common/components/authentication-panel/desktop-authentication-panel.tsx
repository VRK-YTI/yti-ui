import React from 'react';
import User from '../../interfaces/user-interface';
import LoginButtons from './login-buttons';
import UserInfo from './user-info';

export interface DesktopAuthenticationPanelProps {
  user?: User;
}

export default function DesktopAuthenticationPanel({ user }: DesktopAuthenticationPanelProps) {
  return (
    <>
      <UserInfo user={user} />
      <LoginButtons user={user} />
    </>
  );
}
