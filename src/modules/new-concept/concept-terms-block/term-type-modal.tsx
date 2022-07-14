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

interface TermTypeModalProps {
  setVisibility: (value: boolean) => void;
}

export default function TermTypeModal({ setVisibility }: TermTypeModalProps) {
  const { t } = useTranslation('admin');
  const [isValid, setIsValid] = useState(false);
  const [newType, setNewType] = useState<string>('');

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

  return (
    <Modal
      appElementId="__next"
      visible={true}
      onEscKeyDown={() => setVisibility(false)}
    >
      <ModalContent>
        <ModalTitle>Muuta termin tyyppi</ModalTitle>

        <BasicBlock title="Termin nimi">hakemus</BasicBlock>

        <BasicBlock title="Termin nykyinen tyyppi">
          Suositettava termi
        </BasicBlock>

        <DropdownBlock
          labelText={'Termin uusi tyyppi'}
          visualPlaceholder="Valitse tyyppi"
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
        <Button disabled={!isValid}>Hyväksy</Button>
        <Button variant="secondary" onClick={() => setVisibility(false)}>
          Peruuta
        </Button>
      </ModalFooter>
    </Modal>
  );
}
