import { BasicBlock } from '@app/common/components/block';
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
  const [isValid, setIsValid] = useState(false);
  const [newType, setNewType] = useState('');
  const [action, setAction] = useState<'change' | 'replace'>('change');
  const [prevNewType, setPrevNewType] = useState('');
  const currRecommended =
    currentTerm.termType !== 'recommended-term'
      ? currentTerms.filter(
        (term) =>
          term.termType === 'recommended-term' && term.language === lang
      )?.[0]
      : null;

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
      setIsValid(currRecommended ? false : true);
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
        oldRecommendedId: currRecommended?.id ?? '',
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
    >
      <ModalContent>
        <ModalTitle>{t('change-term-type')}</ModalTitle>

        <BasicBlock title={t('term-name-label')}>{t('application')}</BasicBlock>

        <BasicBlock title="Termin nykyinen tyyppi">
          {translateTermType(currentTerm.termType, t)}
        </BasicBlock>

        <DropdownBlock
          labelText={t('term-new-type')}
          visualPlaceholder={t('choose-type')}
          onChange={(e) => handleChange(e)}
        >
          {termTypes
            .filter((type) => type !== currentTerm.termType)
            .map((type, idx) => {
              return (
                <DropdownItem key={`term-type-${idx}`} value={type}>
                  {translateTermType(type, t)}
                </DropdownItem>
              );
            })}
        </DropdownBlock>

        {newType === 'recommended-term' && currRecommended && (
          <ModalTermTypeBlock>
            <InlineAlert>
              Jotta termin tyyppi voidaan muuttaa suositettavaksi, pitää
              nykyiselle suositettavalle termille muuttaa uusi tyyppi.
              Vaihtoehtoisesti voit myös poistaa nykyisen suositettavan termin.
            </InlineAlert>
            <BasicBlock title={'Nykyinen suositettava termi'}>
              {currentTerm.termType}
            </BasicBlock>

            <RadioButtonGroup
              defaultValue="change"
              labelText="Toimenpide"
              name="radio-button-group"
              onChange={(e) => handleActionChange(e as 'change' | 'replace')}
            >
              <RadioButton value="change">
                Muuta termin "{currRecommended.prefLabel}" tyyppi
              </RadioButton>
              <RadioButton value="replace">
                Poista termi "{currRecommended.prefLabel}" ja korvaa se termillä "{currentTerm.prefLabel}"
              </RadioButton>
            </RadioButtonGroup>

            {action === 'change' && (
              <DropdownBlock
                labelText={`Termin "${currRecommended.prefLabel}" uusi tyyppi`}
                onChange={(e) => handlePrevTermTypeChange(e)}
                defaultValue={prevNewType}
              >
                {termTypes
                  .filter((type) => type !== 'recommended-term')
                  .map((type, idx) => {
                    return (
                      <DropdownItem key={`term-type-${idx}`} value={type}>
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
        <Button disabled={!isValid} onClick={() => handleClick()}>
          {t('accept')}
        </Button>
        <Button variant="secondary" onClick={() => setVisibility(false)}>
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
