import { useState } from 'react';
import {
  ButtonsDiv,
  UserInfo,
} from './authentication-panel.styles';
import { Button, Link, Text } from 'suomifi-ui-components';
import { useTranslation } from 'react-i18next';
import { LayoutProps } from '../../../layouts/layout-props';
import LoginModalView from '../login-modal/login-modal';
import ImpersonateWrapper from '../impersonate/impersonate-wrapper';

export interface AuthenticationPanelProps {
  props: LayoutProps;
  disableImpersonateWrapper?: boolean;
}

export default function AuthenticationPanel({ props, disableImpersonateWrapper }: AuthenticationPanelProps) {

  const [visible, setVisible] = useState(false);
  const { t } = useTranslation('common');

  return (
    <>
      {props.user && !props.user.anonymous ? (
        <ButtonsDiv isSmall={props.isSmall}>
          <ImpersonateWrapper onChange={email => fakeLogin(email)} disable={disableImpersonateWrapper}>
            <UserInfo>
              <Text>
                {`${props.user?.firstName} ${props.user?.lastName}`}
              </Text>
              <Text>
                <Link href="" onClick={(e: any) => logout(e)}>{t('site-logout').toUpperCase()}</Link>
              </Text>
            </UserInfo>
          </ImpersonateWrapper>
        </ButtonsDiv>
      ) : (
        <ButtonsDiv isSmall={props.isSmall}>
          <ImpersonateWrapper onChange={email => fakeLogin(email)}  disable={disableImpersonateWrapper}>
            <Button icon="login" onClick={() => setVisible(true)}>
              {t('site-login')}
            </Button>
          </ImpersonateWrapper>
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

  function fakeLogin(email: string) {
    window.location.href = `/api/auth/fake-login?fake.login.mail?${encodeURIComponent(email)}`;
  }
}
