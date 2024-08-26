import { BasicBlock } from 'yti-common-ui/block';
import { MultilingualPropertyBlock } from '@app/common/components/block';
import { useGetConceptQuery } from '@app/common/components/concept/concept.slice';
import FormattedDate from 'yti-common-ui/formatted-date';
import Separator from 'yti-common-ui/separator';
import { useGetTerminologyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { useTranslation } from 'next-i18next';
import { ExpanderContent } from 'suomifi-ui-components';
import { ExpanderConceptContent as ExpanderConceptContentType } from './concept-picker.types';
import { compareLocales } from '@app/common/utils/compare-locals';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

export function ExpanderConceptContent({
  concept,
  terminologyId,
}: ExpanderConceptContentType) {
  const { t, i18n } = useTranslation('collection');
  const { data } = useGetConceptQuery({
    terminologyId: terminologyId,
    conceptId: concept.id,
  });
  const { data: terminologyData } = useGetTerminologyQuery({
    id: terminologyId,
  });

  return (
    <ExpanderContent>
      <MultilingualPropertyBlock
        title={t('recommended-terms')}
        data={Object.keys(concept.label)
          .map((key) => ({
            lang: key,
            regex: '(?s)^.*$',
            value: concept.label[key],
          }))
          .sort(compareLocales)}
      />

      {concept.definition && (
        <MultilingualPropertyBlock
          title={t('definition')}
          data={Object.keys(concept.definition)
            .map((key) => ({
              lang: key,
              regex: '(?s)^.*$',
              value: concept.definition[key],
            }))
            .sort(compareLocales)}
        />
      )}

      <Separator isLarge />

      <BasicBlock title={t('admin-organization')}>
        {getLanguageVersion({
          data: terminologyData?.label,
          lang: i18n.language,
        })}
      </BasicBlock>

      <BasicBlock title={t('last-modified')}>
        <FormattedDate date={concept.modified} />
        {/*data?.lastModifiedBy && `, ${data?.lastModifiedBy}`*/}
      </BasicBlock>
    </ExpanderContent>
  );
}
