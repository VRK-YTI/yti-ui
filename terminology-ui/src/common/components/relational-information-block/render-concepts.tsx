import {
  Checkbox,
  Expander,
  ExpanderGroup,
  ExpanderTitle,
} from 'suomifi-ui-components';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import { useTranslation } from 'next-i18next';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { useEffect, useState } from 'react';
import RenderExpanderContent from './render-expander-content';
import { useRouter } from 'next/router';
import { RelationInfoType } from '@app/modules/edit-concept/new-concept.types';
import { ConceptResponseObject } from '@app/common/interfaces/interfaces-v2';

interface RenderConceptsProps {
  concepts?: ConceptResponseObject[];
  chosen: ConceptResponseObject[] | RelationInfoType[];
  setChosen: (value: ConceptResponseObject[] | RelationInfoType[]) => void;
}

export default function RenderConcepts({
  concepts,
  chosen,
  setChosen,
}: RenderConceptsProps) {
  const { t, i18n } = useTranslation('admin');
  const { query } = useRouter();
  const { isSmall } = useBreakpoints();
  const [expandersOpen, setExpandersOpen] = useState(
    concepts?.map((c) => [c.id, false])
  );

  useEffect(() => {
    setExpandersOpen(concepts?.map((c) => [c.id, false]));
  }, [concepts]);

  const handleCheckbox = (
    e: { checkboxState: boolean },
    concept: ConceptResponseObject
  ) => {
    if (e.checkboxState) {
      setChosen([...(chosen as ConceptResponseObject[]), concept]);
    } else {
      setChosen(
        (chosen as ConceptResponseObject[]).filter(
          (chose) => chose.id !== concept.id
        )
      );
    }
  };

  if (!concepts) {
    return null;
  }

  return (
    <div id="concept-result-block" style={{ width: '100%', marginTop: '12px' }}>
      <ExpanderGroup openAllText="" closeAllText="" showToggleAllButton={false}>
        {concepts
          ?.filter((concept) => concept.id !== query.conceptId)
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
                  toggleButtonAriaDescribedBy={`concept-result-checkbox-${concept.id}`}
                  toggleButtonAriaLabel={t('additional-information')}
                >
                  <Checkbox
                    hintText={`TODO: terminology label - ${translateStatus(
                      concept.status ?? 'DRAFT',
                      t
                    )}`}
                    onClick={(e) => handleCheckbox(e, concept)}
                    checked={chosen.some((chose) => chose.id === concept.id)}
                    className="concept-checkbox"
                    variant={isSmall ? 'large' : 'small'}
                    id={`concept-result-checkbox-${concept.id}`}
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
                  terminologyId={concept.terminology?.prefix}
                  conceptId={concept.identifier}
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
