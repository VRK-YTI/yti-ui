import dynamic from 'next/dynamic';
import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, ExpanderGroup } from 'suomifi-ui-components';
import {
  LargeHeading,
  MediumHeading,
  OtherTermsExpanderGroup,
} from './concept-terms-block.styles';
import TermExpander from './term-expander';
import TermForm from './term-form';
import { ConceptTermType, ListType } from '../new-concept.types';
import { FormError } from '../validate-form';
import { useBreakpoints } from '@app/common/components/media-query/media-query-context';

const NewTermModal = dynamic(() => import('./new-term-modal'));

interface ConceptTermsBlockProps {
  languages: string[];
  updateTerms: (value: ConceptTermType[]) => void;
  initialValues: ConceptTermType[];
  errors: FormError;
}

export interface HandleSwitchTermsProps {
  actionType: 'change' | 'replace';
  newRecommendedId: string;
  oldRecommendedId: string;
  newType: string;
}

export interface ConceptTermUpdateProps {
  termId: string;
  key: string;
  value: string | ListType[];
}

export default function ConceptTermsBlock({
  languages,
  updateTerms,
  initialValues,
  errors,
}: ConceptTermsBlockProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [modalVisible, setModalVisible] = useState(false);
  const [terms, setTerms] = useState<ConceptTermType[]>(initialValues);

  const handleUpdate = ({ termId, key, value }: ConceptTermUpdateProps) => {
    let updatedTerm = terms.filter((term) => term.id === termId)[0];
    updatedTerm = {
      ...updatedTerm,
      [key]: typeof value === 'string' ? value.trim() : value,
    };

    const updatedTerms = terms.map((term) => {
      if (term.id === termId) {
        return updatedTerm;
      }
      return term;
    });

    setTerms(updatedTerms);
    updateTerms(updatedTerms);
  };

  const handleRemoveTerm = (id: string) => {
    const newTerms = terms.filter((term) => term.id !== id);
    setTerms(newTerms);
    updateTerms(newTerms);
  };

  const appendTerm = (newTerm: ConceptTermType) => {
    const newTerms = [...terms, newTerm];
    setTerms(newTerms);
    updateTerms(newTerms);
  };

  const handleSwitchTerms = ({
    actionType,
    newRecommendedId,
    oldRecommendedId,
    newType,
  }: HandleSwitchTermsProps) => {
    let newRecommended = terms.filter(
      (term) => term.id === newRecommendedId
    )[0];
    newRecommended = { ...newRecommended, termType: 'recommended-term' };

    let updatedTerms = terms.map((term) => {
      if (term.id === newRecommendedId) {
        return newRecommended;
      }

      if (actionType === 'change' && term.id === oldRecommendedId) {
        const oldRecommended = terms.filter(
          (term) => term.id === oldRecommendedId
        )[0];
        return { ...oldRecommended, termType: newType };
      }

      return term;
    });

    if (actionType === 'replace') {
      updatedTerms = updatedTerms.filter(
        (term) => term.id !== oldRecommendedId
      );
    }

    setTerms(updatedTerms);
    updateTerms(updatedTerms);
  };

  return (
    <>
      <Separator />

      <LargeHeading variant="h2">{t('concept-terms-title')}</LargeHeading>

      <BasicBlock
        title={
          <MediumHeading variant="h3">
            {t('concept-preferred-terms-title')}
          </MediumHeading>
        }
        extra={
          <BasicBlockExtraWrapper
            $isWide
            $isSmall={isSmall}
            id="recommended-terms-block"
          >
            <ExpanderGroup openAllText="" closeAllText="">
              {terms
                .filter((term) => term.termType === 'recommended-term')
                .map((term) => (
                  <TermExpander key={term.id} term={term} errors={errors}>
                    <TermForm
                      term={term}
                      update={handleUpdate}
                      currentTerms={terms}
                      handleSwitchTerms={handleSwitchTerms}
                      errors={errors}
                    />
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
          <BasicBlockExtraWrapper
            $isWide
            $isSmall={isSmall}
            id="other-terms-block"
          >
            <Button variant="secondary" onClick={() => setModalVisible(true)}>
              {t('concept-add-term')}
            </Button>
            {modalVisible && (
              <NewTermModal
                setVisible={setModalVisible}
                languages={languages}
                appendTerm={appendTerm}
                recommendedTermLangs={terms
                  .filter((t) => t.termType === 'recommended-term')
                  .map((term) => term.language)}
              />
            )}
            {terms.filter((term) => term.termType !== 'recommended-term')
              .length > 0 && (
              <>
                <OtherTermsExpanderGroup openAllText="" closeAllText="">
                  {terms
                    .filter((term) => term.termType !== 'recommended-term')
                    .map((term) => (
                      <TermExpander key={term.id} term={term} errors={errors}>
                        <TermForm
                          term={term}
                          update={handleUpdate}
                          currentTerms={terms}
                          handleSwitchTerms={handleSwitchTerms}
                          errors={errors}
                          handleRemoveTerm={handleRemoveTerm}
                        />
                      </TermExpander>
                    ))}
                </OtherTermsExpanderGroup>
              </>
            )}
          </BasicBlockExtraWrapper>
        }
      />
    </>
  );
}
