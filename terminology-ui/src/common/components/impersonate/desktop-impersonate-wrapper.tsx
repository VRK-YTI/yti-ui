import React from 'react';
import { useTranslation } from 'react-i18next';
import HoverDropdown from '@app/common/components/hover-dropdown';
import useFakeableUsers from './use-fakeable-users';

export interface DesktopImpersonateWrapperProps {
  children: React.ReactNode;
}

export default function DesktopImpersonateWrapper({
  children,
}: DesktopImpersonateWrapperProps) {
  const users = useFakeableUsers();
  const { t } = useTranslation();

  if (!users?.length) {
    return <>{children}</>;
  }

  return (
    <HoverDropdown
      items={[
        { key: 'impersonate-user', label: t('impersonate-user') },
        ...(users?.map(({ id, email, displayName, impersonate }) => ({
          key: id,
          value: email,
          label: displayName,
          onClick: impersonate,
        })) ?? []),
      ]}
    >
      {children}
    </HoverDropdown>
  );
}
