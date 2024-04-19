import {TFunction, useTranslation} from 'next-i18next';
import {ChangeEvent, useEffect, useRef, useState} from 'react';
import {
  Block,
  Button,
  IconRemove,
  InlineAlert,
  Paragraph,
  Text
} from 'suomifi-ui-components';
import {
  CaptionText,
  FileBlock, FileBlockWrapper,
  FileInfo,
  FileInfoBlock,
  FileInfoStaticIcon,
  FileRemoveButton,
  FileWrapper, WideTextInput,
} from './file-drop-area-mscr.styles';
import * as React from 'react';
import {CircleIcon, UploadIcon} from 'mscr-ui/src/common/components/shared-icons';

interface FileDropAreaProps {
  setIsValid: (valid: boolean) => void;
  setFileData: (data: File | null) => void;
  validFileTypes: string[];
  translateFileUploadError: (
    error: 'none' | 'upload-error' | 'incorrect-file-type',
    fileTypes: string[],
    t: TFunction,
  ) => string | undefined;
  setFileUri?: (uri: string | null) => void;
  isSchemaUpload?: boolean;
  disabled?: boolean
}

export default function FileDropAreaMscr({
  setIsValid,
  setFileData,
  validFileTypes,
  translateFileUploadError,
  setFileUri,
  isSchemaUpload,
  disabled,
}: FileDropAreaProps) {
  const {t} = useTranslation('admin');
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<'none' | 'upload-error' | 'incorrect-file-type'>('none');
  const [fileUriField, setFileUriField] = useState<string>('');

  useEffect(() => {
    if (fileUriField) {
      setFileUri(fileUriField);
    }
    if (file) {
      setFileData(file);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [file, fileUriField, setIsValid, setFileData, setFileUri]);

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
      <div>
        <FileBlockWrapper>
          {isSchemaUpload && (
            <>
              <Block>
                <WideTextInput
                  labelText={t('register-schema-file-uri-reference')}
                  onChange={(value) => setFileUriField(value?.toString() ?? '')}
                  value={fileUriField}
                  disabled={disabled}
                />
              </Block>
              <Text smallScreen>
                {'OR'}
              </Text>
              <br/>
              <CaptionText>{t('upload-documents')}</CaptionText>
            </>
          )}

          <FileBlock padding="m" id="file-drop-block">
            {file === null ? (
              <>
                <CircleIcon></CircleIcon>
                <UploadIcon></UploadIcon>
                <Paragraph>
                  <Text variant="bold" smallScreen>
                    {t('drag-files-to-upload')}
                  </Text>
                </Paragraph>
                <input
                  type="file"
                  ref={input}
                  accept={validFileTypes.map((type) => `.${type}`).join(',')}
                  style={{display: 'none'}}
                  disabled={disabled}
                  onChange={(e) => {
                    handleUpload(e);
                  }}
                />
                <Text smallScreen>
                  {'OR'}
                </Text>

                <Button
                  className={'mt-2'}
                  variant="secondary"
                  onClick={() => {
                    input.current && input.current.click();
                  }}
                  id="add-file-button"
                  disabled={disabled}
                >
                  {'Browse files'}
                </Button>
              </>
            ) : (
              <FileInfoBlock>
                <FileInfo>
                  <FileInfoStaticIcon/>
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
                  icon={<IconRemove/>}
                  onClick={() => setFile(null)}
                  id="remove-file-button"
                  disabled={disabled}
                >
                  {t('remove')}
                </FileRemoveButton>
              </FileInfoBlock>
            )}
          </FileBlock>
        </FileBlockWrapper>
      </div>
      {alert !== 'none' && (
        <InlineAlert status="error">
          {translateFileUploadError(alert, validFileTypes, t)}
        </InlineAlert>
      )}
    </FileWrapper>
  );
}
