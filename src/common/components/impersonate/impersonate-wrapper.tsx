import React from 'react';
import { useTranslation } from 'react-i18next';
import HoverDropdown from '../hover-dropdown/hover-dropdown';
import useFakeableUsers from './use-fakeable-users';

export interface ImpersonateWrapperProps {
  onChange: (email: string) => void;
  children: React.ReactNode;
  disable?: boolean;
}

export default function ImpersonateWrapper({ children, onChange, disable = false }: ImpersonateWrapperProps) {
  const users = useFakeableUsers();
  const { t } = useTranslation();

  if (disable || ! users?.length) {
    return <>{children}</>;
  }

  return (
    <HoverDropdown
      items={[
        { key: 'impersonate-user', label: t('impersonate-user') },
        ...(users?.map(({ id, email, displayName }) => ({ key: id, value: email, label: displayName })) ?? []),
      ]}
      onChange={onChange}
    >
      {children}
    </HoverDropdown>
  );
}
