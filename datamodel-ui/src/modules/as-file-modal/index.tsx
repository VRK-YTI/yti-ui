import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, ModalTitle, RadioButton, Text } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  ButtonFooter,
  NarrowModal,
  RadioButtonGroupSimple,
  SimpleModalContent,
} from './as-file-modal.styles';

interface AsFileModalProps {
  type: 'show' | 'download';
}

export default function AsFileModal({ type }: AsFileModalProps) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const fileTypes = ['JSON-LD', 'RDF', 'XML', 'Turtle', 'OpenAPI'];

  const handleClose = () => {
    setVisible(false);
  };

  const handleSubmit = () => {
    handleClose();
  };

  return (
    <>
      <Button onClick={() => setVisible(true)} variant="secondaryNoBorder">
        {type === 'show' ? t('show-as-file') : t('download-as-file')}
      </Button>

      <NarrowModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => setVisible(false)}
      >
        {type === 'show' ? renderShowView() : renderDownloadView()}
      </NarrowModal>
    </>
  );

  function renderShowView() {
    return (
      <SimpleModalContent>
        <div>
          <ModalTitle>{t('show-as-file')}</ModalTitle>
          <Text variant="bold">{t('show-as-file-description')}</Text>
          <RadioButtonGroupSimple
            labelText=""
            defaultValue="JSON-LD"
            name="file-types-radio-button-group"
          >
            {fileTypes.map((type) => (
              <RadioButton key={`file-type-radio-button-${type}`} value={type}>
                {type}
              </RadioButton>
            ))}
          </RadioButtonGroupSimple>
        </div>

        <ButtonFooter>
          <Button onClick={() => handleSubmit()}>{t('show')}</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('site-cancel')}
          </Button>
        </ButtonFooter>
      </SimpleModalContent>
    );
  }

  function renderDownloadView() {
    return (
      <SimpleModalContent>
        <div>
          <ModalTitle>{t('download-as-file')}</ModalTitle>
          <Text variant="bold">{t('download-as-file-description')}</Text>
          <RadioButtonGroupSimple
            labelText=""
            name="file-types-radio-button-group"
            defaultValue="JSON-LD"
          >
            {fileTypes.map((type) => (
              <RadioButton key={`file-type-radio-button-${type}`} value={type}>
                {type}
              </RadioButton>
            ))}
          </RadioButtonGroupSimple>
        </div>

        <ButtonFooter>
          <Button onClick={() => handleSubmit()}>{t('download')}</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('site-cancel')}
          </Button>
        </ButtonFooter>
      </SimpleModalContent>
    );
  }
}
