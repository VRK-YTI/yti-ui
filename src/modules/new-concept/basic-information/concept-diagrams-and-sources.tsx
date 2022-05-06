import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { ExpanderTitleButton } from 'suomifi-ui-components';
import {
  ConceptExpander,
  ExpanderContentFitted,
  WideTextarea,
} from './concept-basic-information.styles';
import NewDiagramOrLink from './new-diagram-or-link';

interface ConceptDiagramsAndSourcesProps {
  infoKey: string;
  update: (value: any) => void;
}

export default function ConceptDiagramsAndSources({
  infoKey,
  update,
}: ConceptDiagramsAndSourcesProps) {
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
              <NewDiagramOrLink />
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
