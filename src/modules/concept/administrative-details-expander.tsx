import { useTranslation } from 'next-i18next';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import { PropertyBlock } from '../../common/components/block';
import { getPropertyValue } from '../../common/components/property-value/get-property-value';
import { Concept } from '../../common/interfaces/concept.interface';

export function hasAdministrativeDetails(concept?: Concept, language?: string) {
  const rest = { language, fallbackLanguage: 'fi' };

  if (getPropertyValue({ property: concept?.properties.changeNote, ...rest })) {
    return true;
  }

  if (
    getPropertyValue({ property: concept?.properties.historyNote, ...rest })
  ) {
    return true;
  }

  if (
    getPropertyValue({ property: concept?.properties.editorialNote, ...rest })
  ) {
    return true;
  }

  if (getPropertyValue({ property: concept?.properties.notation, ...rest })) {
    return true;
  }

  return false;
}

export interface AdministrativeDetailsExpanderProps {
  concept?: Concept;
}

export default function AdministrativeDetailsExpander({
  concept,
}: AdministrativeDetailsExpanderProps) {
  const { t, i18n } = useTranslation('concept');

  if (!hasAdministrativeDetails(concept, i18n.language)) {
    return null;
  }

  return (
    <Expander>
      <ExpanderTitleButton>
        {t('section-administrative-details')}
      </ExpanderTitleButton>
      <ExpanderContent>
        <PropertyBlock
          title={t('field-change-note')}
          property={concept?.properties.changeNote}
          fallbackLanguage="fi"
        />
        <PropertyBlock
          title={t('field-history-note')}
          property={concept?.properties.historyNote}
          fallbackLanguage="fi"
        />
        <PropertyBlock
          title={t('field-editorial-note')}
          property={concept?.properties.editorialNote}
          fallbackLanguage="fi"
        />
        <PropertyBlock
          title={t('field-notation')}
          property={concept?.properties.notation}
          fallbackLanguage="fi"
        />
      </ExpanderContent>
    </Expander>
  );
}
