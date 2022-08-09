import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { MultiSelectData, Paragraph, Text } from 'suomifi-ui-components';
import { TerminologyName } from './language-selector';
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
  initialData?: TerminologyName;
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
  initialData,
}: LanguageBlockProps) {
  const { t } = useTranslation('admin');
  const [name, setName] = useState(initialData ? initialData.name : '');
  const [description, setDescription] = useState(initialData ? initialData.description : '');
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
        defaultValue={name}
      />
      <TextareaSmBot
        labelText={t('terminology-description')}
        hintText={t('terminology-description-hint')}
        visualPlaceholder={t('terminology-description-placeholder')}
        onChange={(e) => handleInfoUpdate({ tDescription: e.target.value })}
        defaultValue={description}
      />
    </LangBlock>
  );
}
