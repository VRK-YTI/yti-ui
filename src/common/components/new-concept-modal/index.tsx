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
  languages: string[];
}

interface HandleChangeProps {
  lang: string;
  value: string;
}

export default function NewConceptModal({
  terminologyId,
  languages,
}: NewConceptModalProps) {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);
  const [termName, setTermName] = useState({});
  const queryParams = new URLSearchParams(termName).toString();

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
            {languages.map((lang) => (
              <TextInput
                key={lang}
                labelText={t('recommended-term', { lang: lang.toUpperCase() })}
                visualPlaceholder={t('term-name-placeholder')}
                onChange={(e) => handleChange({ lang, value: e as string })}
              />
            ))}
          </TextInputBlock>
        </ModalContent>

        <ModalFooter>
          <Link
            href={`/terminology/${terminologyId}/new-concept?${queryParams}`}
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
}
