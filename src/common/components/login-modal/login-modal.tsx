
import { useTranslation } from 'next-i18next';
import { Button, Modal, ModalContent, ModalFooter, ModalTitle, Paragraph, Text } from 'suomifi-ui-components';
import { LayoutProps } from '../layout/layout-props';
import { ModalTitleWrapper } from './login-modal.styles';

export default function LoginModalView({ props, setVisible }: { props: LayoutProps, setVisible: Function }) {
  const { t } = useTranslation('common');

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Modal
        appElementId="__next"
        visible={true}
        variant={props.isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={handleClose}
      >
        <ModalContent>
          <ModalTitleWrapper>
            <ModalTitle>{t('site-login-title')}</ModalTitle>
            <Button variant="secondary" icon="close" onClick={handleClose} />
          </ModalTitleWrapper>
          <Paragraph>
            <Text>{t('site-login-info-1')}</Text>
          </Paragraph>
          <br />
          <Paragraph>
            <Text>{t('site-login-info-2')}</Text>
          </Paragraph>
        </ModalContent>
        <ModalFooter>
          <Button icon="login" onClick={() => login()}>
            {t('site-login')}
          </Button>
          <Button onClick={() => register()}>
            {t('site-register')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  function login() {
    window.location.href = '/api/auth/login?target=/';
  }

  function register() {
    window.open('http://id.eduuni.fi/signup', '_blank');
  }
}
