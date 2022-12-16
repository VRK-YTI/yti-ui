import React from 'react';
import { useTranslation } from 'next-i18next';
import { Link, Text } from 'suomifi-ui-components';
import {
  MobileMenuImpersonateItem,
  MobileMenuImpersonateSection,
} from './impersonate.styles';
import { FakeableUser } from '../../interfaces/fakeable-user.interface';

export default function MobileImpersonateWrapper({
  fakeableUsers,
}: {
  fakeableUsers?: FakeableUser[];
}) {
  const { t } = useTranslation();

  if (!fakeableUsers || fakeableUsers.length < 1) {
    return null;
  }

  return (
    <MobileMenuImpersonateSection>
      <MobileMenuImpersonateItem>
        <Text>{t('impersonate-user')}</Text>
      </MobileMenuImpersonateItem>
      {fakeableUsers.map(({ id, displayName, impersonate }) => (
        <MobileMenuImpersonateItem key={id} $inset>
          <Link href="#" onClick={impersonate}>
            {displayName}
          </Link>
        </MobileMenuImpersonateItem>
      ))}
    </MobileMenuImpersonateSection>
  );
}
