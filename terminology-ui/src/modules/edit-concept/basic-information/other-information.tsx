import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { ExpanderTitleButton, TextInput } from 'suomifi-ui-components';
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

  const handleChange = () => {
    update({
      key: infoKey,
      value: {
        conceptClass: conceptClass,
        wordClass: '',
      },
    });
  };

  return (
    <ConceptExpander id="other-information-expander">
      <ExpanderTitleButton asHeading="h3">
        {t('concept-other-information')}
      </ExpanderTitleButton>
      <ExpanderContentFitted>
        <TextInput
          labelText={t('concept-class')}
          optionalText={t('optional')}
          onChange={(e) => setConceptClass(e?.toString().trim())}
          value={conceptClass}
          onBlur={() => handleChange()}
          maxLength={TEXT_INPUT_MAX}
          id="concept-class-input"
        />
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
