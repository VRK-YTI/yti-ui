import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { asString } from '@app/common/utils/hooks/useUrlState';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
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
  languages: string[];
  checkable?: boolean;
  completed?: boolean;
  children?: React.ReactNode;
}

export default function TermExpander({
  lang,
  languages,
  checkable,
  completed,
  children,
}: TermExpanderProps) {
  const { t } = useTranslation('admin');
  const router = useRouter();
  const preferredTerm = languages
    .map((lang) => ({ lang, value: asString(router.query[lang]), regex: '' }))
    .filter(({ value }) => !!value);

  const primaryText = t(`language-label-text-${lang}`);
  const secondaryText = `${getPropertyValue({
    property: preferredTerm,
    language: lang,
  })} - ${t('DRAFT', { ns: 'common' })}`;

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
