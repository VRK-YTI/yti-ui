import { useTranslation } from 'next-i18next';
import { ExpanderGroup } from 'suomifi-ui-components';
import { BasicBlock } from '@common/components/block';
import { Concept } from '@app/common/interfaces/concept.interface';
import AdministrativeDetailsExpander, {
  hasAdministrativeDetails,
} from './administrative-details-expander';
import DiagramsAndSourcesExpander, {
  hasDiagramsAndSources,
} from './diagrams-and-sources-expander';
import OtherDetailsExpander, {
  hasOtherDetails,
} from './other-details-expander';

export interface DetailsExpanderProps {
  concept?: Concept;
}

export default function DetailsExpander({ concept }: DetailsExpanderProps) {
  const { i18n } = useTranslation('concept');

  const noDiagramsAndSources = !hasDiagramsAndSources(concept, i18n.language);
  const noAdministrativeDetails = !hasAdministrativeDetails(
    concept,
    i18n.language
  );
  const noOtherDetails = !hasOtherDetails(concept, i18n.language);
  if (noDiagramsAndSources && noAdministrativeDetails && noOtherDetails) {
    return null;
  }

  return (
    <BasicBlock>
      <ExpanderGroup
        openAllText=""
        closeAllText=""
        toggleAllButtonProps={{ style: { display: 'none' } }}
      >
        <DiagramsAndSourcesExpander concept={concept} />
        <AdministrativeDetailsExpander concept={concept} />
        <OtherDetailsExpander concept={concept} />
      </ExpanderGroup>
    </BasicBlock>
  );
}
