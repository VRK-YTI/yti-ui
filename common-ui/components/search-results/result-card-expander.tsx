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

interface ResultCardExpanderProps {
  deepHits: {
    label: string;
    id: string;
    uri?: string;
  }[];
  buttonLabel: string;
  contentLabel: string;
}

export default function ResultCardExpander({
  deepHits,
  buttonLabel,
  contentLabel,
}: ResultCardExpanderProps) {
  const { t } = useTranslation();
  const suffix = deepHits.length > 3 ? true : false;

  return (
    <Expander id="search-result-expander">
      <ExpanderTitleButton>
        {buttonLabel}
        <ExpanderTitleHits>
          {suffix ? renderHitsWithSuffix() : renderHits()}
        </ExpanderTitleHits>
      </ExpanderTitleButton>
      <ExpanderContent>
        <ExpanderContentTitle variant="h4">{contentLabel}</ExpanderContentTitle>
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
          <SanitizedTextContent text={hit.label} />
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
            <SanitizedTextContent text={hit.label} />
            {comma}
          </span>
        );
      });
  }

  function renderHitsInContent() {
    return deepHits.map((hit, idx) => {
      if (hit.uri) {
        return (
          <Link key={`${hit.id}-${idx}`} href={hit.uri} passHref legacyBehavior>
            <SuomiFiLink href="">
              <SanitizedTextContent text={hit.label} />
            </SuomiFiLink>
          </Link>
        );
      } else {
        return (
          <SanitizedTextContent text={hit.label} key={`${hit.id}-${idx}`} />
        );
      }
    });
  }
}
