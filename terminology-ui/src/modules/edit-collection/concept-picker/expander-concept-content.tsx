import { BasicBlock } from 'yti-common-ui/block';
import { MultilingualPropertyBlock } from '@app/common/components/block';
import { useGetConceptQuery } from '@app/common/components/concept/concept.slice';
import FormattedDate from 'yti-common-ui/formatted-date';
import PropertyValue from '@app/common/components/property-value';
import Separator from 'yti-common-ui/separator';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { useTranslation } from 'next-i18next';
import { ExpanderContent } from 'suomifi-ui-components';
import { ExpanderConceptContent as ExpanderConceptContentType } from './concept-picker.types';

export function ExpanderConceptContent({
  concept,
  terminologyId,
}: ExpanderConceptContentType) {
  const { t } = useTranslation('collection');
  const { data } = useGetConceptQuery({
    terminologyId: terminologyId,
    conceptId: concept.id,
  });
  const { data: terminologyData } = useGetVocabularyQuery({
    id: terminologyId,
  });

  return (
    <ExpanderContent>
      <MultilingualPropertyBlock
        title={t('recommended-terms')}
        data={Object.keys(concept.label).map((key) => ({
          lang: key,
          regex: '(?s)^.*$',
          value: concept.label[key],
        }))}
      />

      {concept.definition && (
        <MultilingualPropertyBlock
          title={t('definition')}
          data={Object.keys(concept.definition).map((key) => ({
            lang: key,
            regex: '(?s)^.*$',
            value: concept.definition[key],
          }))}
        />
      )}

      <Separator isLarge />

      <BasicBlock title={t('admin-organization')}>
        <PropertyValue
          property={
            terminologyData?.references.contributor?.[0].properties.prefLabel
          }
        />
      </BasicBlock>

      <BasicBlock title={t('last-modified')}>
        <FormattedDate date={concept.modified} />
        {data?.lastModifiedBy && `, ${data?.lastModifiedBy}`}
      </BasicBlock>
    </ExpanderContent>
  );
}
