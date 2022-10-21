import {
  Checkbox,
  Expander,
  ExpanderGroup,
  ExpanderTitle,
} from 'suomifi-ui-components';
import SanitizedTextContent from '@app/common/components/sanitized-text-content';
import { useTranslation } from 'next-i18next';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import getPrefLabel from '@app/common/utils/get-preflabel';
import { Concepts } from '@app/common/interfaces/concepts.interface';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useBreakpoints } from '../media-query/media-query-context';
import { useEffect, useState } from 'react';
import RenderExpanderContent from './render-expander-content';
import { useRouter } from 'next/router';

interface RenderConceptsProps {
  concepts?: Concepts[];
  chosen: Concepts[];
  setChosen: (value: Concepts[]) => void;
}

export default function RenderConcepts({
  concepts,
  chosen,
  setChosen,
}: RenderConceptsProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const { query } = useRouter();
  const [expandersOpen, setExpandersOpen] = useState(
    concepts?.map((c) => [c.id, false])
  );

  useEffect(() => {
    setExpandersOpen(concepts?.map((c) => [c.id, false]));
  }, [concepts]);

  const handleCheckbox = (e: { checkboxState: boolean }, concept: Concepts) => {
    if (e.checkboxState) {
      setChosen([...chosen, concept]);
    } else {
      setChosen(chosen.filter((chose) => chose.id !== concept.id));
    }
  };

  if (!concepts) {
    return null;
  }

  return (
    <div id="concept-result-block" style={{ width: '100%' }}>
      <ExpanderGroup openAllText="" closeAllText="">
        {concepts
          ?.filter((c) => c.id !== query.conceptId)
          .map((concept) => {
            return (
              <Expander
                key={concept.id}
                className="concept-result-item"
                onOpenChange={(open) => {
                  setExpandersOpen(
                    expandersOpen?.map((c) => {
                      if (c[0] === concept.id) {
                        return [c[0], open];
                      }
                      return c;
                    })
                  );
                }}
              >
                <ExpanderTitle
                  ariaCloseText={t('open-concept-expander')}
                  ariaOpenText={t('close-concept-expander')}
                  toggleButtonAriaDescribedBy=""
                >
                  <Checkbox
                    hintText={`${getPrefLabel({
                      prefLabels: concept.terminology.label,
                      lang: i18n.language,
                    })} - ${translateStatus(concept.status ?? 'DRAFT', t)}`}
                    onClick={(e) => handleCheckbox(e, concept)}
                    checked={chosen.some((chose) => chose.id === concept.id)}
                    className="concept-checkbox"
                    variant={isSmall ? 'large' : 'small'}
                  >
                    <SanitizedTextContent
                      text={
                        concept.label
                          ? getPropertyValue({
                              property: Object.keys(concept.label).map(
                                (key) => {
                                  const obj = {
                                    lang: key,
                                    value: concept.label[key],
                                    regex: '',
                                  };
                                  return obj;
                                }
                              ),
                              language: i18n.language,
                            }) ??
                            concept.label[i18n.language] ??
                            concept.label.fi
                          : t('concept-label-undefined', { ns: 'common' })
                      }
                    />
                  </Checkbox>
                </ExpanderTitle>

                <RenderExpanderContent
                  terminologyId={concept.terminology.id}
                  conceptId={concept.id}
                  isOpen={
                    (expandersOpen?.filter(
                      (c) => c[0] === concept.id
                    )?.[0]?.[1] as boolean) ?? false
                  }
                />
              </Expander>
            );
          })}
      </ExpanderGroup>
    </div>
  );
}
