import {
  Checkbox,
  Expander,
  ExpanderContent,
  ExpanderGroup,
  ExpanderTitle,
} from 'suomifi-ui-components';
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
import { Concepts } from '@app/common/interfaces/concepts.interface';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useBreakpoints } from '../media-query/media-query-context';

interface RenderConceptsProps {
  concepts?: Concepts[];
  chosen: Concepts[];
  setChosen: (value: Concepts[]) => void;
  terminologyId: string;
  fromOther?: boolean;
}

export default function RenderConcepts({
  concepts,
  chosen,
  setChosen,
  terminologyId,
  fromOther,
}: RenderConceptsProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const { data: terminology } = useGetVocabularyQuery({
    id: terminologyId,
  });
  const { data: vocabularies } = useGetVocabulariesQuery(null);

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
    <div id="concept-result-block">
      <ExpanderGroup openAllText="" closeAllText="">
        {concepts?.map((concept) => {
          const conceptsVocabulary = vocabularies?.filter(
            (vocabulary) => vocabulary.type.graph.id === concept.terminology.id
          );
          const property =
            fromOther && conceptsVocabulary && conceptsVocabulary.length > 0
              ? conceptsVocabulary[0].properties.prefLabel
              : terminology?.properties.prefLabel;

          const organizationTitle = getPropertyValue({
            language: i18n.language,
            property: property,
          });

          return (
            <Expander key={concept.id} className="concept-result-item">
              <ExpanderTitle
                ariaCloseText={t('open-concept-expander')}
                ariaOpenText={t('close-concept-expander')}
                toggleButtonAriaDescribedBy=""
              >
                <Checkbox
                  hintText={`${organizationTitle} - ${translateStatus(
                    concept.status ?? 'DRAFT',
                    t
                  )}`}
                  onClick={(e) => handleCheckbox(e, concept)}
                  checked={chosen.some((chose) => chose.id === concept.id)}
                  className="concept-checkbox"
                  variant={isSmall ? 'large' : 'small'}
                >
                  <SanitizedTextContent
                    text={
                      concept.label
                        ? getPropertyValue({
                            property: Object.keys(concept.label).map((key) => {
                              const obj = {
                                lang: key,
                                value: concept.label[key],
                                regex: '',
                              };
                              return obj;
                            }),
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
              />
            </Expander>
          );
        })}
      </ExpanderGroup>
    </div>
  );

  interface RenderExpanderContentProps {
    terminologyId: string;
    conceptId: string;
  }

  function RenderExpanderContent({
    terminologyId,
    conceptId,
  }: RenderExpanderContentProps) {
    const { t } = useTranslation('admin');
    const { data: concept } = useGetConceptQuery({
      terminologyId: terminologyId,
      conceptId: conceptId,
    });
    const { data: terminology } = useGetVocabularyQuery({
      id: terminologyId,
    });

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
