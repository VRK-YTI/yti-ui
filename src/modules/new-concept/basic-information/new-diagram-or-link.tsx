import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  ModalFooter,
  ModalTitle,
  Textarea,
  TextInput,
} from 'suomifi-ui-components';
import { ModalContentFitted, ModalSmWidth } from './new-diagram-or-link.styles';

export default function NewDiagramOrLink() {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setVisible(true)}>
        {t('add-new-link')}
      </Button>
      <ModalSmWidth
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        appElementId="__next"
      >
        <ModalContentFitted>
          <ModalTitle>{t('add-new-diagram-or-link')}</ModalTitle>

          <TextInput labelText={t('diagram-name')} />
          <TextInput labelText={t('diagram-url')} />
          <Textarea
            labelText={t('description')}
            optionalText={t('optional')}
            visualPlaceholder={t('sources-placeholder')}
            fullWidth
          />
        </ModalContentFitted>
        <ModalFooter>
          <Button>{t('save')}</Button>
          <Button onClick={() => setVisible(false)} variant="secondary">
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </ModalSmWidth>
    </>
  );
}
