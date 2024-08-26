import { useTranslation } from 'next-i18next';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';

import { PropertyList } from './concept.styles';
import { ConceptInfo } from '@app/common/interfaces/interfaces-v2';

export function hasAdministrativeDetails(concept?: ConceptInfo) {
  return (
    concept?.changeNote ||
    concept?.historyNote ||
    concept?.editorialNotes.length
  );
}

export interface AdministrativeDetailsExpanderProps {
  concept?: ConceptInfo;
}

export default function AdministrativeDetailsExpander({
  concept,
}: AdministrativeDetailsExpanderProps) {
  const { t } = useTranslation('concept');

  if (!hasAdministrativeDetails(concept)) {
    return null;
  }

  return (
    <Expander id="admin-details-expander">
      <ExpanderTitleButton>
        {t('section-administrative-details')}
      </ExpanderTitleButton>
      <ExpanderContent>
        {concept?.changeNote && (
          <BasicBlock title={t('field-change-note')}>
            {concept?.changeNote}
          </BasicBlock>
        )}

        {concept?.historyNote && (
          <BasicBlock title={t('field-history-note')}>
            {concept?.historyNote}
          </BasicBlock>
        )}

        {concept?.editorialNotes && concept?.editorialNotes?.length > 0 && (
          <BasicBlock title={t('field-editorial-note')}>
            <PropertyList>
              {concept?.editorialNotes?.map((note, idx) => (
                <li key={`note-${idx}`}>{note}</li>
              ))}
            </PropertyList>
          </BasicBlock>
        )}
      </ExpanderContent>
    </Expander>
  );
}
