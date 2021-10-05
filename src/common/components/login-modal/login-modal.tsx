import {
  ModalBackdrop,
  ModalWindow,
  ModalDialog,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  ColMd12,
} from './login-modal.styles';
import { Button as SuomiButton } from 'suomifi-ui-components';
import { LoginModalFunctions } from '../../interfaces/callback-interfaces';

export default function LoginModalView({
  modalFunctions,
}: {
  modalFunctions: LoginModalFunctions;
}) {
  //TODO: Use bootstrap and/or flexbox styles for modal instead of login-modal.styles.tsx
  return (
    <>
      <ModalBackdrop></ModalBackdrop>
      <ModalWindow>
        <ModalDialog>
          <ModalContent>
            <ModalHeader>
              <h4 className="modal-title">
                {/* <a><i id="close_login_modal_link" className="fa fa-times" onClick={modalFunctions.closeModal}></i></a>     */}
                <SuomiButton onClick={modalFunctions.closeModal}>X</SuomiButton>
                <span>Login</span>
              </h4>
            </ModalHeader>
            <ModalBody>
              <Row>
                <ColMd12>
                  <p>
                    Palveluun kirjaudutaan eDuuni-tunnuksilla. Kirjautumista
                    vaaditaan jos haluat muokata palvelun sisältöä.
                  </p>
                  <p>
                    Alla olevalla painikkeella ohjaudut eDuuni-palvelun
                    kirjautumiseen. Palaa sen jälkeen takaisin palveluun.
                  </p>
                </ColMd12>
              </Row>
            </ModalBody>
            <ModalBody>
              <Row>
                <ModalFooter>
                  <SuomiButton
                    id="login_modal_button"
                    type="button"
                    className="btn btn-action"
                    onClick={login}
                  >
                    Log In
                  </SuomiButton>
                  <SuomiButton
                    id="register_login_modal_button"
                    type="button"
                    className="btn btn-action"
                    onClick={register}
                  >
                    Register
                  </SuomiButton>
                </ModalFooter>
              </Row>
            </ModalBody>
          </ModalContent>
        </ModalDialog>
      </ModalWindow>
    </>
  );

  function login() {
    window.location.href = '/Shibboleth.sso/Login?target=/';
  }

  function register() {
    window.open('http://id.eduuni.fi/signup', '_blank');
  }
}
