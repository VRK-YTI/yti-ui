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
import { Term } from '@app/common/interfaces/term.interface';
import { Property } from '@app/common/interfaces/termed-data-types.interface';
import { selectLogin } from '@app/common/components/login/login.slice';
import PropertyValue from '@app/common/components/property-value';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
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
  translateTermStyle,
  translateWordClass,
} from '@app/common/utils/translation-helpers';

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
        {/*
          Note: Preferencing upper solution instead of <PropertyValue />
          because term should only have one prefLabel. If prefLabel is
          in English and the language used is Finnish the button won't
          be rendered. Same solution in <ModalTitle /> below.
        */}
        {data.term.properties.prefLabel?.[0].value ?? (
          <PropertyValue property={data.term.properties.prefLabel} />
        )}
      </TermModalButton>
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => setVisible(false)}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>
            {data.term.properties.prefLabel?.[0].value ?? (
              <PropertyValue property={data.term.properties.prefLabel} />
            )}
          </ModalTitle>

          {renderInfo(t('term-modal-type'), data.type)}
          {renderInfoChip(
            t('term-modal-status'),
            data.term.properties.status,
            'DRAFT'
          )}
          {renderInfo(
            t('term-modal-homograph-number'),
            data.term.properties.termHomographNumber?.[0].value
          )}
          {renderInfo(
            t('term-modal-info'),
            data.term.properties.termInfo?.[0].value
          )}
          {renderInfo(
            t('term-modal-scope'),
            data.term.properties.scope?.[0].value
          )}
          {renderInfo(
            t('term-modal-equivalency'),
            data.term.properties.termEquivalency?.[0].value
          )}
          {renderInfo(
            t('term-modal-source'),
            data.term.properties.source?.map((source) => source.value)
          )}

          <TermExpander
            title={t('term-modal-organizational-information')}
            data={[
              {
                subtitle: t('term-modal-change-note'),
                value: data.term.properties.changeNote?.[0].value,
              },
              {
                subtitle: t('term-modal-history-note'),
                value: data.term.properties.historyNote?.[0].value,
              },
              {
                subtitle: t('term-modal-editorial-note'),
                value: data.term.properties.editorialNote?.map(
                  (note) => note.value
                ),
                checkCondition: !user.anonymous,
              },
              {
                subtitle: t('term-modal-draft-note'),
                value: data.term.properties.draftComment?.[0].value,
                checkCondition:
                  data.term.properties.status?.[0].value === 'DRAFT',
              },
            ]}
          />
          <TermExpander
            title={t('term-modal-grammatic-information')}
            data={[
              {
                subtitle: t('term-modal-style'),
                value: translateTermStyle(
                  data.term.properties.termStyle?.[0].value ?? '',
                  t
                ),
              },
              {
                subtitle: t('term-modal-family'),
                value: translateTermFamily(
                  data.term.properties.termFamily?.[0].value ?? '',
                  t
                ),
              },
              {
                subtitle: t('term-modal-conjugation'),
                value: translateTermConjugation(
                  data.term.properties.termConjugation?.[0].value ?? '',
                  t
                ),
              },
              {
                subtitle: t('term-modal-word-class'),
                value: translateWordClass(
                  data.term.properties.wordClass?.[0].value ?? '',
                  t
                ),
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

  function renderInfo(subtitle: string, value?: string | string[]) {
    if (!value) {
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

  function renderInfoChip(
    subtitle: string,
    value?: Property[],
    defaultValue = ''
  ) {
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
          $isValid={value[0].value === 'VALID' ? 'true' : undefined}
        >
          {translateStatus(
            getPropertyValue({ property: value }) ?? defaultValue,
            t
          )}
        </TermModalChip>
      </>
    );
  }
}
