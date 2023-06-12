import { useTranslation } from 'next-i18next';
import { Button, IconRemove, Text } from 'suomifi-ui-components';
import { v4 } from 'uuid';
import { DiagramType, ListType } from '../new-concept.types';
import {
  ColoredBlock,
  FullwidthTextarea,
  ItemsList,
} from './concept-diagrams-and-sources.styles';

interface SourcesProps {
  sources: ListType[];
  setSources: (value: ListType[]) => void;
  handleRemove: (s?: ListType[], d?: DiagramType[]) => void;
  isError: boolean;
}

export default function Sources({
  sources,
  setSources,
  handleRemove,
  isError,
}: SourcesProps) {
  const { t } = useTranslation('admin');

  const handleAddSource = () => {
    setSources([
      ...sources,
      {
        value: '',
        id: v4(),
      },
    ]);
  };

  const handleRemoveSource = (id: string) => {
    handleRemove(sources.filter((d) => d.id !== id));
  };

  const handleChange = (id: string, value: string) => {
    setSources(
      sources.map((source) => {
        if (source.id !== id) {
          return source;
        } else {
          return { ...source, value: value };
        }
      })
    );
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
                  icon={<IconRemove />}
                  onClick={() => handleRemoveSource(source.id)}
                >
                  {t('remove')}
                </Button>
              </div>

              <FullwidthTextarea
                labelText={t('sources-hint-text-concept')}
                onChange={(e) => handleChange(source.id, e.target.value)}
                defaultValue={source.value}
                status={isError && source.value === '' ? 'error' : 'default'}
              />
            </ColoredBlock>
          </li>
        ))}
      </ItemsList>

      <Button variant="secondary" onClick={() => handleAddSource()}>
        {t('add-new-source')}
      </Button>
    </>
  );
}
