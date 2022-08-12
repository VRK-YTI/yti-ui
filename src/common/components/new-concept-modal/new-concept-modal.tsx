import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Button,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import { useBreakpoints } from '../media-query/media-query-context';
import { TextInputBlock } from './new-concept-modal.styles';

interface NewConceptModalProps {
  terminologyId: string;
  languages: string[];
  visible: boolean;
  setVisible: (value: boolean) => void;
}

interface HandleChangeProps {
  lang: string;
  value: string;
}

export default function NewConceptModal({
  terminologyId,
  languages,
  visible,
  setVisible,
}: NewConceptModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [termName, setTermName] = useState<{ [key: string]: string }>({});
  const [isError, setIsError] = useState(false);
  const queryParams = new URLSearchParams(termName).toString();
  const router = useRouter();

  const handleChange = ({ lang, value }: HandleChangeProps) => {
    const newTerms = { ...termName, [lang]: value };
    setTermName(newTerms);

    if (
      isError &&
      Object.keys(newTerms).some((lang) => termName[lang] !== '')
    ) {
      setIsError(false);
    }
  };

  const handleClick = () => {
    const termLangs = Object.keys(termName);
    if (
      termLangs.length < 1 ||
      !termLangs.some((lang) => termName[lang] !== '')
    ) {
      setIsError(true);
      return;
    }

    setIsError(false);
    router.push(`/terminology/${terminologyId}/new-concept?${queryParams}`);
  };

  return (
    <Modal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => setVisible(false)}
      variant={!isSmall ? 'default' : 'smallScreen'}
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
              status={isError ? 'error' : 'default'}
              className="concept-name-input"
            />
          ))}
        </TextInputBlock>
      </ModalContent>

      <ModalFooter>
        {isError && (
          <InlineAlert status="warning">
            {t('recommended-term-missing-error')}
          </InlineAlert>
        )}
        <Button onClick={() => handleClick()} id="submit-button">
          {t('continue')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setVisible(false)}
          id="cancel-button"
        >
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
