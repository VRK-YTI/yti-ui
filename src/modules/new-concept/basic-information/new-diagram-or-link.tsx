import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  ModalFooter,
  ModalTitle,
  Textarea,
  TextInput,
} from 'suomifi-ui-components';
import { DiagramType } from '../new-concept.types';
import { ModalContentFitted, ModalSmWidth } from './new-diagram-or-link.styles';

interface NewDiagramOrLinkProps {
  addDiagram: (value: DiagramType) => void;
}

export default function NewDiagramOrLink({
  addDiagram,
}: NewDiagramOrLinkProps) {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);
  const [diagramInfo, setDiagramInfo] = useState<DiagramType>({
    diagramName: '',
    diagramUrl: '',
    description: '',
  });

  const handleClick = () => {
    addDiagram(diagramInfo);
    setVisible(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setVisible(true)}>
        {t('add-new-link')}
      </Button>
      <ModalSmWidth
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        appElementId="__next"
      >
        <ModalContentFitted>
          <ModalTitle>{t('add-new-diagram-or-link')}</ModalTitle>

          <TextInput
            labelText={t('diagram-name')}
            onBlur={(e) =>
              setDiagramInfo({ ...diagramInfo, diagramName: e.target.value })
            }
          />
          <TextInput
            labelText={t('diagram-url')}
            onBlur={(e) =>
              setDiagramInfo({ ...diagramInfo, diagramUrl: e.target.value })
            }
          />
          <Textarea
            labelText={t('description')}
            optionalText={t('optional')}
            visualPlaceholder={t('sources-placeholder')}
            onBlur={(e) =>
              setDiagramInfo({ ...diagramInfo, description: e.target.value })
            }
            fullWidth
          />
        </ModalContentFitted>
        <ModalFooter>
          <Button onClick={() => handleClick()}>{t('save')}</Button>
          <Button onClick={() => setVisible(false)} variant="secondary">
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </ModalSmWidth>
    </>
  );
}
