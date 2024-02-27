import { Link, Text } from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import { UserInfoWrapper } from './authentication-panel.styles';
import { Breakpoint } from '../media-query';
import { User } from '../../interfaces/user.interface';
import { useRouter } from 'next/router';

export interface UserInfoProps {
  breakpoint: Breakpoint;
  user?: User;
}

export default function UserInfo({ breakpoint, user }: UserInfoProps) {
  const { t, i18n } = useTranslation('common');
  const { asPath } = useRouter();

  if (!user || user.anonymous) {
    return null;
  }

  return (
    <UserInfoWrapper $breakpoint={breakpoint} id="login-information">
      <Text>{`${user?.firstName} ${user?.lastName}`}</Text>
      <Link
        href={`/api/auth/logout?target=/${
          i18n.language ?? 'fi'
        }${encodeURIComponent(asPath)}`}
      >
        {t('site-logout')}
      </Link>
    </UserInfoWrapper>
  );
}
