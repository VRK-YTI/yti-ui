import { useState } from 'react';
import { Button, InlineAlert, Modal, ModalContent, ModalFooter, ModalTitle, Text } from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import FormFooterAlert from 'yti-common-ui/components/form-footer-alert';
import { useBreakpoints } from 'yti-common-ui/components/media-query';
import { useGetAuthenticatedUserQuery } from '@app/common/components/login/login.slice';
import { skipToken } from '@reduxjs/toolkit/query';
import HasPermission from '@app/common/utils/has-permission';

export default function RegisterSchemaModal() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [skip, setSkip] = useState(true);
  const { data: authenticatedUser } = useGetAuthenticatedUserQuery(undefined,{ skip });

  console.log('Skip: ', skip, ' User: ', authenticatedUser);
  const handleOpen = () => {
    setSkip(false);
    setVisible(true);
  };

  const handleClose = () => {
    setSkip(true);
    setVisible(false);
  };

  const handleSubmit = () => {
    console.log('Submit button pressed');
  };

  if (!HasPermission({ actions: ['CREATE_SCHEMA'] })) {
    return null;
  }

  return (
    <>
      <Button
        variant='secondary'
        icon='plus'
        onClick={() => handleOpen()}
      >
        {t('register-schema')}
      </Button>
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('register-schema')}</ModalTitle>
          <Text>{t('register-schema-file-required')}</Text>
        </ModalContent>
        <ModalFooter>
          {authenticatedUser && authenticatedUser.anonymous && (
            <InlineAlert status="error" role="alert" id="unauthenticated-alert">
              {t('error-unauthenticated')}
            </InlineAlert>
          )}
          {/*{userPosted && (*/}
          {/*  <FormFooterAlert*/}
          {/*    labelText={'Something went wrong'}*/}
          {/*    alerts={getErrors(errors)}*/}
          {/*  />*/}
          {/*)}*/}

          <Button onClick={() => handleSubmit()}>{t('register-schema')}</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
