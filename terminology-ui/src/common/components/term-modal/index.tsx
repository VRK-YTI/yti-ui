import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { selectLogin } from '@app/common/components/login/login.slice';
import TermExpander from './term-expander';
import {
  TermHeading,
  PropertyList,
  TermModalButton,
  TermModalChip,
  TermText,
} from './term-modal.styles';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  translateStatus,
  translateTermConjugation,
  translateTermFamily,
  translateWordClass,
} from '@app/common/utils/translation-helpers';
import { Term } from '@app/common/interfaces/interfaces-v2';

interface TermModalProps {
  data?: { term: Term; type: string };
}

export default function TermModal({ data }: TermModalProps) {
  const { t } = useTranslation('concept');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState<boolean>(false);
  const user = useSelector(selectLogin());

  if (!data) {
    return null;
  }

  return (
    <>
      <TermModalButton
        variant="secondaryNoBorder"
        onClick={() => setVisible(true)}
      >
        {data.term.label}
      </TermModalButton>
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{data.term.label}</ModalTitle>
          {renderInfo(t('term-modal-type'), data.type)}
          {renderInfoChip(
            t('term-modal-status'),
            data.term.status ?? 'DRAFT',
            'DRAFT'
          )}
          {renderInfo(
            t('term-modal-homograph-number'),
            data.term.homographNumber
          )}
          {renderInfo(t('term-modal-info'), data.term.termInfo)}
          {renderInfo(t('term-modal-scope'), data.term.scope)}
          {renderInfo(t('term-modal-equivalency'), data.term.termEquivalency)}
          {renderInfo(t('term-modal-source'), data.term.sources)}

          <TermExpander
            title={t('term-modal-organizational-information')}
            data={[
              {
                subtitle: t('term-modal-change-note'),
                value: data.term.changeNote,
              },
              {
                subtitle: t('term-modal-history-note'),
                value: data.term.historyNote,
              },
              {
                subtitle: t('term-modal-editorial-note'),
                value: data.term.editorialNotes,
                checkCondition: !user.anonymous,
              },
            ]}
          />
          <TermExpander
            title={t('term-modal-grammatic-information')}
            data={[
              {
                subtitle: t('term-modal-style'),
                value: data.term.termStyle,
              },
              {
                subtitle: t('term-modal-family'),
                value: translateTermFamily(data.term.termFamily ?? '', t),
              },
              {
                subtitle: t('term-modal-conjugation'),
                value: translateTermConjugation(
                  data.term.termConjugation ?? '',
                  t
                ),
              },
              {
                subtitle: t('term-modal-word-class'),
                value: translateWordClass(data.term.wordClass ?? '', t),
              },
            ]}
          />
        </ModalContent>

        <ModalFooter>
          <Button
            onClick={() => setVisible(false)}
            aria-label={t('term-modal-arial-close')}
          >
            {t('term-modal-close')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  function renderInfo(subtitle: string, value?: string | number | string[]) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return null;
    }

    return (
      <>
        <TermHeading variant="h3">{subtitle}</TermHeading>
        {Array.isArray(value) ? (
          <PropertyList>
            {value.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </PropertyList>
        ) : (
          <TermText>{value}</TermText>
        )}
      </>
    );
  }

  function renderInfoChip(subtitle: string, value?: string, defaultValue = '') {
    if (!value) {
      return null;
    }

    return (
      <>
        <TermHeading variant="h3">{subtitle}</TermHeading>
        {/* Note: Using "condition ? X : undefined" form here because nextjs can't handle
            passed booleans properly with suomifi-ui-components/styled-components.
        */}
        <TermModalChip
          aria-disabled={true}
          $isValid={value === 'VALID' ? 'true' : undefined}
        >
          {translateStatus(value ?? defaultValue, t)}
        </TermModalChip>
      </>
    );
  }
}
