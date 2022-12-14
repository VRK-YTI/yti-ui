import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from 'suomifi-ui-components';
import LoginModalView from '../login-modal';
import { useBreakpoints } from '../media-query';
import { LoginButtonsWrapper } from './authentication-panel.styles';
import { User } from '../../interfaces/user.interface';

interface LoginButtonsProps {
  handleLoginModalClick?: () => void;
  user?: User;
}

export default function LoginButtons({
  handleLoginModalClick,
  user,
}: LoginButtonsProps) {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);
  const { breakpoint } = useBreakpoints();

  if (user?.anonymous ?? true) {
    return (
      <LoginButtonsWrapper $breakpoint={breakpoint}>
        <Button
          icon="login"
          onClick={() =>
            handleLoginModalClick ? handleLoginModalClick() : setVisible(true)
          }
          id="login-button"
        >
          {t('site-login')}
        </Button>

        {visible ? <LoginModalView setVisible={setVisible} /> : null}
      </LoginButtonsWrapper>
    );
  }

  return null;
}
