import { useState } from 'react';
import {
  ButtonsDiv,
  UserInfo,
} from './authentication-panel.styles';
import LoginModal from '../login-modal/login-modal';
import User from '../../interfaces/user-interface';
import useUser from '../../hooks/useUser';
import User, { anonymousUser } from '../../interfaces/user-interface';
import { authFakeUser } from '../../utils/user';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Text } from 'suomifi-ui-components';
import { useTranslation } from 'react-i18next';
import { LayoutProps } from '../layout/layout-props';
import LoginModalView from '../login-modal/login-modal';

async function fakeUserLogin(mutateUser: (user: User) => void) {

  const user: User = await authFakeUser();
  if (user != anonymousUser) {
    mutateUser(user);
  } else {
    console.error('fake admin sign in failed');
    //TODO: handle sign in errors?
  }
  return user;
}

export default function AuthenticationPanel({ props, onMenuClose }: { props: LayoutProps, onMenuClose?: Function }) {

  const [visible, setVisible] = useState(false);
  const { user, mutateUser } = useUser();
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <>
      {user && !user.anonymous ? (
        <ButtonsDiv isLarge={props.isLarge}>
          <UserInfo>
            <Text>
              {`${user?.firstName} ${user?.lastName}`}
            </Text>
          </UserInfo>
          <Button icon="logout" variant="secondaryNoBorder" onClick={async () => {
            logout();
            if (onMenuClose) {
              onMenuClose();
            }
          }}>{t('site-logout')}</Button>

        </ButtonsDiv>
      ) : (
        <ButtonsDiv isLarge={props.isLarge}>
          <Button icon="login" onClick={() => setVisible(true)}>
            {t('site-login')}
          </Button>
          <Button icon="login" onClick={() => {
            fakeUserLogin(mutateUser);
            if (onMenuClose) {
              onMenuClose();
            }
          }
          }>
            {t('site-fake-login')}
          </Button>
        </ButtonsDiv>
      )}

      {visible &&
        <LoginModalView props={props} setVisible={setVisible} />
      }
    </>
  );

  async function logout() {
    const user: User = await axios.get('/api/auth/logout').then(x => x.data);
    mutateUser(user, false);
    router.push('/');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function ssoLogout() {
    const currentUrl: string = '/logout.html';
    window.location.href = `/Shibboleth.sso/Logout?return=${encodeURIComponent(
      currentUrl
    )}`;
  }
}
