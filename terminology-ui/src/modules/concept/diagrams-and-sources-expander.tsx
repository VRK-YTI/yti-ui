import { useTranslation } from 'next-i18next';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  ExternalLink,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { Concept } from '@app/common/interfaces/concept.interface';
import { PropertyList } from './concept.styles';
import Link from 'next/link';
import getDiagramValues from '@app/common/utils/get-diagram-values';

export function hasDiagramsAndSources(concept?: Concept, language?: string) {
  const rest = { language, fallbackLanguage: 'fi' };

  if (getPropertyValue({ property: concept?.properties.source, ...rest })) {
    return true;
  }

  if (
    getPropertyValue({ property: concept?.properties.externalLink, ...rest })
  ) {
    return true;
  }

  return false;
}

function hasDiagrams(concept?: Concept, language?: string) {
  if (
    getPropertyValue({ property: concept?.properties.externalLink, language })
  ) {
    return true;
  }
  return false;
}

function hasSources(concept?: Concept, language?: string) {
  if (getPropertyValue({ property: concept?.properties.source, language })) {
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
        {hasDiagrams(concept, i18n.language) && (
          <BasicBlock title={t('field-concept-diagrams')}>
            <PropertyList $smBot>
              {concept?.properties.externalLink?.map((l, idx) => {
                const link = getDiagramValues(l.value);
                return (
                  <li key={`diagrams-${idx}`}>
                    <Link href={link.url} passHref legacyBehavior>
                      <ExternalLink
                        href=""
                        labelNewWindow=""
                        style={{ fontSize: '16px' }}
                      >
                        {link.name}
                      </ExternalLink>
                    </Link>
                    {link.description !== '' && (
                      <>
                        <br />
                        {link.description}
                      </>
                    )}
                  </li>
                );
              })}
            </PropertyList>
          </BasicBlock>
        )}

        {hasSources(concept, i18n.language) && (
          <BasicBlock title={t('field-sources')}>
            <PropertyList>
              {concept?.properties.source?.map((source) => (
                <li key={source.value}>{source.value}</li>
              ))}
            </PropertyList>
          </BasicBlock>
        )}
      </ExpanderContent>
    </Expander>
  );
}
