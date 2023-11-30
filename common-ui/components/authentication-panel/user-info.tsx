import { Link, Text } from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import { UserInfoWrapper } from './authentication-panel.styles';
import { Breakpoint } from '../media-query';
import { User } from '../../interfaces/user.interface';

export interface UserInfoProps {
  breakpoint: Breakpoint;
  user?: User;
}

export default function UserInfo({ breakpoint, user }: UserInfoProps) {
  const { t } = useTranslation('common');

  if (!user || user.anonymous) {
    return null;
  }

  return (
    <UserInfoWrapper $breakpoint={breakpoint} id="login-information">
      <Text>{`${user?.firstName} ${user?.lastName}`}</Text>
      <Link href={'/api/auth/logout?target=/'}>{t('site-logout')}</Link>
    </UserInfoWrapper>
  );
}
