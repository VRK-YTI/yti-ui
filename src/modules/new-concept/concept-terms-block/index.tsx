import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import PropertyValue from '@app/common/components/property-value';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import Separator from '@app/common/components/separator';
import { asString } from '@app/common/utils/hooks/useUrlState';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  Button,
  Expander,
  ExpanderContent,
  ExpanderGroup,
  ExpanderTitleButton,
  Icon,
} from 'suomifi-ui-components';
import {
  H2Sm,
  ExpanderTitleButtonSecondaryText,
  ExpanderTitleButtonPrimaryText,
  SuccessIcon,
} from './concept-terms-block.styles';

export interface ConceptTermsBlockProps {
  languages: string[];
}

export default function ConceptTermsBlock({
  languages,
}: ConceptTermsBlockProps) {
  const { t } = useTranslation('admin');

  const router = useRouter();
  const preferredTerm = languages
    .map((lang) => ({ lang, value: asString(router.query[lang]), regex: '' }))
    .filter(({ value }) => !!value);

  return (
    <>
      <Separator isLarge />

      <H2Sm variant="h2">{t('concept-terms-title')}</H2Sm>

      <BasicBlock
        title={t('concept-preferred-terms-title')}
        extra={
          <BasicBlockExtraWrapper isWide>
            <ExpanderGroup openAllText="" closeAllText="">
              {languages.map((lang) => (
                <Expander key={lang}>
                  <ExpanderTitleButton>
                    <ExpanderTitleButtonPrimaryText>
                      {t(`language-label-text-${lang}`)}
                    </ExpanderTitleButtonPrimaryText>
                    <ExpanderTitleButtonSecondaryText>
                      {getPropertyValue({
                        property: preferredTerm,
                        language: lang,
                      })}
                      {' - '}
                      {t('DRAFT', { ns: 'common' })}
                      <SuccessIcon icon="checkCircleFilled" />
                    </ExpanderTitleButtonSecondaryText>
                  </ExpanderTitleButton>
                  <ExpanderContent>ASDF</ExpanderContent>
                </Expander>
              ))}
            </ExpanderGroup>
          </BasicBlockExtraWrapper>
        }
      >
        {t('concept-preferred-terms-description')}
      </BasicBlock>

      <BasicBlock
        title={t('concept-other-terms-title')}
        extra={
          <BasicBlockExtraWrapper>
            <Button variant="secondary">{t('concept-add-term')}</Button>
          </BasicBlockExtraWrapper>
        }
      >
        {t('concept-other-terms-description')}
      </BasicBlock>
    </>
  );
}
