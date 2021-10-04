import { SyntheticEvent, useState } from 'react';
import { LoginModalFunctions } from '../../interfaces/callback-interfaces';
import {
  ButtonsDiv,
  AuthenticationButton,
} from './authentication-panel.styles';
import LoginModal from '../login-modal/login-modal';
import useUser from '../../hooks/useUser';
import User, { anonymousUser } from '../../interfaces/user-interface';
import { authFakeUser } from '../../utils/user';
import { useRouter } from 'next/router';
import axios from 'axios';

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

export default function AuthenticationPanel() {
  const [apState, setState] = useState({
    ModalOpen: false,
  });
  const modalFunctions: LoginModalFunctions = {
    closeModal: modalClose,
  };

  const { user, mutateUser } = useUser();
  const router = useRouter();

  return (
    <>
      {user && !user.anonymous ? (
        <ButtonsDiv>
          <AuthenticationButton onClick={ async(e) => logout(e) }>
            SSO - Logout {user?.firstName + ' ' + user?.lastName}
          </AuthenticationButton>
        </ButtonsDiv>
      ) : (
        <ButtonsDiv>
          <AuthenticationButton
            onClick={ () => fakeUserLogin(mutateUser) }
          >
            Fake Admin - login
          </AuthenticationButton>
          <AuthenticationButton onClick={openSsoLoginAndRegister}>
            SSO - login/Register
          </AuthenticationButton>
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

  async function logout(e: SyntheticEvent) {
    e.preventDefault();
    const user: User = await axios.get('/api/auth/logout').then(x => x.data);
    mutateUser(user, false);
    router.push('/');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function ssoLogout() {
    if (process.env.host == undefined) {
      console.error('Error, host variable is undefined');
      return;
    }
    const currentUrl: string = process.env.host + '/logout.html';
    window.location.href = `/Shibboleth.sso/Logout?return=${encodeURIComponent(
      currentUrl
    )}`;
  }

  function modalClose() {
    setState({ ...apState, ModalOpen: false });
  }
}
