import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'suomifi-ui-components';
import User from '../../interfaces/user-interface';
import LoginModalView from '../login-modal/login-modal';
import { LoginButtonsWrapper } from './authentication-panel.styles';

export interface LoginButtonProps {
  user?: User;
  isSmall?: boolean;
}

export default function LoginButtons({ user, isSmall = false }: LoginButtonProps) {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);

  if (user?.anonymous ?? true) {
    return (
      <LoginButtonsWrapper isSmall={isSmall}>
        <Button icon="login" onClick={() => setVisible(true)}>
          {t('site-login')}
        </Button>
        <Button icon="login" onClick={() => window.location.href = '/api/auth/fake-login'}>
          {t('site-fake-login')}
        </Button>

        {visible ? (
          <LoginModalView props={{ user, isSmall }} setVisible={setVisible} />
        ) : null}
      </LoginButtonsWrapper>
    );
  }

  return null;
}
