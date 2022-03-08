import { useTranslation } from 'next-i18next';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import { ModalTitleWrapper } from './login-modal.styles';

export default function LoginModalView({
  setVisible,
}: {
  setVisible: Function;
}) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();

  return (
    <>
      <Modal
        appElementId="__next"
        visible={true}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => setVisible(false)}
      >
        <ModalContent>
          <ModalTitleWrapper>
            <ModalTitle>{t('site-login-title')}</ModalTitle>
            <Button
              variant="secondary"
              icon="close"
              onClick={() => setVisible(false)}
            />
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
          <Button onClick={() => register()}>{t('site-register')}</Button>
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
