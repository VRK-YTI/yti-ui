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
  setFileData: (data: any) => void;
}

export default function InfoFile({ setIsValid, setFileData }: infoFileProps) {
  const { t } = useTranslation('admin');
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(false);

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

    setShowAlert(true);

    if (!e.dataTransfer.items) {
      return;
    }

    const droppedItems = e.dataTransfer.items;
    if (droppedItems.length === 0) {
      return;
    }

    for (let i = 0; i < droppedItems.length; i++) {
      const droppedItemAsFile = droppedItems[i].getAsFile();
      if (droppedItemAsFile && droppedItemAsFile?.name.endsWith('xlsx')) {
        setFile(droppedItemAsFile);
        setShowAlert(false);
        break;
      }
    }
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (file) {
      return;
    }

    const selectedItems = e.target.files;
    setShowAlert(true);

    if (!selectedItems) {
      return;
    }

    for (let i = 0; i < selectedItems.length; i++) {
      if (selectedItems[i].name.endsWith('.xlsx')) {
        setFile(selectedItems[i]);
        setShowAlert(false);
        break;
      }
    }
  };

  return (
    <FileWrapper
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => e.preventDefault()}
    >
      <FileBlock padding="m">
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
            >
              {t('remove')}
            </FileRemoveButton>
          </FileInfoBlock>
        )}
      </FileBlock>
      {showAlert && (
        <InlineAlert status="error">
          {t('file-upload-failed')}
        </InlineAlert>
      )}
    </FileWrapper>
  );
}
