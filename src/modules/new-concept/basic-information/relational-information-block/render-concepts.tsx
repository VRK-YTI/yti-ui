import {
  Checkbox,
  Expander,
  ExpanderContent,
  ExpanderTitle,
} from 'suomifi-ui-components';
import { ResultList } from './relation-information-block.styles';
import SanitizedTextContent from '@app/common/components/sanitized-text-content';
import { useTranslation } from 'next-i18next';
import {
  useGetVocabulariesQuery,
  useGetVocabularyQuery,
} from '@app/common/components/vocabulary/vocabulary.slice';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { useGetConceptQuery } from '@app/common/components/concept/concept.slice';
import Separator from '@app/common/components/separator';

export default function RenderConcepts(
  result,
  chosen,
  setChosen,
  terminologyId,
  fromOther
) {
  const { t } = useTranslation('common');
  const { data: terminology } = useGetVocabularyQuery(terminologyId);
  const { data: vocabularies } = useGetVocabulariesQuery(null);

  const handleCheckbox = (e: any, concept: any) => {
    if (e.checkboxState) {
      setChosen([...chosen, concept]);
    } else {
      setChosen(chosen.filter((chose) => chose.id !== concept.id));
    }
  };

  return (
    <>
      <ResultList>
        {result.data?.concepts?.map((concept, idx) => {
          const conceptsVocabulary = vocabularies.filter(
            (vocabulary) => vocabulary.type.graph.id === concept.terminology.id
          );
          const property =
            fromOther && conceptsVocabulary.length > 0
              ? conceptsVocabulary[0].properties.prefLabel
              : terminology?.properties.prefLabel;

          const organizationTitle = getPropertyValue({
            fallbackLanguage: 'fi',
            property: property,
          });

          return (
            <li key={`${concept.id}-${idx}`}>
              <Expander>
                <ExpanderTitle
                  ariaCloseText="Sulje"
                  ariaOpenText="Avaa"
                  toggleButtonAriaDescribedBy=""
                >
                  <Checkbox
                    hintText={`${organizationTitle} · ${t(concept.status)} `}
                    onClick={(e) => handleCheckbox(e, concept)}
                    checked={chosen.some((chose) => chose.id === concept.id)}
                  >
                    <SanitizedTextContent text={concept.label.fi} />
                  </Checkbox>
                </ExpanderTitle>

                <RenderExpanderContent
                  terminologyId={concept.terminology.id}
                  conceptId={concept.id}
                />
              </Expander>
            </li>
          );
        })}
      </ResultList>
    </>
  );

  function RenderExpanderContent({ terminologyId, conceptId }) {
    const { data: concept } = useGetConceptQuery({
      terminologyId: terminologyId,
      conceptId: conceptId,
    });

    const { data: terminology } = useGetVocabularyQuery(terminologyId);

    return (
      <ExpanderContent>
        <div>
          Suositettavat termit{' '}
          {getPropertyValue({
            property:
              concept?.references.prefLabelXl?.[0].properties?.prefLabel,
            fallbackLanguage: 'fi',
          })}
        </div>
        <div>
          Määritelmä{' '}
          {getPropertyValue({
            property: concept?.properties.definition,
            fallbackLanguage: 'fi',
          })}
        </div>
        <Separator />
        <div>
          Vastuuorganisaatio{' '}
          {getPropertyValue({
            property:
              terminology?.references.contributor?.[0].properties.prefLabel,
            fallbackLanguage: 'fi',
          })}
        </div>
        <div>Muut sisällöntuottajat </div>
        <div>
          Muokattu viimeksi {concept?.lastModifiedDate},{' '}
          {concept?.lastModifiedBy}
        </div>
      </ExpanderContent>
    );
  }
}
