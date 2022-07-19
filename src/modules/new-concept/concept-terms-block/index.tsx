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
import { Property } from '@app/common/interfaces/termed-data-types.interface';
import { v4 } from 'uuid';
import {
  ConceptTermType,
  ConceptTermUpdateProps,
  ItemType,
} from './concept-term-block-types';

const NewTermModal = dynamic(() => import('./new-term-modal'));

export interface ConceptTermsBlockProps {
  languages: string[];
  preferredTerms: Property[];
  updateTerms: (value: any) => void;
}

export default function ConceptTermsBlock({
  languages,
  preferredTerms,
  updateTerms,
}: ConceptTermsBlockProps) {
  const { t } = useTranslation('admin');
  const [modalVisible, setModalVisible] = useState(false);
  const [checkedTerms, setCheckedTerms] = useState<string[]>([]);
  const [terms, setTerms] = useState<ConceptTermType[]>(
    preferredTerms.map((term) => ({
      changeNote: '',
      draftComment: '',
      editorialNote: [] as ItemType[],
      historyNote: '',
      id: v4(),
      language: term.lang,
      prefLabel: term.value,
      scope: '',
      source: '',
      status: 'draft',
      termConjugation: '',
      termEquivalency: '',
      termEquivalencyRelation: '',
      termFamily: '',
      termHomographNumber: '',
      termInfo: '',
      termStyle: '',
      termType: 'recommended-term',
      wordClass: '',
    }))
  );

  const handleUpdate = ({ termId, key, value }: ConceptTermUpdateProps) => {
    let updatedTerm = terms.filter((term) => term.id === termId)[0];
    updatedTerm = { ...updatedTerm, [key]: value };
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
    setTerms(terms.filter((term) => !checkedTerms.includes(term.id)));
    setCheckedTerms([]);
  };

  const appendTerm = (newTerm: ConceptTermType) => {
    setTerms([...terms, newTerm]);
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
          <BasicBlockExtraWrapper $isWide>
            <ExpanderGroup openAllText="" closeAllText="">
              {terms
                .filter((term) => term.termType === 'recommended-term')
                .map((term) => (
                  <TermExpander key={term.id} term={term}>
                    <TermForm term={term} update={handleUpdate} />
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
          <BasicBlockExtraWrapper $isWide>
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
                        <TermForm term={term} update={handleUpdate} />
                      </TermExpander>
                    ))}
                </OtherTermsExpanderGroup>

                <Button
                  onClick={() => handleRemoveTerms()}
                  disabled={checkedTerms.length < 1}
                >
                  Poista termi{checkedTerms.length > 1 && 't'}
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
