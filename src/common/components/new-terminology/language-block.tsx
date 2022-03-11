import { Dispatch, SetStateAction, useState } from 'react';
import { MultiSelectData, Paragraph, Text } from 'suomifi-ui-components';
import { TerminologyName } from './language-selector';
import { LangBlock, TextareaSmBot, LangTextInput } from './new-terminology.styles';

interface LanguageBlockProps {
  lang: MultiSelectData;
  isSmall: boolean;
  terminologyNames: TerminologyName[];
  setTerminologyNames: Dispatch<SetStateAction<TerminologyName[]>>;
}

export default function LanguageBlock({ lang, isSmall, terminologyNames, setTerminologyNames }: LanguageBlockProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'default' | 'error'>('default');

  const handleBlur = () => {
    if (terminologyNames?.some(tn => tn.lang === lang.uniqueItemId)) {
      const newTerminologyNames = terminologyNames.map(tn => {
        if (tn.lang === lang.uniqueItemId) {
          if (name === '') {
            setStatus('error');
          } else {
            setStatus('default');
          }
          return {
            lang: lang.uniqueItemId,
            name: name,
            description: description
          };
        } else {
          setStatus('default');
          return tn;
        }
      });

      setTerminologyNames(newTerminologyNames);
    } else {
      setTerminologyNames([
        ...terminologyNames,
        {
          lang: lang.uniqueItemId,
          name: name,
          description: description
        }
      ]);
    }
  };

  return (
    <LangBlock padding='m' onBlur={() => handleBlur()}>
      <Paragraph marginBottomSpacing='m'>
        <Text variant='bold'>{lang.labelText}</Text>
      </Paragraph>
      <LangTextInput
        labelText='Sanaston nimi'
        visualPlaceholder='Kirjoita otsikko'
        isSmall={isSmall}
        onChange={e => setName(e as string)}
        status={status}
        statusText={status === 'error' ? 'Sanaston nimi ei voi olla määrittämätön' : ''}
      />
      <TextareaSmBot
        labelText='Kuvaus (valinnainen)'
        hintText='Laaja kuvaus sanaston sisällöstä, kohderyhmästä, tms.'
        visualPlaceholder='Kirjoita kuvaus'
        onChange={e => setDescription(e.target.value)}
      />
    </LangBlock>
  );
}
