import { useEffect, useRef, useState } from 'react';
import { Button, Paragraph, Text } from 'suomifi-ui-components';
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
}

export default function InfoFile({ setIsValid }: infoFileProps) {
  const input = useRef(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (file) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [file, setIsValid]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

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
        break;
      }
    }
  };

  const handleUpload = (e: any) => {
    e.preventDefault();

    const selectedItems = e.target.files;

    for (let i = 0; i < selectedItems.length; i++) {
      if (selectedItems[i].name.endsWith('xlsx')) {
        setFile(selectedItems[i].getAsFile());
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
            Liitä tai raahaa tiedostot tähän
          </Text>
        </Paragraph>
        <Paragraph marginBottomSpacing="l">
          <Text smallScreen>Sallitut tiedostomuodot on: xlsx</Text>
        </Paragraph>
        {file === null ? (
          <>
            <input type="file" ref={input} style={{ display: 'none' }} onChange={(e) => {
              handleUpload(e);
            }} />
            <Button
              icon="plus"
              variant="secondary"
              onClick={() => {
                // input.current.click();
              }}
            >
              Lisää tiedosto
            </Button>
          </>
        ) : (
          <FileInfoBlock>
            <FileInfo>
              <FileInfoStaticIcon icon="genericFile" />
              <div>
                <Paragraph>
                  <Text color={'highlightBase'} variant={'bold'}>{file.name}</Text>
                </Paragraph>
                <Paragraph>
                  <Text color={'depthDark1'}>{file.size} KB</Text>
                </Paragraph>
                <Paragraph>
                  <Text variant={'bold'}>Tiedosto lisätty</Text>
                </Paragraph>
              </div>
            </FileInfo>
            <FileRemoveButton
              variant="secondaryNoBorder"
              icon="remove"
              onClick={() =>
                setFile(null)
              }
            >
              Poista
            </FileRemoveButton>
          </FileInfoBlock>
        )}
      </FileBlock>
    </FileWrapper>
  );
}
