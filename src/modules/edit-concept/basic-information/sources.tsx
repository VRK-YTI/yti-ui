import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Text } from 'suomifi-ui-components';
import { v4 } from 'uuid';
import {
  ColoredBlock,
  FullwidthTextarea,
  ItemsList,
} from './concept-diagrams-and-sources.styles';

interface SourcesType {
  description: string;
  id: string;
}

export default function Sources() {
  const { t } = useTranslation('admin');
  const [sources, setSources] = useState<SourcesType[]>([]);

  const handleAddSource = () => {
    setSources([
      ...sources,
      {
        description: '',
        id: v4(),
      },
    ]);
  };

  const handleRemoveSource = (id: string) => {
    setSources(sources.filter((d) => d.id !== id));
  };

  return (
    <>
      <ItemsList>
        {sources.map((source) => (
          <li key={source.id}>
            <ColoredBlock>
              <div>
                <Text variant="bold">{t('source', { count: 1 })}</Text>
                <Button
                  variant="secondaryNoBorder"
                  icon="remove"
                  onClick={() => handleRemoveSource(source.id)}
                >
                  {t('remove')}
                </Button>
              </div>

              <FullwidthTextarea labelText={t('sources-hint-text-concept')} />
            </ColoredBlock>
          </li>
        ))}
      </ItemsList>

      <Button variant="secondary" onClick={() => handleAddSource()}>
        {t('add-new-link')}
      </Button>
    </>
  );
}
