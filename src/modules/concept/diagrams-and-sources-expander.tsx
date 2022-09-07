import { useTranslation } from 'next-i18next';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import { BasicBlock, PropertyBlock } from '@app/common/components/block';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { Concept } from '@app/common/interfaces/concept.interface';
import { PropertyList } from './concept.styles';

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

export default function DiagramsAndSourcesExpander({
  concept,
}: DiagramsAndSourcesExpanderProps) {
  const { t, i18n } = useTranslation('concept');

  if (!hasDiagramsAndSources(concept, i18n.language)) {
    return null;
  }

  return (
    <Expander id="diagrams-and-sources-expander">
      <ExpanderTitleButton>
        {t('section-concept-diagrams-and-sources')}
      </ExpanderTitleButton>
      <ExpanderContent>
        <PropertyBlock
          title={t('field-concept-diagrams')}
          property={undefined}
        />
        <BasicBlock title={t('field-sources')}>
          <PropertyList>
            {concept?.properties.source?.map((source) => (
              <li key={source.value}>{source.value}</li>
            ))}
          </PropertyList>
        </BasicBlock>
      </ExpanderContent>
    </Expander>
  );
}
