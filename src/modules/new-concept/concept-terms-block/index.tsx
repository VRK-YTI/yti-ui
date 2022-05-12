import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { Button, ExpanderGroup } from 'suomifi-ui-components';
import { LargeHeading, MediumHeading } from './concept-terms-block.styles';
import TermExpander from './term-expander';
import TermForm from './term-form';

export interface ConceptTermsBlockProps {
  languages: string[];
}

export default function ConceptTermsBlock({
  languages,
}: ConceptTermsBlockProps) {
  const { t } = useTranslation('admin');

  return (
    <>
      <Separator isLarge />

      <LargeHeading variant="h2">{t('concept-terms-title')}</LargeHeading>

      <BasicBlock
        title={
          <MediumHeading variant="h3">
            {t('concept-preferred-terms-title')}
          </MediumHeading>
        }
        extra={
          <BasicBlockExtraWrapper isWide>
            <ExpanderGroup openAllText="" closeAllText="">
              {languages.map((lang) => (
                <TermExpander key={lang} languages={languages} lang={lang}>
                  <TermForm lang={lang} />
                </TermExpander>
              ))}
            </ExpanderGroup>
          </BasicBlockExtraWrapper>
        }
      >
        {t('concept-preferred-terms-description')}
      </BasicBlock>

      <BasicBlock
        title={
          <MediumHeading variant="h3">
            {t('concept-other-terms-title')}
          </MediumHeading>
        }
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
