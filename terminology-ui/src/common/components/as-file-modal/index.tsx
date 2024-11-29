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
  prefix: string;
  visible: boolean;
  onClose: () => void;
  filename?: string;
}

export default function AsFileModal({
  prefix,
  visible,
  onClose,
  filename,
}: AsFileModalProps) {
  const { t, i18n } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const fileTypes = ['JSON-LD', 'RDF', 'Turtle'];

  const [chosenFileType, setChosenFileType] = useState('JSON-LD');

  const handleClose = () => {
    onClose();
    setChosenFileType('JSON-LD');
  };

  return (
    <>
      <NarrowModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => onClose()}
      >
        <SimpleModalContent>
          <div>
            <ModalTitle>{t('vocabulary-info-vocabulary-export')}</ModalTitle>
            <Text variant="bold">
              {t('vocabulary-info-vocabulary-export-description')}
            </Text>
            <RadioButtonGroupSimple
              labelText=""
              name="file-types-radio-button-group"
              defaultValue="JSON-LD"
              onChange={setChosenFileType}
            >
              {fileTypes.map((type) => (
                <RadioButton
                  key={`file-type-radio-button-${type}`}
                  value={type}
                >
                  {type}
                </RadioButton>
              ))}
            </RadioButtonGroupSimple>
          </div>

          <ButtonFooter>
            <Link
              href={`/api/getTerminologyAsFile?prefix=${prefix}&fileType=${chosenFileType}&filename=${filename}`}
              passHref
              legacyBehavior
            >
              <SuomiLink href="">
                <Button id="download-button" onClick={handleClose}>
                  {t('vocabulary-info-vocabulary-button')}
                </Button>
              </SuomiLink>
            </Link>
            <Button
              variant="secondary"
              onClick={() => handleClose()}
              id="cancel-button"
            >
              {t('site-cancel')}
            </Button>
          </ButtonFooter>
        </SimpleModalContent>
      </NarrowModal>
    </>
  );
}
