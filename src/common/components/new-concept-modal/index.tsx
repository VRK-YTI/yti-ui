import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import { BasicBlock } from '../block';
import { BasicBlockExtraWrapper } from '../block/block.styles';
import Separator from '../separator';
import { TextInputBlock } from './new-concept-modal.styles';

interface NewConceptModalProps {
  terminologyId: string;
}

interface HandleChangeProps {
  lang: 'FI' | 'SV' | 'EN';
  value: string;
}

export default function NewConceptModal({
  terminologyId,
}: NewConceptModalProps) {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);
  const [termName, setTermName] = useState({ FI: '', SV: '', EN: '' });

  const handleChange = ({ lang, value }: HandleChangeProps) => {
    setTermName((termName) => ({ ...termName, [lang]: value }));
  };

  return (
    <>
      <Separator isLarge />

      <BasicBlock
        title={t('new-concept-to-terminology')}
        extra={
          <BasicBlockExtraWrapper>
            <Button
              icon="plus"
              variant="secondary"
              onClick={() => setVisible(true)}
            >
              {t('add-new-concept')}
            </Button>
          </BasicBlockExtraWrapper>
        }
      >
        {t('you-have-right-new-concept')}
      </BasicBlock>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
      >
        <ModalContent>
          <ModalTitle>{t('add-new-concept')}</ModalTitle>
          <Paragraph>
            <Text>{t('add-new-concept-description')}</Text>
          </Paragraph>

          <TextInputBlock>
            <TextInput
              labelText={t('recommended-term', { lang: 'FI' })}
              visualPlaceholder={t('term-name-placeholder')}
              onChange={(e) => handleChange({ lang: 'FI', value: e as string })}
            />

            <TextInput
              labelText={t('recommended-term', { lang: 'SV' })}
              visualPlaceholder={t('term-name-placeholder')}
              onChange={(e) => handleChange({ lang: 'SV', value: e as string })}
            />

            <TextInput
              labelText={t('recommended-term', { lang: 'EN' })}
              visualPlaceholder={t('term-name-placeholder')}
              onChange={(e) => handleChange({ lang: 'EN', value: e as string })}
            />
          </TextInputBlock>
        </ModalContent>

        <ModalFooter>
          <Link
            href={`/terminology/${terminologyId}/new-concept/${getTermName()}`}
            passHref
          >
            <Button>{t('continue')}</Button>
          </Link>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  function getTermName() {
    if (termName['FI']) {
      return termName['FI'];
    }

    if (termName['SV']) {
      return termName['SV'];
    }

    if (termName['EN']) {
      return termName['EN'];
    }
  }
}
