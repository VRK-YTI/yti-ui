import { memo } from 'react';
import { useTranslation } from 'next-i18next';
import { useGetTerminologyQuery } from '../vocabulary/vocabulary.slice';
import { ExpanderContent } from 'suomifi-ui-components';
import { BasicBlock, MultilingualBlock } from 'yti-common-ui/block';
import Separator from 'yti-common-ui/separator';
import FormattedDate from 'yti-common-ui/formatted-date';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';
import { ConceptResponseObject } from '@app/common/interfaces/interfaces-v2';

interface RenderExpanderContentProps {
  terminologyId: string;
  concept: ConceptResponseObject;
  isOpen: boolean;
}

function RenderExpanderContent({
  terminologyId,
  isOpen,
  concept,
}: RenderExpanderContentProps) {
  const { t, i18n } = useTranslation('admin');
  const { data: terminology } = useGetTerminologyQuery(
    {
      id: terminologyId,
    },
    { skip: !isOpen }
  );

  if (!isOpen) {
    return null;
  }

  return (
    <ExpanderContent>
      {concept && (
        <>
          <BasicBlock title={<h2>{t('preferred-terms')}</h2>}>
            <MultilingualBlock data={concept.label} />
          </BasicBlock>

          {Object.keys(concept.definition).length > 0 && (
            <BasicBlock title={<h2>{t('definition')}</h2>}>
              <MultilingualBlock data={concept.definition} renderHtml={true} />
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
          </BasicBlock>
        </>
      )}
    </ExpanderContent>
  );
}

export default memo(RenderExpanderContent);
