import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'suomifi-ui-components';
import User from '../../interfaces/user-interface';
import LoginModalView from '../login-modal/login-modal';
import { useBreakpoints } from '../media-query/media-query-context';
import { LoginButtonsWrapper } from './authentication-panel.styles';

export interface LoginButtonProps {
  user?: User;
}

export default function LoginButtons({ user }: LoginButtonProps) {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);
  const { breakpoint } = useBreakpoints();

  if (user?.anonymous ?? true) {
    return (
      <LoginButtonsWrapper breakpoint={breakpoint}>
        <Button icon="login" onClick={() => setVisible(true)}>
          {t('site-login')}
        </Button>

        {visible ? (
          <LoginModalView props={{ user }} setVisible={setVisible} />
        ) : null}
      </LoginButtonsWrapper>
    );
  }

  return null;
}
