import { useTranslation } from 'next-i18next';
import { BasicBlock } from 'yti-common-ui/block';
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
import { DetailsExpanderGroup } from './concept.styles';

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
