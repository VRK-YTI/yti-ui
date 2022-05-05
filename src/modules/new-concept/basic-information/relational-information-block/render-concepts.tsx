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
import {
  BasicBlock,
  MultilingualPropertyBlock,
  PropertyBlock,
} from '@app/common/components/block';
import FormattedDate from '@app/common/components/formatted-date';

export default function RenderConcepts(
  result,
  chosen,
  setChosen,
  terminologyId,
  fromOther
) {
  const { t } = useTranslation('admin');
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
                  ariaCloseText={t('open-concept-expander')}
                  ariaOpenText={t('close-concept-expander')}
                  toggleButtonAriaDescribedBy=""
                >
                  <Checkbox
                    hintText={`${organizationTitle} - ${t(concept.status, {
                      ns: 'common',
                    })}`}
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
    const { t } = useTranslation('admin');
    const { data: concept } = useGetConceptQuery({
      terminologyId: terminologyId,
      conceptId: conceptId,
    });

    const { data: terminology } = useGetVocabularyQuery(terminologyId);

    return (
      <ExpanderContent>
        <MultilingualPropertyBlock
          title={<h2>{t('preferred-terms')}</h2>}
          data={concept?.references.prefLabelXl?.[0].properties?.prefLabel}
        />
        <MultilingualPropertyBlock
          title={<h2>{t('definition')}</h2>}
          data={concept?.properties.definition}
        />

        <Separator isLarge />

        <PropertyBlock
          title={t('contributor')}
          property={
            terminology?.references.contributor?.[0].properties.prefLabel
          }
        />

        <BasicBlock title={t('modified-at')}>
          <FormattedDate date={concept?.lastModifiedDate} />,{' '}
          {concept?.lastModifiedBy}
        </BasicBlock>
      </ExpanderContent>
    );
  }
}
