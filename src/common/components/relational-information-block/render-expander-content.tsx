import { memo } from 'react';
import { useTranslation } from 'next-i18next';
import { useGetConceptQuery } from '../concept/concept.slice';
import { useGetVocabularyQuery } from '../vocabulary/vocabulary.slice';
import { ExpanderContent } from 'suomifi-ui-components';
import SaveSpinner from '../save-spinner';
import { BasicBlock, MultilingualPropertyBlock, PropertyBlock } from '../block';
import Separator from '../separator';
import FormattedDate from '../formatted-date';

interface RenderExpanderContentProps {
  terminologyId: string;
  conceptId: string;
  isOpen: boolean;
}

function RenderExpanderContent({
  terminologyId,
  conceptId,
  isOpen,
}: RenderExpanderContentProps) {
  const { t } = useTranslation('admin');
  const { data: concept, isLoading: conceptIsLoading } = useGetConceptQuery(
    {
      terminologyId: terminologyId,
      conceptId: conceptId,
    },
    { skip: !isOpen }
  );
  const { data: terminology } = useGetVocabularyQuery(
    {
      id: terminologyId,
    },
    { skip: !isOpen }
  );

  if (!isOpen) {
    return null;
  }

  if (conceptIsLoading) {
    return (
      <ExpanderContent>
        <SaveSpinner text={t('loading', { ns: 'common' })} />
      </ExpanderContent>
    );
  }

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

      {terminology && (
        <PropertyBlock
          title={t('contributor')}
          property={
            terminology?.references.contributor?.[0].properties.prefLabel
          }
        />
      )}

      <BasicBlock title={t('modified-at')}>
        <FormattedDate date={concept?.lastModifiedDate} />,{' '}
        {concept?.lastModifiedBy}
      </BasicBlock>
    </ExpanderContent>
  );
}

export default memo(RenderExpanderContent);
