import { useTranslation } from 'next-i18next';
import { Button, IconRemove, Text, TextInput } from 'suomifi-ui-components';
import { v4 } from 'uuid';
import { DiagramType, ListType } from '../new-concept.types';
import {
  ColoredBlock,
  FullwidthTextarea,
  ItemsList,
} from './concept-diagrams-and-sources.styles';
import { LocalizedValue } from '@app/common/interfaces/interfaces-v2';

interface DiagramsProps {
  diagrams: DiagramType[];
  setDiagrams: (value: DiagramType[]) => void;
  handleRemove: (s?: ListType[], d?: DiagramType[]) => void;
  isError: boolean;
  languages: string[];
}

export default function Diagrams({
  diagrams,
  setDiagrams,
  handleRemove,
  isError,
  languages,
}: DiagramsProps) {
  const { t } = useTranslation('admin');

  const handleAddDiagram = () => {
    setDiagrams([
      ...diagrams,
      {
        name: languages.reduce((names, l) => {
          names[l] = '';
          return names;
        }, {} as LocalizedValue),
        url: '',
        description: languages.reduce((desc, l) => {
          desc[l] = '';
          return desc;
        }, {} as LocalizedValue),
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

  const handleLocalizedUpdate = (
    id: string,
    key: 'name' | 'description',
    lang: string,
    value: string
  ) => {
    setDiagrams(
      diagrams.map((d) => {
        if (d.id !== id) {
          return d;
        } else {
          return { ...d, [key]: { ...d[key], [lang]: value } };
        }
      })
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
                  icon={<IconRemove />}
                  onClick={() => handleRemoveDiagram(diagram.id)}
                >
                  {t('remove')}
                </Button>
              </div>

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

              {languages.map((lang) => (
                <TextInput
                  key={`link-name-${lang}`}
                  labelText={`${t('diagram-name')}, ${lang}`}
                  defaultValue={diagram.name[lang]}
                  onChange={(e) =>
                    handleLocalizedUpdate(
                      diagram.id,
                      'name',
                      lang,
                      e?.toString() ?? ''
                    )
                  }
                  status={
                    isError && diagram.name[lang] === '' ? 'error' : 'default'
                  }
                />
              ))}

              {languages.map((lang) => (
                <FullwidthTextarea
                  key={`link-description-${lang}`}
                  labelText={`${t('description')}, ${lang}`}
                  optionalText={t('optional')}
                  defaultValue={diagram.description[lang]}
                  onChange={(e) =>
                    handleLocalizedUpdate(
                      diagram.id,
                      'description',
                      lang,
                      e.target.value ?? ''
                    )
                  }
                />
              ))}
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
