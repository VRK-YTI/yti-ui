import { ExpanderTitleButton } from 'suomifi-ui-components';
import { ConceptExpander } from './new-concept.styles';

export default function OtherInformation() {
  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading='h3'>
        Käsitteen muut tiedot
      </ExpanderTitleButton>
    </ConceptExpander>
  );
}
