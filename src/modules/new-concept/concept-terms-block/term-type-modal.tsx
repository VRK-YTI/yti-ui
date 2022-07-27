import { BasicBlock } from '@app/common/components/block';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  DropdownItem,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { DropdownBlock } from './concept-terms-block.styles';
import { TermFormUpdate } from './term-form';

interface TermTypeModalProps {
  setVisibility: (value: boolean) => void;
  handleUpdate: (value: TermFormUpdate) => void;
}

export default function TermTypeModal({
  setVisibility,
  handleUpdate,
}: TermTypeModalProps) {
  const { t } = useTranslation('admin');
  const [isValid, setIsValid] = useState(false);
  const [newType, setNewType] = useState('');

  const termTypes = [
    'recommended-term-no-suff',
    'synonym',
    'not-recommended-synonym',
    'search-term',
  ];

  const handleChange = (value: string) => {
    setNewType(value);
    setIsValid(value !== '');
  };

  const handleClick = () => {
    if (isValid) {
      handleUpdate({ key: 'termType', value: newType });
      setVisibility(false);
    }
    return;
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
          {t('recommended-term-no-suff')}
        </BasicBlock>

        <DropdownBlock
          labelText={t('term-new-type')}
          visualPlaceholder={t('choose-type')}
          onChange={(e) => handleChange(e)}
        >
          {termTypes
            .filter((type) => type !== 'recommended-term-no-suff')
            .map((type, idx) => {
              return (
                <DropdownItem key={`term-type-${idx}`} value={type}>
                  {t(type)}
                </DropdownItem>
              );
            })}
        </DropdownBlock>
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
