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
  const [files, setFiles] = useState<DataTransferItemList>([]);

  useEffect(() => {
    if (files.length > 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [files]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!e.dataTransfer.items) {
      return;
    }

    const retItems = [...files];
    const droppedItems = e.dataTransfer.items;

    for (let i = 0; i < droppedItems.length; i++) {
      if (droppedItems[i].kind !== 'file') {
        continue;
      }

      retItems.push(droppedItems[i].getAsFile());
    }

    setFiles(retItems);
  };

  const handleUpload = (e: any) => {
    e.preventDefault();

    const retItems = [...files];
    const selectedItems = e.target.files;
    console.log(selectedItems);
    for (let i = 0; i < selectedItems.length; i++) {
      if (selectedItems[i].name.includes(/.xlsx$/g)) {
        continue;
      }

      retItems.push(selectedItems[i].getAsFile());
    }

    setFiles(retItems);
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
        {files.length < 1 ? (
          <>
            <input type="file" ref={input} style={{ display: 'none' }} onChange={(e) => {
              handleUpload(e);
            }} />
            <Button
              icon="plus"
              variant="secondary"
              onClick={() => {
                input.current.click();
              }}
            >
              Lisää tiedosto
            </Button>
          </>
        ) : (
          files.map((file, idx) => {
            return (
              <FileInfoBlock key={`uploaded-item-${idx}`}>
                <FileInfo>
                  <FileInfoStaticIcon icon="genericFile" />
                  <div>
                    <Paragraph>
                      <Text color={'highlightBase'}>{file.name}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text color={'depthDark1'}>{file.size} KB</Text>
                    </Paragraph>
                  </div>
                </FileInfo>
                <FileRemoveButton
                  variant="secondaryNoBorder"
                  icon="remove"
                  onClick={() =>
                    setFiles(files.filter((f) => f.name !== file.name))
                  }
                >
                  Poista
                </FileRemoveButton>
              </FileInfoBlock>
            );
          })
        )}
      </FileBlock>
    </FileWrapper>
  );
}
