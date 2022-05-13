import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from 'suomifi-ui-components';
import LoginModalView from '@app/common/components/login-modal/login-modal';
import { selectLogin } from '@app/common/components/login/login.slice';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { LoginButtonsWrapper } from './authentication-panel.styles';

interface LoginButtonsProps {
  handleLoginModalClick?: () => void;
}

export default function LoginButtons({
  handleLoginModalClick,
}: LoginButtonsProps) {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);
  const { breakpoint } = useBreakpoints();
  const user = useSelector(selectLogin());

  if (user?.anonymous ?? true) {
    return (
      <LoginButtonsWrapper $breakpoint={breakpoint}>
        <Button
          icon="login"
          onClick={() =>
            handleLoginModalClick ? handleLoginModalClick() : setVisible(true)
          }
        >
          {t('site-login')}
        </Button>

        {visible ? <LoginModalView setVisible={setVisible} /> : null}
      </LoginButtonsWrapper>
    );
  }

  return null;
}
