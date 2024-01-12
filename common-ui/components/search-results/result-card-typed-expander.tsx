import { TFunction, useTranslation } from 'next-i18next';
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
import { groupBy } from 'lodash';

const TypedExpanderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface ResultCardTypedExpanderProps {
  deepHits: {
    type: string;
    label: string;
    id: string;
    uri: string;
  }[];
  translateResultType: (type: string, t: TFunction) => string;
  translateGroupType: (type: string, t: TFunction) => string;
}

export default function ResultCardTypedExpander({
  deepHits,
  translateResultType,
  translateGroupType,
}: ResultCardTypedExpanderProps) {
  const { t } = useTranslation('common');
  const suffix = deepHits.length > 3 ? true : false;

  return (
    <Expander id="search-result-expander">
      <ExpanderTitleButton>
        {t('results-with-query')}
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
          <SanitizedTextContent
            text={`${hit.label} (${translateResultType(hit.type, t)})`}
          />
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
            <SanitizedTextContent
              text={`${hit.label} (${translateResultType(hit.type, t)})`}
            />
            {comma}
          </span>
        );
      });
  }

  function renderHitsInContent() {
    return (
      <TypedExpanderWrapper>
        {Object.entries(groupBy(deepHits, 'type')).map(([type, values]) => (
          <div key={type}>
            <ExpanderContentTitle variant="h4">
              {translateGroupType(type, t)}
            </ExpanderContentTitle>
            <div style={{ display: 'flex', gap: '15px' }}>
              {values.map((hit) => (
                <Link key={hit.id} href={hit.uri} passHref legacyBehavior>
                  <SuomiFiLink href="">
                    <SanitizedTextContent text={hit.label} />
                  </SuomiFiLink>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </TypedExpanderWrapper>
    );
  }
}
