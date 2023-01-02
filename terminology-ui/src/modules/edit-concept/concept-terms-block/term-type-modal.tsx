import { BasicBlock } from 'yti-common-ui/block';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { translateTermType } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  DropdownItem,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  RadioButton,
  RadioButtonGroup,
} from 'suomifi-ui-components';
import { HandleSwitchTermsProps } from '.';
import { ConceptTermType } from '../new-concept.types';
import {
  DropdownBlock,
  ModalTermTypeBlock,
} from './concept-terms-block.styles';
import { TermFormUpdate } from './term-form';

interface TermTypeModalProps {
  currentTerm: ConceptTermType;
  lang: string;
  setVisibility: (value: boolean) => void;
  handleUpdate: (value: TermFormUpdate) => void;
  currentTerms: ConceptTermType[];
  handleSwitchTerms: (value: HandleSwitchTermsProps) => void;
}

export default function TermTypeModal({
  currentTerm,
  lang,
  setVisibility,
  handleUpdate,
  currentTerms,
  handleSwitchTerms,
}: TermTypeModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [isValid, setIsValid] = useState(false);
  const [newType, setNewType] = useState('');
  const [action, setAction] = useState<'change' | 'replace'>('change');
  const [prevNewType, setPrevNewType] = useState('');

  const recommendedTerms = currentTerms.filter(
    (t) => t.termType === 'recommended-term'
  );
  const isChangeDisabled =
    recommendedTerms.filter((t) => t.id !== currentTerm.id).length < 1;
  const currentRecommendedTerm =
    currentTerm.termType !== 'recommended-term'
      ? recommendedTerms.filter((t) => t.language === lang)?.[0]
      : undefined;

  const termTypes = [
    'recommended-term',
    'synonym',
    'not-recommended-synonym',
    'search-term',
  ];

  const handleChange = (value: string) => {
    setNewType(value);
    if (value !== '' && value !== 'recommended-term') {
      setIsValid(true);
      setPrevNewType('');
    } else {
      setIsValid(currentRecommendedTerm ? false : true);
    }
  };

  const handleActionChange = (e: 'change' | 'replace') => {
    setAction(e);
    if (!prevNewType && e === 'change') {
      setIsValid(false);
    }
    if (e === 'replace') {
      setIsValid(true);
    }
  };

  const handlePrevTermTypeChange = (e: string) => {
    setPrevNewType(e);
    setIsValid(true);
  };

  const handleClick = () => {
    if (newType === 'recommended-term') {
      handleSwitchTerms({
        actionType: action,
        newRecommendedId: currentTerm.id,
        oldRecommendedId: currentRecommendedTerm?.id ?? '',
        newType: prevNewType,
      });
    } else {
      handleUpdate({ key: 'termType', value: newType });
    }
    setVisibility(false);
  };

  return (
    <Modal
      appElementId="__next"
      visible={true}
      onEscKeyDown={() => setVisibility(false)}
      style={{ width: '540px' }}
      variant={isSmall ? 'smallScreen' : 'default'}
    >
      <ModalContent>
        <ModalTitle>{t('change-term-type')}</ModalTitle>

        <BasicBlock title={t('term-name-label')}>
          {currentTerm.prefLabel}
        </BasicBlock>

        <BasicBlock title={t('term-current-type')}>
          {translateTermType(currentTerm.termType, t)}
        </BasicBlock>

        <DropdownBlock
          labelText={t('term-new-type')}
          visualPlaceholder={t('choose-type')}
          onChange={(e) => handleChange(e)}
          id="term-type-picker"
        >
          {termTypes
            .filter((type) => type !== currentTerm.termType)
            .map((type) => {
              return (
                <DropdownItem key={type} value={type}>
                  {translateTermType(type, t)}
                </DropdownItem>
              );
            })}
        </DropdownBlock>

        {newType === 'recommended-term' && currentRecommendedTerm && (
          <ModalTermTypeBlock>
            <InlineAlert>{t('term-type-change-hint')}</InlineAlert>
            <BasicBlock title={t('current-recommended-term')}>
              {currentRecommendedTerm.prefLabel}
            </BasicBlock>

            <RadioButtonGroup
              defaultValue="change"
              labelText={t('action')}
              name="radio-button-group"
              onChange={(e) => handleActionChange(e as 'change' | 'replace')}
            >
              <RadioButton value="change">
                {t('change-term-x-type', {
                  termName: currentRecommendedTerm.prefLabel,
                })}
              </RadioButton>
              <RadioButton value="replace">
                {t('remove-and-replace-term', {
                  recommended: currentRecommendedTerm.prefLabel,
                  current: currentTerm.prefLabel,
                })}
              </RadioButton>
            </RadioButtonGroup>

            {action === 'change' && (
              <DropdownBlock
                labelText={t('term-x-new-type', {
                  term: currentRecommendedTerm.prefLabel,
                })}
                onChange={(e) => handlePrevTermTypeChange(e)}
                defaultValue={prevNewType}
              >
                {termTypes
                  .filter((type) => type !== 'recommended-term')
                  .map((type) => {
                    return (
                      <DropdownItem key={type} value={type}>
                        {translateTermType(type, t)}
                      </DropdownItem>
                    );
                  })}
              </DropdownBlock>
            )}
          </ModalTermTypeBlock>
        )}
      </ModalContent>

      <ModalFooter>
        {isChangeDisabled && (
          <InlineAlert status="warning">
            {t('type-change-alert-warning')}
          </InlineAlert>
        )}
        <Button
          disabled={isChangeDisabled || !isValid}
          onClick={() => handleClick()}
          id="submit-button"
        >
          {t('accept')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setVisibility(false)}
          id="cancel-button"
        >
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
