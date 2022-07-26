import {
  BasicBlock,
  MultilingualPropertyBlock,
} from '@app/common/components/block';
import { useGetConceptQuery } from '@app/common/components/concept/concept.slice';
import FormattedDate from '@app/common/components/formatted-date';
import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { ExpanderContent } from 'suomifi-ui-components';
import { ExpanderConceptContent } from './concept-picker.types';

export function ExpanderConceptContent({
  concept,
  terminologyId,
}: ExpanderConceptContent) {
  const { t } = useTranslation('collection');
  const { data } = useGetConceptQuery({
    terminologyId: terminologyId,
    conceptId: concept.id,
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
        {/* TODO */}
        {concept.terminology.label.fi}
      </BasicBlock>

      <BasicBlock title={t('last-modified')}>
        <FormattedDate date={concept.modified} />
        {data?.lastModifiedBy && `, ${data?.lastModifiedBy}`}
      </BasicBlock>
    </ExpanderContent>
  );
}
