import React from 'react';
import { useTranslation } from 'next-i18next';
import HoverDropdown from '../hover-dropdown/hover-dropdown';
import { FakeableUser } from 'interfaces/fakeable-user.interface';

export interface DesktopImpersonateWrapperProps {
  children: React.ReactNode;
  fakeableUsers?: FakeableUser[];
}

export default function DesktopImpersonateWrapper({
  children,
  fakeableUsers,
}: DesktopImpersonateWrapperProps) {
  const { t } = useTranslation();

  if (!fakeableUsers || !fakeableUsers?.length) {
    return <>{children}</>;
  }

  return (
    <HoverDropdown
      items={[
        { key: 'impersonate-user', label: t('impersonate-user') },
        ...(fakeableUsers?.map(({ id, email, displayName, impersonate }) => ({
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
