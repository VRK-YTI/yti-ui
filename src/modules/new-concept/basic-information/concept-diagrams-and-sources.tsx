import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { Button, ExpanderTitleButton } from 'suomifi-ui-components';
import {
  ConceptExpander,
  ExpanderContentFitted,
  WideTextarea,
} from './concept-basic-information.styles';

export default function ConceptDiagramsAndSources() {
  const { t } = useTranslation('admin');

  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading="h3">
        {t('concept-diagrams-and-sources')}
      </ExpanderTitleButton>
      <ExpanderContentFitted>
        <BasicBlock
          title={t('concept-diagram-or-link')}
          extra={
            <BasicBlockExtraWrapper>
              <Button variant="secondary">{t('add-new-link')}</Button>
            </BasicBlockExtraWrapper>
          }
        >
          {t('add-new-link-description')}
        </BasicBlock>

        <WideTextarea
          labelText={t('sources')}
          hintText={t('sources-hint-text')}
          visualPlaceholder={t('sources-placeholder')}
        />
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
