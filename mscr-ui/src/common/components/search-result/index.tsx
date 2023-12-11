import { MscrSearchResult } from '@app/common/interfaces/search.interface';
import { Block, RouterLink } from 'suomifi-ui-components';
import {
  ChipWrapper,
  ResultTextWrapper,
  TypeChip,
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
    description: result.comment,
  };
  let url;
  if (result.type == 'SCHEMA') {
    url = `/schema/${displayResult.pid}`;
  } else {
    url = `/crosswalk/${displayResult.pid}`;
  }

  return (
    <Block>
      <ResultTextWrapper>
        <Link href={url}>
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
        {/*TODO: What exactly is supposed to be in the chips?
        {Object.keys(result.label).map((key) => (
          <ChipWrapper key={key}>
            <StaticChip>{result.label[key]}</StaticChip>
          </ChipWrapper>
        ))}*/}
      </ResultTextWrapper>
    </Block>
  );
}
