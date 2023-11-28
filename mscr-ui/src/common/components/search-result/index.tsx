import { MscrSearchResult } from '@app/common/interfaces/search.interface';
import { Block, RouterLink, StaticChip } from 'suomifi-ui-components';
import { IconMerge, IconFileGeneric } from 'suomifi-icons';
import {
  ResultIconWrapper,
  ResultTextWrapper,
  ChipWrapper,
} from '@app/common/components/search-result/search-result.styles';
import { Schema } from '@app/common/interfaces/schema.interface';
import router from 'next/router';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import Link from 'next/link';
import { useContext } from 'react';
import { SearchContext } from '@app/common/components/search-context-provider';

export default function SearchResult({ hit }: { hit: MscrSearchResult }) {
  const { setIsSearchActive } = useContext(SearchContext);
  const lang = router.locale ?? '';

  const result = hit._source;
  const displayResult: Partial<Schema> = {
    label: result.label,
    namespace: result.namespace,
    pid: result.id,
    state: result.state,
    versionLabel: result.versionLabel,
    description: result.comment
  };
  let icon;
  let url;
  if (result.type == 'SCHEMA') {
    icon = <IconFileGeneric />;
    url = `/schema/${displayResult.pid}`;
  } else {
    icon = <IconMerge />;
    url = `/crosswalk/${displayResult.pid}`;
  }

  return (
    <Block>
      <ResultIconWrapper>{icon}</ResultIconWrapper>
      <ResultTextWrapper>
        <Link href={url}>
          <RouterLink onClick={() => setIsSearchActive(false)}>
            <h4>
              {getLanguageVersion({ data: displayResult.label, lang, appendLocale: true })}
            </h4>
          </RouterLink>
        </Link>
        <p>{getLanguageVersion({ data: displayResult.description, lang, appendLocale: true })}</p>
        {/*TODO: What exactly is supposed to be in the chips?*/}
        {Object.keys(result.label).map((key) => (
          <ChipWrapper key={key}>
            <StaticChip>{result.label[key]}</StaticChip>
          </ChipWrapper>
        ))}
      </ResultTextWrapper>
    </Block>
  );
}
