import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { MultiSelectData, Paragraph, Text } from 'suomifi-ui-components';
import {
  LangBlock,
  TextareaSmBot,
  LangTextInput,
} from './terminology-components.styles';

interface LanguageBlockProps {
  lang: MultiSelectData;
  isSmall: boolean;
  handleUpdate: (id: string, value: string, description: string) => void;
  userPosted: boolean;
  id: string;
}

interface InfoUpdateProps {
  tName?: string;
  tDescription?: string;
}

export default function LanguageBlock({
  lang,
  isSmall,
  handleUpdate,
  userPosted,
  id,
}: LanguageBlockProps) {
  const { t } = useTranslation('admin');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'default' | 'error'>(
    userPosted ? 'error' : 'default'
  );

  const handleInfoUpdate = ({ tName, tDescription }: InfoUpdateProps) => {
    if (tName || tName === '') {
      setName(tName);
      return;
    }

    if (tDescription) {
      setDescription(tDescription);
      return;
    }

    handleBlur();
  };

  const handleBlur = () => {
    if (!name) {
      setStatus('error');
    } else {
      setStatus('default');
    }

    handleUpdate(id, name, description);
  };

  return (
    <LangBlock padding="m" onBlur={() => handleInfoUpdate({})}>
      <Paragraph marginBottomSpacing="m">
        <Text variant="bold">{lang.labelText}</Text>
      </Paragraph>
      <LangTextInput
        labelText={t('terminology-name')}
        visualPlaceholder={t('terminology-name-placeholder')}
        $isSmall={isSmall}
        onChange={(e) => handleInfoUpdate({ tName: e as string })}
        status={status}
        statusText={status === 'error' ? t('terminology-name-error') : ''}
      />
      <TextareaSmBot
        labelText={t('terminology-description')}
        hintText={t('terminology-description-hint')}
        visualPlaceholder={t('terminology-description-placeholder')}
        onChange={(e) => handleInfoUpdate({ tDescription: e.target.value })}
      />
    </LangBlock>
  );
}
