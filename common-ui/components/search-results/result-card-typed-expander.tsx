import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  Link as SuomiFiLink,
} from 'suomifi-ui-components';
import SanitizedTextContent from '../sanitized-text-content';
import {
  ExpanderContentTitle,
  ExpanderTitleHits,
  HitsWrapper,
} from './result-card-expander.styles';
import styled from 'styled-components';

const TypedExpanderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface ResultCardTypedExpanderProps {
  deepHits: {
    type: string;
    label: string;
    id: string;
    uri?: string;
  }[];
  typeLabels: { [key: string]: string };
  buttonLabel: string;
}

export default function ResultCardTypedExpander({
  deepHits,
  buttonLabel,
  typeLabels,
}: ResultCardTypedExpanderProps) {
  const { t } = useTranslation();
  const suffix = deepHits.length > 3 ? true : false;

  return (
    <Expander id="search-result-expander">
      <ExpanderTitleButton>
        Tuloksia hakusanalla
        <ExpanderTitleHits>
          {suffix ? renderHitsWithSuffix() : renderHits()}
        </ExpanderTitleHits>
      </ExpanderTitleButton>
      <ExpanderContent>
        <HitsWrapper>{renderHitsInContent()}</HitsWrapper>
      </ExpanderContent>
    </Expander>
  );

  function renderHits() {
    const totalHits = deepHits.length;

    return deepHits.map((hit, idx) => {
      const comma = idx < 2 && idx < totalHits - 1 ? ', ' : '';

      return (
        <span key={`${hit.id}-${idx}`}>
          <SanitizedTextContent text={`${hit.label} (${hit.type})`} />
          {comma}
        </span>
      );
    });
  }

  function renderHitsWithSuffix() {
    return deepHits
      .filter((_, idx) => idx < 3)
      .map((hit, idx) => {
        const comma =
          idx < 2
            ? ', '
            : ` + ${deepHits.length - 1 - idx} ${t('vocabulary-results-more')}`;

        return (
          <span key={`${hit.id}-${idx}`}>
            <SanitizedTextContent text={`${hit.label} (${hit.type})`} />
            {comma}
          </span>
        );
      });
  }

  function renderHitsInContent() {
    return (
      <TypedExpanderWrapper>
        {Object.keys(typeLabels)
          .filter((type) => deepHits.some((hit) => hit.type === type))
          .map((type) => (
            <div key="type">
              <ExpanderContentTitle variant="h4">
                {typeLabels[type]}
              </ExpanderContentTitle>
              <div style={{ display: 'flex', gap: '15px' }}>
                {deepHits
                  .filter((hit) => hit.type == type)
                  .map((hit, idx) => {
                    if (hit.uri) {
                      return (
                        <Link
                          key={`${hit.id}-${idx}`}
                          href={hit.uri}
                          passHref
                          legacyBehavior
                        >
                          <SuomiFiLink href="">
                            <SanitizedTextContent text={hit.label} />
                          </SuomiFiLink>
                        </Link>
                      );
                    } else {
                      return (
                        <SanitizedTextContent
                          text={hit.label}
                          key={`${hit.id}-${idx}`}
                        />
                      );
                    }
                  })}
              </div>
            </div>
          ))}
      </TypedExpanderWrapper>
    );
  }
}
