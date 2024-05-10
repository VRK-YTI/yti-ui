import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { Modal } from 'suomifi-ui-components';

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
  const router = useRouter();
  const [fileData, setFileData] = useState<File | null>();
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = useCallback(() => {
    setVisible(false);
    setFileData(null);
  }, []);

  return (
    <>
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        children={undefined}
      ></Modal>
    </>
  );
}
