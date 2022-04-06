import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { MultiSelectData, Paragraph, Text } from 'suomifi-ui-components';
import { TerminologyName } from './language-selector';
import {
  LangBlock,
  TextareaSmBot,
  LangTextInput,
} from './new-terminology.styles';

interface LanguageBlockProps {
  lang: MultiSelectData;
  isSmall: boolean;
  terminologyNames: TerminologyName[];
  setTerminologyNames: (value: TerminologyName[]) => void;
  userPosted: boolean;
}

export default function LanguageBlock({
  lang,
  isSmall,
  terminologyNames,
  setTerminologyNames,
  userPosted,
}: LanguageBlockProps) {
  const { t } = useTranslation('admin');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'default' | 'error'>(
    userPosted ? 'error' : 'default'
  );

  useEffect(() => {
    setTerminologyNames([
      ...terminologyNames,
      {
        lang: lang.uniqueItemId,
        name: '',
        description: '',
      },
    ]);
  }, []);

  const handleBlur = () => {
    if (terminologyNames?.some((tn) => tn.lang === lang.uniqueItemId)) {
      const newTerminologyNames = terminologyNames.map((tn) => {
        if (tn.lang === lang.uniqueItemId) {
          if (name === '') {
            setStatus('error');
          } else {
            setStatus('default');
          }
          return {
            lang: lang.uniqueItemId,
            name: name,
            description: description,
          };
        } else {
          setStatus('default');
          return tn;
        }
      });

      setTerminologyNames(newTerminologyNames);
    }
  };

  return (
    <LangBlock padding="m" onBlur={() => handleBlur()}>
      <Paragraph marginBottomSpacing="m">
        <Text variant="bold">{lang.labelText}</Text>
      </Paragraph>
      <LangTextInput
        labelText={t('terminology-name')}
        visualPlaceholder={t('terminology-name-placeholder')}
        isSmall={isSmall}
        onChange={(e) => setName(e as string)}
        status={status}
        statusText={status === 'error' ? t('terminology-name-error') : ''}
      />
      <TextareaSmBot
        labelText={t('terminology-description')}
        hintText={t('terminology-description-hint')}
        visualPlaceholder={t('terminology-description-placeholder')}
        onChange={(e) => setDescription(e.target.value)}
      />
    </LangBlock>
  );
}
