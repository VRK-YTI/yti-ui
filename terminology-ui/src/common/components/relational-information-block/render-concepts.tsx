import {
  Checkbox,
  Expander,
  ExpanderGroup,
  ExpanderTitle,
} from 'suomifi-ui-components';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import { useTranslation } from 'next-i18next';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { useEffect, useState } from 'react';
import RenderExpanderContent from './render-expander-content';
import { useRouter } from 'next/router';
import { RelationInfoType } from '@app/modules/edit-concept/new-concept.types';
import { ConceptResponseObject } from '@app/common/interfaces/interfaces-v2';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

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
                    hintText={`${getLanguageVersion({
                      data: concept.terminology.label,
                      lang: i18n.language,
                    })} - ${translateStatus(concept.status ?? 'DRAFT', t)}`}
                    onClick={(e) => handleCheckbox(e, concept)}
                    checked={chosen.some((chose) => chose.id === concept.id)}
                    className="concept-checkbox"
                    variant={isSmall ? 'large' : 'small'}
                    id={`concept-result-checkbox-${concept.id}`}
                  >
                    <SanitizedTextContent
                      text={getLanguageVersion({
                        data: concept.label,
                        lang: i18n.language,
                      })}
                    />
                  </Checkbox>
                </ExpanderTitle>

                <RenderExpanderContent
                  terminologyId={concept.terminology?.prefix}
                  concept={concept}
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
