import { BasicBlock, MultilingualBlock } from 'yti-common-ui/block';
import { useGetConceptQuery } from '@app/common/components/concept/concept.slice';
import FormattedDate from 'yti-common-ui/formatted-date';
import Separator from 'yti-common-ui/separator';
import { useGetTerminologyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { useTranslation } from 'next-i18next';
import { ExpanderContent } from 'suomifi-ui-components';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';
import { ConceptResponseObject } from '@app/common/interfaces/interfaces-v2';

export function ExpanderConceptContent({
  concept,
  terminologyId,
}: {
  concept: ConceptResponseObject;
  terminologyId: string;
}) {
  const { t, i18n } = useTranslation('collection');
  const { data } = useGetConceptQuery({
    terminologyId: terminologyId,
    conceptId: concept.identifier,
  });
  const { data: terminologyData } = useGetTerminologyQuery({
    id: terminologyId,
  });

  return (
    <ExpanderContent>
      <BasicBlock title={t('recommended-terms')}>
        <MultilingualBlock data={concept.label} />
      </BasicBlock>

      {concept.definition && (
        <BasicBlock title={t('definition')}>
          <MultilingualBlock data={concept.definition} />
        </BasicBlock>
      )}

      <Separator isLarge />

      <BasicBlock title={t('admin-organization')}>
        {terminologyData?.organizations
          .map((organization) =>
            getLanguageVersion({
              data: organization.label,
              lang: i18n.language,
            })
          )
          .join(', ')}
      </BasicBlock>

      <BasicBlock title={t('last-modified')}>
        <FormattedDate date={data?.modified} />
        {data?.modifier.name && `, ${data?.modifier.name}`}
      </BasicBlock>
    </ExpanderContent>
  );
}
