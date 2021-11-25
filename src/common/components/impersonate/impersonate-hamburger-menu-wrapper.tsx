import { Divider, MenuItem } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useFakeableUsers from './use-fakeable-users';

export interface ImpersonateHamburgerMenuWrapperProps {
  onChange: (email: string) => void;
}

export default function ImpersonateHamburgerMenuWrapper({ onChange }: ImpersonateHamburgerMenuWrapperProps) {
  const users = useFakeableUsers();
  const { t } = useTranslation();

  if (! users?.length) {
    return null;
  }

  return (
    <>
      <Divider />
      <MenuItem disabled>{t('impersonate-user')}</MenuItem>
      {users?.map(({ id, email, displayName }) => (
        <MenuItem key={id} onClick={() => onChange(email)}>{displayName}</MenuItem>
      ))}
    </>
  );
}
