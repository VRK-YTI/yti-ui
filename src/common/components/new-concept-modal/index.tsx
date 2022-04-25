import { useTranslation } from 'next-i18next';
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

export default function NewConceptModal() {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);

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
            />

            <TextInput
              labelText={t('recommended-term', { lang: 'SV' })}
              visualPlaceholder={t('term-name-placeholder')}
            />

            <TextInput
              labelText={t('recommended-term', { lang: 'EN' })}
              visualPlaceholder={t('term-name-placeholder')}
            />
          </TextInputBlock>
        </ModalContent>

        <ModalFooter>
          <Button>{t('continue')}</Button>
          <Button variant="secondary" onClick={() => setVisible(false)}>
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
