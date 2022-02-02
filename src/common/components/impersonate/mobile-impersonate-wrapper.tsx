import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Text } from 'suomifi-ui-components';
import { MobileMenuImpersonateItem, MobileMenuImpersonateSection } from './impersonate.styles';
import useFakeableUsers from './use-fakeable-users';

/**
 * Error handling:
 * - should impersonating let the user stay
 *   in the same page instead of redirecting
 *   to index?
 *
 */

export default function MobileImpersonateWrapper() {
  const users = useFakeableUsers();
  const { t } = useTranslation();

  if (!users?.length) {
    return null;
  }

  return (
    <MobileMenuImpersonateSection>
      <MobileMenuImpersonateItem>
        <Text>{t('impersonate-user')}</Text>
      </MobileMenuImpersonateItem>
      {users.map(({ id, displayName, impersonate }) => (
        <MobileMenuImpersonateItem key={id} inset>
          <Link href="#" onClick={impersonate}>{displayName}</Link>
        </MobileMenuImpersonateItem>
      ))}
    </MobileMenuImpersonateSection>
  );
}
