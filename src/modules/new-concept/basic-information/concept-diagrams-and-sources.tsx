import { useTranslation } from 'next-i18next';
import { ExpanderTitleButton } from 'suomifi-ui-components';
import { ConceptExpander } from './concept-basic-information.styles';

export default function ConceptDiagramsAndSources() {
  const { t } = useTranslation('admin');

  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading="h3">
        {t('concept-diagrams-and-sources')}
      </ExpanderTitleButton>
    </ConceptExpander>
  );
}
