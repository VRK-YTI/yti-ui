import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Text,
} from 'suomifi-ui-components';
import { BorderedText } from './operationalize-modal.styles';
import { Grid } from '@mui/material';
import { sourceXmlContent,targetXMLContent } from './testdata';
import { ButtonBlock } from '../workspace/workspace.styles';

interface OperationalizeProps {
  sourceSchemaPid?: string;
  targetSchemaPid?: string;
  crosswalkPid?: string;
}
export default function OperationalizeModal({
  sourceSchemaPid,
  targetSchemaPid,
  crosswalkPid,
}: OperationalizeProps) {
  const [visible, setVisible] = useState(false);
  const [, setIsValid] = useState(false);
  const [documentViewArea, setDocumentViewArea] = useState(false);

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = useCallback(() => {
    setVisible(false);
    setDocumentViewArea(false);
  }, []);

  function renderButton() {
    return (
      <Button
        variant="secondary"
        style={{ height: 'min-content' }}
        onClick={() => handleOpen()}
      >
        {'Test Crosswalk'}
      </Button>
    );
  }

  useEffect(() => {}, [setDocumentViewArea]);

  const handleClick = () => {
    setDocumentViewArea(true);
  };

  return (
    <>
      <div>{renderButton()}</div>
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
      >
        <ModalContent>
          <ModalTitle>{'Test Crosswalk'}</ModalTitle>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div>
                <label>Source Document</label>
                <BorderedText>
                  <Text>{sourceXmlContent}</Text>
                </BorderedText>
              </div>
            </Grid>

            <Grid item xs={6}>
              {documentViewArea && (
                <div>
                  <label>Target Document</label>
                  <BorderedText>
                    <Text>{targetXMLContent}</Text>
                  </BorderedText>
                </div>
              )}
            </Grid>
          </Grid>
        </ModalContent>
        <ModalFooter>
          <ButtonBlock>
            <Button disabled={false} onClick={() => handleClick()}>
              {'Test Crosswalk'}
            </Button>
            <Button variant="secondary" onClick={() => handleClose()}>
              Close
            </Button>
          </ButtonBlock>
        </ModalFooter>
      </Modal>
    </>
  );
}
