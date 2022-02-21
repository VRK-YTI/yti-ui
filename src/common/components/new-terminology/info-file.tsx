import { useState } from 'react';
import { Button, Paragraph, Text } from 'suomifi-ui-components';
import { FileBlock, FileInfo, FileInfoBlock, FileInfoStaticIcon, FileRemoveButton, FileWrapper } from './new-terminology.styles';

export default function InfoFile() {
  const [file, setFile] = useState<string | null>(null);

  return (
    <FileWrapper>
      <FileBlock padding='m'>
        <Paragraph marginBottomSpacing='xxs'>
          <Text variant='bold' smallScreen>
            Liitä tai raahaa tiedostot tähän
          </Text>
        </Paragraph>
        <Paragraph marginBottomSpacing='l'>
          <Text smallScreen>
            Sallitut tiedostomuodot on: xlsx
          </Text>
        </Paragraph>
        {!file
          ?
          <Button
            icon='plus'
            variant='secondary'
            onClick={() => setFile('temp')}
          >
            Lisää tiedosto
          </Button>
          :
          <FileInfoBlock>
            <FileInfo>
              <FileInfoStaticIcon icon='genericFile' />
              <div>
                <Paragraph>
                  <Text color={'highlightBase'}>
                    static-file-name.xlsx
                  </Text>
                </Paragraph>
                <Paragraph>
                  <Text color={'depthDark1'}>
                    123 KB
                  </Text>
                </Paragraph>
              </div>
            </FileInfo>
            <FileRemoveButton
              variant='secondaryNoBorder'
              icon='remove'
              onClick={() => setFile(null)}
            >
              Poista
            </FileRemoveButton>
          </FileInfoBlock>
        }
      </FileBlock>
    </FileWrapper>
  );
}
