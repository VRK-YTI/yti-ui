import { useBreakpoints } from '@app/common/components/media-query/media-query-context';
import { TEXT_AREA_MAX, TEXT_INPUT_MAX } from '@app/common/utils/constants';
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
  const { isSmall } = useBreakpoints();
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
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContentFitted>
          <ModalTitle>{t('add-new-diagram-or-link')}</ModalTitle>

          <TextInput
            labelText={t('diagram-name')}
            onBlur={(e) =>
              setDiagramInfo({ ...diagramInfo, diagramName: e.target.value })
            }
            maxLength={TEXT_INPUT_MAX}
            id="diagram-name-input"
          />
          <TextInput
            labelText={t('diagram-url')}
            onBlur={(e) =>
              setDiagramInfo({ ...diagramInfo, diagramUrl: e.target.value })
            }
            maxLength={TEXT_INPUT_MAX}
            id="diagram-url-input"
          />
          <Textarea
            labelText={t('description')}
            optionalText={t('optional')}
            visualPlaceholder={t('sources-placeholder')}
            onBlur={(e) =>
              setDiagramInfo({ ...diagramInfo, description: e.target.value })
            }
            fullWidth
            id="description-input"
            maxLength={TEXT_AREA_MAX}
          />
        </ModalContentFitted>
        <ModalFooter>
          <Button onClick={() => handleClick()} id="submit-button">
            {t('save')}
          </Button>
          <Button
            onClick={() => setVisible(false)}
            variant="secondary"
            id="cancel-button"
          >
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </ModalSmWidth>
    </>
  );
}
