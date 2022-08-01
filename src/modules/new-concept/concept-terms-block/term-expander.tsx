import { useTranslation } from 'next-i18next';
import {
  Checkbox,
  Expander,
  ExpanderContent,
  ExpanderTitle as SuomifiExpanderTitle,
} from 'suomifi-ui-components';
import { SuccessIcon } from './concept-terms-block.styles';
import ExpanderTitle from '@app/common/components/expander-title';
import { translateLanguage } from '@app/common/utils/translation-helpers';
import { ConceptTermType } from './concept-term-block-types';

export interface TermExpanderProps {
  term: ConceptTermType;
  setChecked?: (id: string, value: boolean) => void;
  checkable?: boolean;
  completed?: boolean;
  children?: React.ReactNode;
}

export default function TermExpander({
  term,
  setChecked,
  checkable,
  completed,
  children,
}: TermExpanderProps) {
  const { t } = useTranslation('admin');
  const primaryText = `${translateLanguage(term.language, t)} ${term.language.toUpperCase()}`;
  const secondaryText = `${term.prefLabel} - ${t('DRAFT', { ns: 'common' })}`;

  return (
    <Expander>
      {checkable ? (
        <SuomifiExpanderTitle
          ariaOpenText="open expander"
          ariaCloseText="close expander"
          toggleButtonAriaDescribedBy="checkbox-id"
        >
          <Checkbox
            id={`${term.id}-checkbox`}
            hintText={secondaryText}
            onClick={(e) => setChecked && setChecked(term.id, e.checkboxState)}
          >
            {primaryText}
          </Checkbox>
        </SuomifiExpanderTitle>
      ) : (
        <ExpanderTitle
          title={primaryText}
          extra={
            <>
              {secondaryText}
              {completed && <SuccessIcon icon="checkCircleFilled" />}
            </>
          }
        />
      )}

      <ExpanderContent>{children}</ExpanderContent>
    </Expander>
  );
}
