import { SyntheticEvent, useState } from 'react';
import { LoginModalFunctions } from '../../interfaces/callback-interfaces';
import {
  ButtonsDiv,
  AuthenticationButton,
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

export default function AuthenticationPanel({ props }: { props: LayoutProps }) {
  const [apState, setState] = useState({
    ModalOpen: false,
  });
  const modalFunctions: LoginModalFunctions = {
    closeModal: modalClose,
  };

  const { user, mutateUser } = useUser();
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <>
      {user && !user.anonymous ? (
        <ButtonsDiv isLarge={props.isLarge}>
          <UserInfo>
            <Text>
              {`${user?.firstName} ${user?.lastName}`}<br />
            </Text>
            <Text>TODO: Organization</Text>
          </UserInfo>
          <Button icon="logout" onClick={async (e) => logout(e)}>{t('site-logout')}</Button>
        </ButtonsDiv>
      ) : (
        <ButtonsDiv isLarge={props.isLarge}>
          <Button icon="login"
            onClick={() => fakeUserLogin(mutateUser)}
          >
            {t('site-login')}
          </Button>

          <Button onClick={openSsoLoginAndRegister}>
            {t('site-register')}
          </Button>

        </ButtonsDiv>
      )}
      {apState.ModalOpen ? (
        <LoginModal modalFunctions={modalFunctions} />
      ) : null}
    </>
  );

  function openSsoLoginAndRegister() {
    setState({ ...apState, ModalOpen: true });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function ssoLogout() {
    const currentUrl: string = '/logout.html';
    window.location.href = `/Shibboleth.sso/Logout?return=${encodeURIComponent(
      currentUrl
    )}`;
  }

  function modalClose() {
    setState({ ...apState, ModalOpen: false });
  }

  async function logout(e: SyntheticEvent) {
    e.preventDefault();
    window.location.href = '/api/auth/logout?target=/';
  }

  function fakeLogin(e: SyntheticEvent) {
    e.preventDefault();
    window.location.href = '/api/auth/fake-login';
  }
}
