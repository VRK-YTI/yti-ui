import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Text, TextInput } from 'suomifi-ui-components';
import { v4 } from 'uuid';
import { ColoredBlock, FullwidthTextarea, ItemsList } from './concept-diagrams-and-sources.styles';

interface DiagramType {
  name: string;
  link: string;
  description: string;
  id: string;
}

export default function Diagrams() {
  const { t } = useTranslation('admin');
  const [diagrams, setDiagrams] = useState<DiagramType[]>([]);

  const handleAddDiagram = () => {
    setDiagrams([...diagrams,
    {
      name: '',
      link: '',
      description: '',
      id: v4(),
    }
    ]);
  };

  const handleRemoveDiagram = (id: string) => {
    setDiagrams(diagrams.filter(d => d.id !== id));
  };

  return (
    <>
      <ItemsList>
        {diagrams.map((diagram) => (
          <li key={diagram.id}>
            <ColoredBlock>
              <div>
                <Text variant='bold'>
                  {t('concept-diagram-or-link')}
                </Text>
                <Button
                  variant='secondaryNoBorder'
                  icon='remove'
                  onClick={() => handleRemoveDiagram(diagram.id)}
                >
                  {t('remove')}
                </Button>
              </div>

              <TextInput
                labelText={t('diagram-name')}
              />

              <TextInput
                labelText={t('diagram-url')}
              />

              <FullwidthTextarea
                labelText={t('description')}
                optionalText={t('optional')}
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
};
