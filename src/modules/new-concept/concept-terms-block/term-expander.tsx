import { useTranslation } from 'next-i18next';
import {
  Checkbox,
  Expander,
  ExpanderContent,
  ExpanderTitle as SuomifiExpanderTitle,
} from 'suomifi-ui-components';
import { SuccessIcon } from './concept-terms-block.styles';
import ExpanderTitle from '@app/common/components/expander-title';

export interface TermExpanderProps {
  lang: string;
  prefLabel?: string;
  checkable?: boolean;
  completed?: boolean;
  children?: React.ReactNode;
}

export default function TermExpander({
  lang,
  prefLabel,
  checkable,
  completed,
  children,
}: TermExpanderProps) {
  const { t } = useTranslation('admin');
  const primaryText = t(`language-label-text-${lang}`);
  const secondaryText = `${prefLabel} - ${t('DRAFT', { ns: 'common' })}`;

  return (
    <Expander>
      {checkable ? (
        <SuomifiExpanderTitle
          ariaOpenText="open expander"
          ariaCloseText="close expander"
          toggleButtonAriaDescribedBy="checkbox-id"
        >
          <Checkbox hintText={secondaryText} id="checkbox-id">
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
