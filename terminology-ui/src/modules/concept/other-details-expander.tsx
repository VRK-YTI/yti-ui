import { useTranslation } from 'next-i18next';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import { ConceptInfo } from '@app/common/interfaces/interfaces-v2';
import { BasicBlock } from 'yti-common-ui/block';

export function hasOtherDetails(concept?: ConceptInfo) {
  concept?.conceptClass;
}

export interface OtherDetailsExpanderProps {
  concept?: ConceptInfo;
}

export default function OtherDetailsExpander({
  concept,
}: OtherDetailsExpanderProps) {
  const { t } = useTranslation('concept');

  if (!concept?.conceptClass) {
    return null;
  }

  return (
    <Expander id="other-details-expander">
      <ExpanderTitleButton>{t('section-other-details')}</ExpanderTitleButton>
      <ExpanderContent>
        {concept?.conceptClass && (
          <BasicBlock title={t('field-concept-class')}>
            {concept?.conceptClass}
          </BasicBlock>
        )}
      </ExpanderContent>
    </Expander>
  );
}
