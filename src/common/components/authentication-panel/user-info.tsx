import { Link, Text } from 'suomifi-ui-components';
import { useTranslation } from 'react-i18next';
import { UserInfoWrapper } from './authentication-panel.styles';
import User from '../../interfaces/user-interface';
import { Breakpoint } from '../media-query/media-query-context';

export interface UserInfoProps {
  user?: User;
  breakpoint: Breakpoint;
}

export default function UserInfo({ user, breakpoint }: UserInfoProps) {
  const { t } = useTranslation('common');

  if (!(user?.anonymous ?? true)) {
    return (
      <UserInfoWrapper breakpoint={breakpoint}>
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
