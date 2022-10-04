import { DeepHitsDTO } from '@app/common/interfaces/terminology.interface';
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
  deepHits: DeepHitsDTO[];
  buttonLabel: string;
  contentLabel: string;
  terminologyId: string;
}

export default function ResultCardExpander({
  deepHits,
  buttonLabel,
  contentLabel,
  terminologyId,
}: ResultCardExpanderProps) {
  const { t, i18n } = useTranslation();
  const suffix =
    deepHits.map((hit) => hit.totalHitCount).reduce((count) => count + count) >
    3
      ? true
      : false;

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
        <HitsWrapper>{renderHitsInContent(terminologyId)}</HitsWrapper>
      </ExpanderContent>
    </Expander>
  );

  function renderHits() {
    const totalHits = deepHits
      .map((dh) => dh.totalHitCount)
      .reduce((count) => count + count);

    return deepHits.map((deepHit, hitIdx) => {
      return deepHit.topHits
        .filter((_, idx) => hitIdx + idx < 3)
        .map((topHit, idx) => {
          const comma = hitIdx + idx < 2 && idx < totalHits - 1 ? ', ' : '';

          return (
            <>
              <SanitizedTextContent text={getText(topHit.label)} />
              {comma}
            </>
          );
        });
    });
  }

  function renderHitsWithSuffix() {
    return deepHits.map((deepHit, hitIdx) => {
      return deepHit.topHits
        .filter((_, idx) => hitIdx + idx < 3)
        .map((topHit, idx) => {
          const comma =
            hitIdx + idx < 2
              ? ', '
              : ` + ${
                  deepHits
                    .map((dh) => dh.totalHitCount)
                    .reduce((dh) => dh + dh) - 3
                } ${t('vocabulary-results-more')}`;

          return (
            <>
              <SanitizedTextContent text={getText(topHit.label)} />
              {comma}
            </>
          );
        });
    });
  }

  function renderHitsInContent(terminologyId: string) {
    return deepHits.map((deepHit, hitIdx) =>
      deepHit.topHits.map((hit, idx) => {
        if (hit.uri) {
          return (
            <Link
              key={`${hitIdx}-${idx}`}
              href={`/terminology/${terminologyId}/concept/${hit.id}`}
              passHref
            >
              <SuomiFiLink href="">
                <SanitizedTextContent text={getText(hit.label)} />
              </SuomiFiLink>
            </Link>
          );
        } else {
          return (
            <SanitizedTextContent
              key={hit.id ?? idx}
              text={getText(hit.label)}
            />
          );
        }
      })
    );
  }

  function getText(label: { [key: string]: string }) {
    if (label[i18n.language]) {
      return label[i18n.language];
    }

    if (label['fi']) {
      return label['fi'];
    }

    if (label[Object.keys(label)[0]]) {
      return label[Object.keys(label)[0]];
    }

    return '';
  }
}
