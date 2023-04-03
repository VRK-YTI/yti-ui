import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState } from 'react';
import {
  Link as SuomiLink,
  Button,
  ModalTitle,
  RadioButton,
  Text,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  ButtonFooter,
  NarrowModal,
  RadioButtonGroupSimple,
  SimpleModalContent,
} from './as-file-modal.styles';

interface AsFileModalProps {
  type: 'show' | 'download';
  modelId: string;
}

export default function AsFileModal({ type, modelId }: AsFileModalProps) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const fileTypes = ['JSON-LD', 'RDF', 'Turtle' /*'XML', 'OpenAPI'*/];
  const [chosenFileType, setChosenFileType] = useState('JSON-LD');

  const handleClose = () => {
    setVisible(false);
    setChosenFileType('JSON-LD');
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
            onChange={setChosenFileType}
          >
            {fileTypes.map((type) => (
              <RadioButton key={`file-type-radio-button-${type}`} value={type}>
                {type}
              </RadioButton>
            ))}
          </RadioButtonGroupSimple>
        </div>

        <ButtonFooter>
          <Link
            href={`/api/getModelAsFile?modelId=${modelId}&fileType=${chosenFileType}&raw=true`}
            passHref
            download
          >
            <SuomiLink target="_blank" href="">
              <Button>{t('show')}</Button>
            </SuomiLink>
          </Link>
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
            onChange={setChosenFileType}
          >
            {fileTypes.map((type) => (
              <RadioButton key={`file-type-radio-button-${type}`} value={type}>
                {type}
              </RadioButton>
            ))}
          </RadioButtonGroupSimple>
        </div>

        <ButtonFooter>
          <Link
            href={`/api/getModelAsFile?modelId=${modelId}&fileType=${chosenFileType}`}
            passHref
          >
            <SuomiLink href="">
              <Button>{t('download')}</Button>
            </SuomiLink>
          </Link>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('site-cancel')}
          </Button>
        </ButtonFooter>
      </SimpleModalContent>
    );
  }
}
