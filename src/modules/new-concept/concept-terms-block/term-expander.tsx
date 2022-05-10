import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { asString } from '@app/common/utils/hooks/useUrlState';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Expander, ExpanderContent } from 'suomifi-ui-components';
import { SuccessIcon } from './concept-terms-block.styles';
import ExpanderTitle from '@app/common/components/expander-title';

export interface TermExpanderProps {
  lang: string;
  languages: string[];
}

export default function TermExpander({ lang, languages }: TermExpanderProps) {
  const { t } = useTranslation('admin');
  const router = useRouter();
  const preferredTerm = languages
    .map((lang) => ({ lang, value: asString(router.query[lang]), regex: '' }))
    .filter(({ value }) => !!value);

  return (
    <Expander>
      <ExpanderTitle
        title={t(`language-label-text-${lang}`)}
        extra={
          <>
            {getPropertyValue({
              property: preferredTerm,
              language: lang,
            })}
            {' - '}
            {t('DRAFT', { ns: 'common' })}
            <SuccessIcon icon="checkCircleFilled" />
          </>
        }
      />

      <ExpanderContent>ASDF</ExpanderContent>
    </Expander>
  );
}
