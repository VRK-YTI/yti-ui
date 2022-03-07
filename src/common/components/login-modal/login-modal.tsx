import { useTranslation } from 'next-i18next';
import { Button, ExternalLink, Modal, ModalFooter, Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import { ModalContentSmPadding, ModalStyled, ModalTitleH1 } from './login-modal.styles';

export default function LoginModalView({ setVisible }: { setVisible: Function }) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();

  return (
    <>
      <ModalStyled
        appElementId='__next'
        visible={true}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => setVisible(false)}
        scrollable={false}
      >
        <ModalContentSmPadding>
          <ModalTitleH1 as={'h1'}>
            {t('site-login-title')}
          </ModalTitleH1>
          <Paragraph>
            <Text>
              {t('site-login-info-1')}
            </Text>
          </Paragraph>
          <br />
          <Paragraph>
            <Text>
              {t('site-login-info-2')}{' '}
              <ExternalLink href='' labelNewWindow=''>
                {t('site-register')}
              </ExternalLink>
            </Text>
          </Paragraph>
        </ModalContentSmPadding>

        <ModalFooter>
          <Button onClick={() => login()}>
            {t('site-to-login')}
          </Button>
          <Button variant='secondaryNoBorder' onClick={() => setVisible(false)}>
            {t('site-cancel')}
          </Button>
        </ModalFooter>
      </ModalStyled>
    </>
  );

  function login() {
    window.location.href = '/api/auth/login?target=/';
  }
}
