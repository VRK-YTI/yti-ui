import { useTranslation } from 'next-i18next';
import { Button, Text, TextInput } from 'suomifi-ui-components';
import { v4 } from 'uuid';
import { DiagramType, ListType } from '../new-concept.types';
import {
  ColoredBlock,
  FullwidthTextarea,
  ItemsList,
} from './concept-diagrams-and-sources.styles';

interface DiagramsProps {
  diagrams: DiagramType[];
  setDiagrams: (value: DiagramType[]) => void;
  handleRemove: (s?: ListType[], d?: DiagramType[]) => void;
  isError: boolean;
}

export default function Diagrams({
  diagrams,
  setDiagrams,
  handleRemove,
  isError,
}: DiagramsProps) {
  const { t } = useTranslation('admin');

  const handleAddDiagram = () => {
    setDiagrams([
      ...diagrams,
      {
        name: '',
        url: '',
        description: '',
        id: v4(),
      },
    ]);
  };

  const handleRemoveDiagram = (id: string) => {
    handleRemove(
      undefined,
      diagrams.filter((d) => d.id !== id)
    );
  };

  const handleUpdate = (id: string, key: string, value: string) => {
    setDiagrams(
      diagrams.map((d) => {
        if (d.id !== id) {
          return d;
        } else {
          return { ...d, [key]: value };
        }
      })
    );
  };

  return (
    <>
      <ItemsList>
        {diagrams.map((diagram) => (
          <li key={diagram.id}>
            <ColoredBlock>
              <div>
                <Text variant="bold">{t('concept-diagram-or-link')}</Text>
                <Button
                  variant="secondaryNoBorder"
                  icon="remove"
                  onClick={() => handleRemoveDiagram(diagram.id)}
                >
                  {t('remove')}
                </Button>
              </div>

              <TextInput
                labelText={t('diagram-name')}
                defaultValue={diagram.name}
                onChange={(e) =>
                  handleUpdate(diagram.id, 'name', e?.toString() ?? '')
                }
                status={isError && diagram.name === '' ? 'error' : 'default'}
              />

              <TextInput
                labelText={t('diagram-url')}
                defaultValue={diagram.url}
                onChange={(e) =>
                  handleUpdate(diagram.id, 'url', e?.toString() ?? '')
                }
                status={
                  isError && (diagram.url === '' || !diagram.url.includes('.'))
                    ? 'error'
                    : 'default'
                }
              />

              <FullwidthTextarea
                labelText={t('description')}
                optionalText={t('optional')}
                defaultValue={diagram.description}
                onChange={(e) =>
                  handleUpdate(diagram.id, 'description', e.target.value)
                }
              />
            </ColoredBlock>
          </li>
        ))}
      </ItemsList>

      <Button variant="secondary" onClick={() => handleAddDiagram()}>
        {t('add-new-link')}
      </Button>
    </>
  );
}
