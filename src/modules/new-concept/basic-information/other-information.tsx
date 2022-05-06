import { useGetGroupsQuery } from '@app/common/components/terminology-search/terminology-search.slice';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { ExpanderTitleButton, SingleSelect } from 'suomifi-ui-components';
import { BasicInfoUpdate } from './concept-basic-information-interface';
import {
  ConceptExpander,
  ExpanderContentFitted,
} from './concept-basic-information.styles';

interface OtherInformationProps {
  infoKey: string;
  update: (object: BasicInfoUpdate) => void;
}

export default function OtherInformation({
  infoKey,
  update,
}: OtherInformationProps) {
  const { t, i18n } = useTranslation('admin');
  const { data: groups } = useGetGroupsQuery(i18n.language);
  const [conceptClass, setConceptClass] = useState<string | null>();
  const [wordClass, setWordClass] = useState<string | null>();

  const handleChange = () => {
    update({
      key: infoKey,
      value: {
        conceptClass: conceptClass,
        wordClass: wordClass,
      },
    });
  };

  const groupsFormatted =
    groups?.map((group) => {
      return {
        uniqueItemId: group.id,
        labelText: group.properties.prefLabel.value,
      };
    }) ?? [];

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
        <SingleSelect
          labelText={t('concept-class')}
          optionalText={t('optional')}
          clearButtonLabel={t('clear-button-label')}
          ariaOptionsAvailableText={t('concept-class-available')}
          items={groupsFormatted}
          noItemsText={t('concept-class-no-items')}
          onItemSelect={(e) => setConceptClass(e)}
          onBlur={() => handleChange()}
        />

        <SingleSelect
          labelText={t('word-class')}
          optionalText={t('optional')}
          hintText={t('word-class-hint')}
          clearButtonLabel={t('clear-button-label')}
          ariaOptionsAvailableText={t('word-class-available')}
          items={partOfSpeech}
          noItemsText={t('word-class-no-items')}
          onItemSelect={(e) => setWordClass(e)}
          onBlur={() => handleChange()}
        />
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
