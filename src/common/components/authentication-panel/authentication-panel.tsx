import { useState } from 'react';
import {
  ButtonsDiv,
  UserInfo,
} from './authentication-panel.styles';
import { Button, Link, Text } from 'suomifi-ui-components';
import { useTranslation } from 'react-i18next';
import { LayoutProps } from '../layout/layout-props';
import LoginModalView from '../login-modal/login-modal';

export default function AuthenticationPanel({ props }: { props: LayoutProps }) {

  const [visible, setVisible] = useState(false);
  const { t } = useTranslation('common');

  return (
    <>
      {props.user && !props.user.anonymous ? (
        <ButtonsDiv isSmall={props.isSmall}>
          <UserInfo>
            <Text>
              {`${props.user?.firstName} ${props.user?.lastName}`}
            </Text>
            <Text>
              <Link href="" onClick={(e: any) => logout(e)}>{t('site-logout').toUpperCase()}</Link>
            </Text>
          </UserInfo>
        </ButtonsDiv>
      ) : (
        <ButtonsDiv isSmall={props.isSmall}>
          <Button icon="login" onClick={() => setVisible(true)}>
            {t('site-login')}
          </Button>
          <Button icon="login" onClick={async(e) => fakeLogin(e)}>
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
