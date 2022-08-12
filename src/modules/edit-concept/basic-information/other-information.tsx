import { TEXT_INPUT_MAX } from '@app/common/utils/constants';
import { translateWordClass } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  ExpanderTitleButton,
  SingleSelect,
  TextInput,
} from 'suomifi-ui-components';
import { BasicInfoUpdate } from './concept-basic-information';
import {
  ConceptExpander,
  ExpanderContentFitted,
} from './concept-basic-information.styles';

interface OtherInformationProps {
  infoKey: string;
  update: (object: BasicInfoUpdate) => void;
  initialValues?: {
    conceptClass: string;
    wordClass: string;
  };
}

export default function OtherInformation({
  infoKey,
  update,
  initialValues,
}: OtherInformationProps) {
  const { t } = useTranslation('admin');
  const [conceptClass, setConceptClass] = useState<string | undefined>(
    initialValues?.conceptClass
  );
  const [wordClass, setWordClass] = useState<typeof partOfSpeech[0] | null>(
    initialValues?.wordClass
      ? {
          uniqueItemId: initialValues.wordClass,
          labelText: translateWordClass(initialValues.wordClass, t),
        }
      : null
  );

  const handleChange = () => {
    update({
      key: infoKey,
      value: {
        conceptClass: conceptClass,
        wordClass: wordClass?.uniqueItemId ?? '',
      },
    });
  };

  const partOfSpeech = [
    {
      uniqueItemId: 'adjective',
      labelText: t('adjective'),
    },
    {
      uniqueItemId: 'verb',
      labelText: t('verb'),
    },
  ];

  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading="h3">
        {t('concept-other-information')}
      </ExpanderTitleButton>
      <ExpanderContentFitted>
        <TextInput
          labelText={t('concept-class')}
          optionalText={t('optional')}
          onChange={(e) => setConceptClass(e?.toString())}
          value={conceptClass}
          onBlur={() => handleChange()}
          maxLength={TEXT_INPUT_MAX}
        />

        <SingleSelect
          labelText={t('word-class')}
          optionalText={t('optional')}
          hintText={t('word-class-hint')}
          clearButtonLabel={t('clear-button-label')}
          ariaOptionsAvailableText={t('word-class-available')}
          items={partOfSpeech}
          selectedItem={wordClass ?? undefined}
          noItemsText={t('word-class-no-items')}
          onItemSelectionChange={(e) => setWordClass(e)}
          onBlur={() => handleChange()}
        />
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
