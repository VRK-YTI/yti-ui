import { selectLogin } from '@app/common/components/login/login.slice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import ModelForm from '.';
import { FormErrors, validateForm } from './validate-form';
import { useInitialModelForm } from '@app/common/utils/hooks/use-initial-model-form';
import FormFooterAlert from 'yti-common-ui/form-footer-alert';
import { translateModelFormErrors } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import generatePayload from './generate-payload';

export default function ModelFormModal() {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const user = useSelector(selectLogin());
  const [formData, setFormData] = useState(useInitialModelForm());
  const [errors, setErrors] = useState<FormErrors>();
  const [userPosted, setUserPosted] = useState(false);

  const handleClose = () => {
    setVisible(false);
    setUserPosted(false);
  };

  const handleSubmit = () => {
    setUserPosted(true);
    if (!formData) {
      return;
    }

    const errors = validateForm(formData);
    setErrors(errors);
    if (Object.values(errors).includes(true)) {
      return;
    }

    const payload = generatePayload(formData);
    console.log(payload);
  };

  useEffect(() => {
    if (!userPosted) {
      return;
    }

    const errors = validateForm(formData);
    setErrors(errors);
  }, [userPosted, formData]);

  if (user.anonymous) {
    return null;
  }

  return (
    <>
      <Button
        icon="plus"
        style={{ height: 'min-content' }}
        onClick={() => setVisible(true)}
      >
        {t('add-new-model')}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('add-new-model')}</ModalTitle>
          <Paragraph style={{ marginBottom: '30px' }}>
            {t('add-new-model-description')}
          </Paragraph>
          <ModelForm
            formData={formData}
            setFormData={setFormData}
            userPosted={userPosted}
            errors={userPosted ? errors : undefined}
          />
        </ModalContent>
        <ModalFooter>
          {userPosted && (
            <FormFooterAlert
              alerts={
                errors &&
                Object.keys(errors)
                  .filter((key) => errors[key as keyof FormErrors])
                  .map((error) => translateModelFormErrors(error, t))
              }
            />
          )}

          <Button onClick={() => handleSubmit()}>{t('create-model')}</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
