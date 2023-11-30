import { useTranslation } from 'next-i18next';
import { UserInfoWrapper } from 'yti-common-ui/components/authentication-panel/authentication-panel.styles';
import { Link, Text } from 'suomifi-ui-components';
import { UserInfoProps } from 'yti-common-ui/components/authentication-panel/user-info';

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
