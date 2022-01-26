import { useTranslation } from 'next-i18next';
import { Expander, ExpanderContent, ExpanderTitleButton } from 'suomifi-ui-components';
import { PropertyBlock } from '../../common/components/block';
import { getPropertyValue } from '../../common/components/property-value/get-property-value';
import { Concept } from '../../common/interfaces/concept.interface';

export function hasDiagramsAndSources(concept?: Concept, language?: string) {
  const rest = { language, fallbackLanguage: 'fi' };

  if (getPropertyValue({ property: concept?.properties.source, ...rest })) {
    return true;
  }

  return false;
}

export interface DiagramsAndSourcesExpanderProps {
  concept?: Concept;
}

export default function DiagramsAndSourcesExpander({ concept }: DiagramsAndSourcesExpanderProps) {
  const { t, i18n } = useTranslation('concept');

  if (! hasDiagramsAndSources(concept, i18n.language)) {
    return null;
  }

  return (
    <Expander>
      <ExpanderTitleButton>{t('section-concept-diagrams-and-sources')}</ExpanderTitleButton>
      <ExpanderContent>
        <PropertyBlock
          title={t('field-concept-diagrams')}
          property={undefined}
          fallbackLanguage="fi"
        />
        <PropertyBlock
          title={t('field-sources')}
          property={concept?.properties.source}
          fallbackLanguage="fi"
        />
      </ExpanderContent>
    </Expander>
  );
}
