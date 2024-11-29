import { BasicBlock } from 'yti-common-ui/block';
import AdministrativeDetailsExpander, {
  hasAdministrativeDetails,
} from './administrative-details-expander';
import DiagramsAndSourcesExpander from './diagrams-and-sources-expander';
import { DetailsExpanderGroup } from './concept.styles';
import { ConceptInfo } from '@app/common/interfaces/interfaces-v2';
import OtherDetailsExpander from './other-details-expander';

export interface DetailsExpanderProps {
  concept?: ConceptInfo;
}

export default function DetailsExpander({ concept }: DetailsExpanderProps) {
  const noDiagramsAndSources =
    !concept?.links.length && !concept?.sources.length;
  const noAdministrativeDetails = !hasAdministrativeDetails(concept);
  const noOtherDetails = !concept?.conceptClass;
  if (noDiagramsAndSources && noAdministrativeDetails && noOtherDetails) {
    return null;
  }

  return (
    <BasicBlock>
      <DetailsExpanderGroup
        openAllText=""
        closeAllText=""
        toggleAllButtonProps={{ style: { display: 'none' } }}
        showToggleAllButton={false}
      >
        <DiagramsAndSourcesExpander concept={concept} />
        <AdministrativeDetailsExpander concept={concept} />
        <OtherDetailsExpander concept={concept} />
      </DetailsExpanderGroup>
    </BasicBlock>
  );
}
