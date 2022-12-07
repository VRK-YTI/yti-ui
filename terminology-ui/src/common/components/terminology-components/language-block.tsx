import { DEFINITION_MAX, TEXT_INPUT_MAX } from '@app/common/utils/constants';
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
  disabled?: boolean;
}

export default function LanguageBlock({
  lang,
  isSmall,
  handleUpdate,
  userPosted,
  id,
  initialData,
  disabled,
}: LanguageBlockProps) {
  const { t } = useTranslation('admin');
  const [name, setName] = useState(initialData ? initialData.name : '');
  const [description, setDescription] = useState(
    initialData ? initialData.description : ''
  );

  const handleBlur = () => {
    handleUpdate(id, name, description);
  };

  return (
    <LangBlock padding="m" className="language-block" $isSmall={isSmall}>
      <Paragraph marginBottomSpacing="m">
        <Text variant="bold">{lang.labelText}</Text>
      </Paragraph>
      <LangTextInput
        labelText={t('terminology-name')}
        visualPlaceholder={t('terminology-name-placeholder')}
        $isSmall={isSmall}
        onChange={(e) => setName(e?.toString().trim() ?? '')}
        onBlur={handleBlur}
        status={userPosted && name.length < 1 ? 'error' : 'default'}
        statusText={
          userPosted && name.length < 1 ? t('terminology-name-error') : ''
        }
        defaultValue={name}
        maxLength={TEXT_INPUT_MAX}
        className="terminology-name-input"
        disabled={disabled}
      />
      <TextareaSmBot
        labelText={t('terminology-description')}
        hintText={t('terminology-description-hint')}
        visualPlaceholder={t('terminology-description-placeholder')}
        onChange={(e) => setDescription(e.target.value.trim())}
        onBlur={handleBlur}
        maxLength={DEFINITION_MAX}
        defaultValue={description}
        className="terminology-description-input"
        disabled={disabled}
      />
    </LangBlock>
  );
}
