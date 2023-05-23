import { useTranslation } from 'next-i18next';
import {
  Button,
  ExternalLink,
  ModalFooter,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query';
import {
  ModalContentSmPadding,
  ModalStyled,
  ModalTitleH1,
} from './login-modal.styles';
import { KeyboardEvent, MouseEvent } from 'react';
import { useRouter } from 'next/router';

export default function LoginModalView({
  setVisible,
}: {
  setVisible: Function;
}) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const { asPath } = useRouter();

  return (
    <>
      <ModalStyled
        appElementId="__next"
        visible={true}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => setVisible(false)}
        scrollable={false}
      >
        <ModalContentSmPadding>
          <ModalTitleH1 as={'h1'}>{t('site-login-title')}</ModalTitleH1>
          <Paragraph>
            <Text>{t('site-login-info-1')}</Text>
          </Paragraph>
          <br />
          <Paragraph>
            <Text>{t('site-login-info-2')} </Text>
            <ExternalLink
              href="http://id.eduuni.fi/signup"
              labelNewWindow={`${t(
                'site-open-link-new-window'
              )} id.eduuni.if/signup`}
            >
              {t('site-register')}
            </ExternalLink>
          </Paragraph>
        </ModalContentSmPadding>

        <ModalFooter>
          <Button onClick={(e) => login(e)} id="to-login-button">
            {t('site-to-login')}
          </Button>
          <Button
            variant="secondaryNoBorder"
            onClick={() => setVisible(false)}
            id="cancel-button"
          >
            {t('site-cancel')}
          </Button>
        </ModalFooter>
      </ModalStyled>
    </>
  );

  function login(e: MouseEvent | KeyboardEvent) {
    e.preventDefault();
    window.location.href = `/api/auth/login?target=/${
      i18n.language ?? 'fi'
    }${asPath}`;
  }
}
