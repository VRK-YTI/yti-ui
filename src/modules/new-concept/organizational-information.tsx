import { useTranslation } from 'next-i18next';
import { ExpanderTitleButton } from 'suomifi-ui-components';
import { ConceptExpander } from './new-concept.styles';

export default function OrganizationalInformation() {
  const { t } = useTranslation('admin');

  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading='h3'>
        {t('organizational-information')}
      </ExpanderTitleButton>
    </ConceptExpander>
  );
}
