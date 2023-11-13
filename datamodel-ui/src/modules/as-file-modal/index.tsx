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
  visible: boolean;
  onClose: () => void;
  filename?: string;
  version?: string;
}

export default function AsFileModal({
  type,
  modelId,
  visible,
  onClose,
  filename,
  version,
}: AsFileModalProps) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const fileTypes = ['JSON-LD', 'RDF', 'Turtle' /*'XML', 'OpenAPI'*/];
  const [chosenFileType, setChosenFileType] = useState('JSON-LD');

  const handleClose = () => {
    onClose();
    setChosenFileType('JSON-LD');
  };

  const versionParam = version ? `&version=${version}` : '';

  return (
    <>
      <NarrowModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => onClose()}
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
            href={`/api/getModelAsFile?modelId=${modelId}&fileType=${chosenFileType}&raw=true${versionParam}`}
            passHref
            legacyBehavior
            download
          >
            <SuomiLink target="_blank" href="">
              <Button id="show-button">{t('show')}</Button>
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
            href={`/api/getModelAsFile?modelId=${modelId}&fileType=${chosenFileType}&filename=${filename}${versionParam}`}
            passHref
            legacyBehavior
          >
            <SuomiLink href="">
              <Button id="download-button">{t('download')}</Button>
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
    );
  }
}
