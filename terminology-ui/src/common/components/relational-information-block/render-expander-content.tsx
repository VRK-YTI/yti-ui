import { memo } from 'react';
import { useTranslation } from 'next-i18next';
import { useGetConceptQuery } from '../concept/concept.slice';
import { useGetTerminologyQuery } from '../vocabulary/vocabulary.slice';
import { ExpanderContent } from 'suomifi-ui-components';
import SaveSpinner from 'yti-common-ui/save-spinner';
import { BasicBlock, MultilingualBlock } from 'yti-common-ui/block';
import Separator from 'yti-common-ui/separator';
import FormattedDate from 'yti-common-ui/formatted-date';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';
import { LocalizedValue } from '@app/common/interfaces/interfaces-v2';

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
  const { t, i18n } = useTranslation('admin');
  const { data: concept, isLoading: conceptIsLoading } = useGetConceptQuery(
    {
      terminologyId: terminologyId,
      conceptId: conceptId,
    },
    { skip: !isOpen }
  );
  const { data: terminology } = useGetTerminologyQuery(
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
      {concept && (
        <>
          <BasicBlock title={<h2>{t('preferred-terms')}</h2>}>
            <MultilingualBlock
              data={concept.recommendedTerms.reduce(
                (label, term) => ({
                  ...label,
                  [label[term.language]]: term.label ?? '',
                }),
                {} as LocalizedValue
              )}
            />
          </BasicBlock>

          {Object.keys(concept.definition).length > 0 && (
            <BasicBlock title={<h2>{t('definition')}</h2>}>
              <MultilingualBlock data={concept.definition} />
            </BasicBlock>
          )}

          <Separator isLarge />

          <BasicBlock title={t('contributor')}>
            {terminology?.organizations
              .map((o) =>
                getLanguageVersion({
                  data: o.label,
                  lang: i18n.language ?? 'fi',
                })
              )
              .join(', ')}
          </BasicBlock>

          <BasicBlock title={t('modified-at')}>
            <FormattedDate date={concept?.modified} />
            {concept?.modifier?.name ? `, ${concept.modifier.name}` : ''}
          </BasicBlock>
        </>
      )}
    </ExpanderContent>
  );
}

export default memo(RenderExpanderContent);
