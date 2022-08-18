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

const NewTermModal = dynamic(() => import('./new-term-modal'));

interface ConceptTermsBlockProps {
  languages: string[];
  updateTerms: (value: ConceptTermType[]) => void;
  initialValues: ConceptTermType[];
  errors: FormError;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [checkedTerms, setCheckedTerms] = useState<string[]>([]);
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

  const handleCheck = (id: string, state: boolean) => {
    if (!state && checkedTerms.includes(id)) {
      setCheckedTerms(checkedTerms.filter((term) => term !== id));
      return;
    }

    if (state && !checkedTerms.includes(id)) {
      setCheckedTerms([...checkedTerms, id]);
      return;
    }

    return;
  };

  const handleRemoveTerms = () => {
    const newTerms = terms.filter((term) => !checkedTerms.includes(term.id));
    setTerms(newTerms);
    updateTerms(newTerms);
    setCheckedTerms([]);
  };

  const appendTerm = (newTerm: ConceptTermType) => {
    const newTerms = [...terms, newTerm];
    setTerms(newTerms);
    updateTerms(newTerms);
  };

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
          <BasicBlockExtraWrapper $isWide id="recommended-terms-block">
            <ExpanderGroup openAllText="" closeAllText="">
              {terms
                .filter((term) => term.termType === 'recommended-term')
                .map((term) => (
                  <TermExpander key={term.id} term={term}>
                    <TermForm
                      term={term}
                      update={handleUpdate}
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
          <BasicBlockExtraWrapper $isWide id="other-terms-block">
            <Button variant="secondary" onClick={() => setModalVisible(true)}>
              {t('concept-add-term')}
            </Button>
            {modalVisible && (
              <NewTermModal
                setVisible={setModalVisible}
                languages={languages}
                appendTerm={appendTerm}
              />
            )}
            {terms.filter((term) => term.termType !== 'recommended-term')
              .length > 0 && (
              <>
                <OtherTermsExpanderGroup openAllText="" closeAllText="">
                  {terms
                    .filter((term) => term.termType !== 'recommended-term')
                    .map((term) => (
                      <TermExpander
                        key={term.id}
                        term={term}
                        setChecked={handleCheck}
                        checkable
                      >
                        <TermForm
                          term={term}
                          update={handleUpdate}
                          errors={errors}
                        />
                      </TermExpander>
                    ))}
                </OtherTermsExpanderGroup>

                <Button
                  variant="secondaryNoBorder"
                  onClick={() => handleRemoveTerms()}
                  disabled={checkedTerms.length < 1}
                  id="remove-terms-button"
                >
                  {t('remove-term', { count: checkedTerms.length })}
                </Button>
              </>
            )}
          </BasicBlockExtraWrapper>
        }
      >
        {t('concept-other-terms-description')}
      </BasicBlock>
    </>
  );
}
