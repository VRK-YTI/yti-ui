import { TFunction, useTranslation } from 'next-i18next';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  Button,
  IconPlus,
  IconRemove,
  InlineAlert,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import {
  FileBlock,
  FileInfo,
  FileInfoBlock,
  FileInfoStaticIcon,
  FileRemoveButton,
  FileWrapper,
} from './file-drop-area.styles';

interface FileDropAreaProps {
  setIsValid: (valid: boolean) => void;
  setFileData: (data: File | null) => void;
  validFileTypes: string[];
  translateFileUploadError: (
    error: 'none' | 'upload-error' | 'incorrect-file-type',
    fileTypes: string[],
    t: TFunction
  ) => string | undefined;
}

export default function FileDropArea({
  setIsValid,
  setFileData,
  validFileTypes,
  translateFileUploadError,
}: FileDropAreaProps) {
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
      if (
        droppedItemAsFile &&
        validFileTypes.some((type) => droppedItemAsFile.name.endsWith(type))
      ) {
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
      if (validFileTypes.some((type) => selectedItems[i].name.endsWith(type))) {
        setFile(selectedItems[i]);
        setAlert('none');
        break;
      } else if (alert === 'none' && selectedItems[i].name.length > 0) {
        setAlert('incorrect-file-type');
      }
    }
  };

  return (
    <FileWrapper
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => e.preventDefault()}
    >
      <FileBlock padding="m" id="file-drop-block">
        <Paragraph mb="xxs">
          <Text variant="bold" smallScreen>
            {t('add-or-drag-a-new-file-here')}
          </Text>
        </Paragraph>
        <Paragraph mb="l">
          <Text smallScreen>
            {t('allowed-file-formats')} {validFileTypes.join(', ')}
          </Text>
        </Paragraph>
        {file === null ? (
          <>
            <input
              type="file"
              ref={input}
              accept={validFileTypes.map((type) => `.${type}`).join(',')}
              style={{ display: 'none' }}
              onChange={(e) => {
                handleUpload(e);
              }}
            />
            <Button
              icon={<IconPlus />}
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
              <FileInfoStaticIcon />
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
              icon={<IconRemove />}
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
          {translateFileUploadError(alert, validFileTypes, t)}
        </InlineAlert>
      )}
    </FileWrapper>
  );
}
