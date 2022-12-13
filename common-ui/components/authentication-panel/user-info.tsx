import { Link, Text } from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import { UserInfoWrapper } from './authentication-panel.styles';
import { Breakpoint } from '../media-query';

export interface UserInfoProps {
  breakpoint: Breakpoint;
  user?: any;
}

export default function UserInfo({ breakpoint, user }: UserInfoProps) {
  const { t, i18n } = useTranslation('common');

  if (!user || user.anonymous) {
    return null;
  }

  return (
    <UserInfoWrapper $breakpoint={breakpoint}>
      <Text>{`${user?.firstName} ${user?.lastName}`}</Text>
      <Link href={`/api/auth/logout?target=/${i18n.language}`}>
        {t('site-logout')}
      </Link>
    </UserInfoWrapper>
  );
}
