import { ExpanderTitleButton } from 'suomifi-ui-components';
import { ConceptExpander } from './new-concept.styles';

export default function OrganizationalInformation() {
  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading='h3'>
        Hallinnolliset tiedot
      </ExpanderTitleButton>
    </ConceptExpander>
  );
}
