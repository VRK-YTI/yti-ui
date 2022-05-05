import { useGetGroupsQuery } from '@app/common/components/terminology-search/terminology-search.slice';
import { useTranslation } from 'next-i18next';
import { ExpanderTitleButton, SingleSelect } from 'suomifi-ui-components';
import {
  ConceptExpander,
  ExpanderContentFitted,
} from './concept-basic-information.styles';

export default function OtherInformation() {
  const { t, i18n } = useTranslation('admin');
  const { data: groups } = useGetGroupsQuery(i18n.language);

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
        />

        <SingleSelect
          labelText={t('word-class')}
          optionalText={t('optional')}
          hintText={t('word-class-hint')}
          clearButtonLabel={t('clear-button-label')}
          ariaOptionsAvailableText={t('word-class-available')}
          items={partOfSpeech}
          noItemsText={t('word-class-no-items')}
        />
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
