import { useTranslation } from 'next-i18next';
import { ExpanderTitleButton, SingleSelect } from 'suomifi-ui-components';
import { ConceptExpander, ExpanderContentFitted } from './concept-basic-information.styles';

export default function OtherInformation() {
  const { t } = useTranslation('admin');

  const items = [
    {
      uniqueItemId: '123',
      labelText: 'Koulutus'
    },
    {
      uniqueItemId: '456',
      labelText: 'Asuminen'
    }
  ];

  const items2 = [
    {
      uniqueItemId: 'adjective',
      labelText: 'Adjektiivi'
    },
    {
      uniqueItemId: 'verb',
      labelText: 'Verbi'
    }
  ];

  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading="h3">
        {t('concept-other-information')}
      </ExpanderTitleButton>
      <ExpanderContentFitted>
        <SingleSelect
          labelText='Käsitteen luokka'
          optionalText={t('optional')}
          clearButtonLabel='Tyhjennä valinnat'
          ariaOptionsAvailableText='Vaihtoehtoja saatavilla'
          items={items}
          noItemsText='Luokkia ei saatavilla'
        />

        <SingleSelect
          labelText='Sanaluokka'
          optionalText={t('optional')}
          hintText='Merkitään vain jos sanaluokka on adjektiivi tai verbi'
          clearButtonLabel='Tyhjennä valinnat'
          ariaOptionsAvailableText='Vaihtoehtoja saatavilla'
          items={items2}
          noItemsText='Luokkia ei saatavilla'
        />

      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
