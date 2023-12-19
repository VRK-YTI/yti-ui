import { MscrSearchResult } from '@app/common/interfaces/search.interface';
import { Block, RouterLink } from 'suomifi-ui-components';
import {
  ChipWrapper, MetadataChip,
  ResultTextWrapper,
  TypeChip
} from '@app/modules/search/search-result/search-result.styles';
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
    description: result.comment,
    format: result.format,
  };
  let url;
  if (result.type == 'SCHEMA') {
    url = `/schema/${displayResult.pid}`;
  } else {
    url = `/crosswalk/${displayResult.pid}`;
  }
  let chips : string[] = [result.state];
  if (result.format) {
    chips = chips.concat(result.format);
  }

  return (
    <Block>
      <ResultTextWrapper>
        <Link href={url} passHref>
          <RouterLink onClick={() => setIsSearchActive(false)}>
            <h4>
              {getLanguageVersion({
                data: displayResult.label,
                lang,
                appendLocale: true,
              })}
            </h4>
          </RouterLink>
        </Link>
        <ChipWrapper>
          {result.type == 'SCHEMA' && (
            <TypeChip $isSchema>{result.type}</TypeChip>
          )}
          {result.type != 'SCHEMA' && (
            <TypeChip>{result.type}</TypeChip>
          )}
        </ChipWrapper>
        <p>
          {getLanguageVersion({
            data: displayResult.description,
            lang,
            appendLocale: true,
          })}
        </p>
        {chips.map((chip) => (
          <ChipWrapper key={chip}>
            <MetadataChip>{chip}</MetadataChip>
          </ChipWrapper>
        ))}
      </ResultTextWrapper>
    </Block>
  );
}
