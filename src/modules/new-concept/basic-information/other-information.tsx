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
      labelText: 'adjektiivi',
    },
    {
      uniqueItemId: 'verb',
      labelText: 'verbi',
    },
  ];

  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading="h3">
        {t('concept-other-information')}
      </ExpanderTitleButton>
      <ExpanderContentFitted>
        <SingleSelect
          labelText="Käsitteen luokka"
          optionalText={t('optional')}
          clearButtonLabel="Tyhjennä valinnat"
          ariaOptionsAvailableText="Vaihtoehtoja saatavilla"
          items={groupsFormatted}
          noItemsText="Käsitten luokkia ei saatavilla"
        />

        <SingleSelect
          labelText="Sanaluokka"
          optionalText={t('optional')}
          hintText="Merkitään vain jos sanaluokka on adjektiivi tai verbi"
          clearButtonLabel="Tyhjennä valinnat"
          ariaOptionsAvailableText="Vaihtoehtoja saatavilla"
          items={partOfSpeech}
          noItemsText="Sanaluokkia ei saatavilla"
        />
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
