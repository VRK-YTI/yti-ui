import { ExpanderTitleButton } from 'suomifi-ui-components';
import { ConceptExpander } from './new-concept.styles';

export default function RelationalInformation() {
  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading='h3'>
        Suhdetiedot
      </ExpanderTitleButton>
    </ConceptExpander>
  );
}
