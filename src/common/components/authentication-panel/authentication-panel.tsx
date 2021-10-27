import { SyntheticEvent, useState } from 'react';
import {
  ButtonsDiv,
  UserInfo,
} from './authentication-panel.styles';
import User, { anonymousUser } from '../../interfaces/user-interface';
import { authFakeUser } from '../../utils/user';
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
  const { t } = useTranslation('common');

  return (
    <>
      {props.user && !props.user.anonymous ? (
        <ButtonsDiv isLarge={props.isLarge}>
          <UserInfo>
            <Text>
              {`${props.user?.firstName} ${props.user?.lastName}`}
            </Text>
          </UserInfo>
          <Button icon="logout" variant="secondaryNoBorder" onClick={async(e: MouseEvent | KeyboardEvent) => {
            logout(e);
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
          <Button icon="login" onClick={async(e) => {
            fakeLogin(e);
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

  async function logout(e: MouseEvent | KeyboardEvent) {
    e.preventDefault();
    window.location.href = '/api/auth/logout?target=/';
  }

  function fakeLogin(e: MouseEvent | KeyboardEvent) {
    e.preventDefault();
    window.location.href = '/api/auth/fake-login';
  }
}
