import { useTranslation } from 'next-i18next';
import { Expander, ExpanderContent } from 'suomifi-ui-components';
import { ExpanderIcon, SuccessIcon } from './concept-terms-block.styles';
import ExpanderTitle from '@app/common/components/expander-title';
import {
  translateLanguage,
  translateTermType,
} from '@app/common/utils/translation-helpers';
import { ConceptTermType } from './concept-term-block-types';
import { FormError } from '../validate-form';

export interface TermExpanderProps {
  term: ConceptTermType;
  completed?: boolean;
  children?: React.ReactNode;
  errors: FormError;
}

export default function TermExpander({
  term,
  completed,
  children,
  errors,
}: TermExpanderProps) {
  const { t } = useTranslation('admin');
  const secondaryText = `${translateLanguage(
    term.language,
    t
  )} ${term.language.toUpperCase()}`;
  const primaryText = `${term.prefLabel} ${term.termType !== 'recommended-term'
      ? `- ${translateTermType(term.termType, t)}`
      : ''
    } - ${t('statuses.draft', {
      ns: 'common',
    })}`;

  const displayIcon =
    (errors.termPrefLabel && !term.prefLabel) ||
    (errors.editorialNote &&
      term.editorialNote.filter((n) => !n.value || n.value === '').length >
      0) ||
    (errors.termConjugation &&
      term.termConjugation &&
      !['singulary', 'plural'].includes(term.termConjugation)
    );

  return (
    <Expander>
      <ExpanderTitle
        title={
          <>
            {primaryText}
            {displayIcon && <ExpanderIcon icon="error" />}
          </>
        }
        extra={
          <>
            {secondaryText}
            {completed && <SuccessIcon icon="checkCircleFilled" />}
          </>
        }
      />
      <ExpanderContent>{children}</ExpanderContent>
    </Expander>
  );
}
