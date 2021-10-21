import { SyntheticEvent, useState } from 'react';
import { LoginModalFunctions } from '../../interfaces/callback-interfaces';
import {
  ButtonsDiv,
  AuthenticationButton,
} from './authentication-panel.styles';
import LoginModal from '../login-modal/login-modal';
import User from '../../interfaces/user-interface';

export default function AuthenticationPanel(props: { user?: User }) {
  const [apState, setState] = useState({
    ModalOpen: false,
  });
  const modalFunctions: LoginModalFunctions = {
    closeModal: modalClose,
  };

  return (
    <>
      {props.user && !props.user.anonymous ? (
        <ButtonsDiv>
          <AuthenticationButton onClick={ async(e) => logout(e) }>
            SSO - Logout {props.user.firstName + ' ' + props.user.lastName}
          </AuthenticationButton>
        </ButtonsDiv>
      ) : (
        <ButtonsDiv>
          <AuthenticationButton
            onClick={ async(e) => fakeLogin(e) }
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
