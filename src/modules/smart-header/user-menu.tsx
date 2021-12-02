import React from 'react';
import { Link, Text } from 'suomifi-ui-components';
import User from '../../common/interfaces/user-interface';
import { UserMenuWrapper } from './smart-header.styles';

export interface UserMenuProps {
  user?: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  if (!user?.anonymous) {
    return (
      <UserMenuWrapper>
        <Text>{`${user?.firstName} ${user?.lastName}`}</Text>
        <Link href="/api/auth/logout?target=/">Kirjaudu ulos</Link>
      </UserMenuWrapper>
    );
  }

  return null;
}
