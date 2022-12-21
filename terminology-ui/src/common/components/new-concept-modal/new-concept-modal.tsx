import { TEXT_INPUT_MAX } from '@app/common/utils/constants';
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
import FormFooterAlert from '../form-footer-alert';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { TextInputBlock } from './new-concept-modal.styles';

interface NewConceptModalProps {
  terminologyId: string;
  languages: string[];
  visible: boolean;
  setVisible: (value: boolean) => void;
  unauthenticatedUser?: boolean;
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
  unauthenticatedUser,
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
              onChange={(e) =>
                handleChange({ lang, value: e?.toString().trim() ?? '' })
              }
              status={isError ? 'error' : 'default'}
              maxLength={TEXT_INPUT_MAX}
              className="concept-name-input"
              disabled={unauthenticatedUser}
            />
          ))}
        </TextInputBlock>
      </ModalContent>

      <ModalFooter>
        {unauthenticatedUser && (
          <InlineAlert status="error" role="alert" id="unauthenticated-alert">
            {t('error-occurred_unauthenticated', { ns: 'alert' })}
          </InlineAlert>
        )}
        {isError && (
          <FormFooterAlert alerts={[t('recommended-term-missing-error')]} />
        )}
        <Button
          onClick={() => handleClick()}
          id="submit-button"
          disabled={unauthenticatedUser}
        >
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
