import { translateFileUploadError } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button, InlineAlert, Paragraph, Text } from 'suomifi-ui-components';
import {
  FileBlock,
  FileInfo,
  FileInfoBlock,
  FileInfoStaticIcon,
  FileRemoveButton,
  FileWrapper,
} from './new-terminology.styles';

interface infoFileProps {
  setIsValid: (valid: boolean) => void;
  setFileData: (data: File | null) => void;
}

export default function InfoFile({ setIsValid, setFileData }: infoFileProps) {
  const { t } = useTranslation('admin');
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<
    'none' | 'upload-error' | 'incorrect-file-type'
  >('none');

  useEffect(() => {
    if (file) {
      setFileData(file);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [file, setIsValid, setFileData]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (file) {
      return;
    }

    if (!e.dataTransfer.items) {
      setAlert('upload-error');
      return;
    }

    const droppedItems = e.dataTransfer.items;
    if (droppedItems.length === 0) {
      setAlert('upload-error');
      return;
    }

    for (let i = 0; i < droppedItems.length; i++) {
      const droppedItemAsFile = droppedItems[i].getAsFile();
      if (droppedItemAsFile && droppedItemAsFile?.name.endsWith('xlsx')) {
        setFile(droppedItemAsFile);
        setAlert('none');
        break;
      }

      if (alert === 'none') {
        setAlert('incorrect-file-type');
      }
    }
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (file) {
      return;
    }

    const selectedItems = e.target.files;

    if (!selectedItems) {
      setAlert('upload-error');
      return;
    }

    for (let i = 0; i < selectedItems.length; i++) {
      if (selectedItems[i].name.endsWith('.xlsx')) {
        setFile(selectedItems[i]);
        setAlert('none');
        break;
      }

      if (alert === 'none') {
        // Setting alert to upload-error here because
        // input is set to accept only .xlsx files below
        setAlert('upload-error');
      }
    }
  };

  return (
    <FileWrapper
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => e.preventDefault()}
    >
      <FileBlock padding="m" id="file-drop-block">
        <Paragraph marginBottomSpacing="xxs">
          <Text variant="bold" smallScreen>
            {t('add-or-drag-a-new-file-here')}
          </Text>
        </Paragraph>
        <Paragraph marginBottomSpacing="l">
          <Text smallScreen>{t('allowed-file-formats')} xlsx</Text>
        </Paragraph>
        {file === null ? (
          <>
            <input
              type="file"
              ref={input}
              accept=".xlsx"
              style={{ display: 'none' }}
              onChange={(e) => {
                handleUpload(e);
              }}
            />
            <Button
              icon="plus"
              variant="secondary"
              onClick={() => {
                input.current && input.current.click();
              }}
              id="add-file-button"
            >
              {t('add-file')}
            </Button>
          </>
        ) : (
          <FileInfoBlock>
            <FileInfo>
              <FileInfoStaticIcon icon="genericFile" />
              <div>
                <Paragraph>
                  <Text color={'highlightBase'} variant={'bold'}>
                    {file.name}
                  </Text>
                </Paragraph>
                <Paragraph>
                  <Text color={'depthDark1'}>
                    {(file.size / 1000).toFixed(1)} KB
                  </Text>
                </Paragraph>
                <Paragraph>
                  <Text variant={'bold'}>{t('file-added')}</Text>
                </Paragraph>
              </div>
            </FileInfo>
            <FileRemoveButton
              variant="secondaryNoBorder"
              icon="remove"
              onClick={() => setFile(null)}
              id="remove-file-button"
            >
              {t('remove')}
            </FileRemoveButton>
          </FileInfoBlock>
        )}
      </FileBlock>
      {alert !== 'none' && (
        <InlineAlert status="error">
          {translateFileUploadError(alert, t)}
        </InlineAlert>
      )}
    </FileWrapper>
  );
}
