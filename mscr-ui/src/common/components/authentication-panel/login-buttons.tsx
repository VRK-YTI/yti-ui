import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from 'suomifi-ui-components';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import { useBreakpoints } from 'yti-common-ui/components/media-query';
import { LoginButtonsWrapper } from 'yti-common-ui/components/authentication-panel/authentication-panel.styles';
import LoginModalView from '@app/common/components/login-modal';

interface LoginButtonsProps {
  handleLoginModalClick?: () => void;
  user?: MscrUser;
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
