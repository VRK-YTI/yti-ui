import { Link, Text } from 'suomifi-ui-components';
import { useTranslation } from 'react-i18next';
import { UserInfoWrapper } from './authentication-panel.styles';
import User from '../../interfaces/user-interface';

export interface UserInfoProps {
  user?: User;
  isSmall?: boolean;
}

export default function UserInfo({ user, isSmall = false }: UserInfoProps) {
  const { t } = useTranslation('common');

  if (!(user?.anonymous ?? true)) {
    return (
      <UserInfoWrapper isSmall={isSmall}>
        <Text>
          {`${user?.firstName} ${user?.lastName}`}
        </Text>
        <Link href="/api/auth/logout?target=/">
          {t('site-logout')}
        </Link>
      </UserInfoWrapper>
    );
  }

  return null;
}
