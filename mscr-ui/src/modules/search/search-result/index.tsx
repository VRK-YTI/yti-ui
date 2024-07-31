import { MscrSearchResult } from '@app/common/interfaces/search.interface';
import { Block, Paragraph } from 'suomifi-ui-components';
import {
  ChipWrapper,
  MetadataChip,
  StyledRouterLink,
  TypeChip,
} from '@app/modules/search/search-result/search-result.styles';
import { Schema } from '@app/common/interfaces/schema.interface';
import router from 'next/router';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import Link from 'next/link';
import { useContext } from 'react';
import { SearchContext } from '@app/common/components/search-context-provider';
import { useStoreDispatch } from '@app/store';
import {
  setIsEditContentActive,
  setIsEditMetadataActive
} from '@app/common/components/content-view/content-view.slice';

export default function SearchResult({ hit }: { hit: MscrSearchResult }) {
  const { setIsSearchActive } = useContext(SearchContext);
  const lang = router.locale ?? '';
  const dispatch = useStoreDispatch();

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
  const localizedLabel = getLanguageVersion({
    data: displayResult.label,
    lang,
    appendLocale: true,
  });
  const localizedDescription = getLanguageVersion({
    data: displayResult.description,
    lang,
    appendLocale: true,
  });
  let url;
  if (result.type == 'SCHEMA') {
    url = `/schema/${displayResult.pid}`;
  } else {
    url = `/crosswalk/${displayResult.pid}`;
  }
  let chips: string[] = [result.state];
  if (result.format) {
    chips = chips.concat(result.format);
  }

  const handleNavigate = () => {
    setIsSearchActive(false);
    dispatch(setIsEditMetadataActive(false));
    dispatch(setIsEditContentActive(false));
  };

  return (
    <Link href={url} passHref>
      <StyledRouterLink
        onClick={() => handleNavigate()}
        aria-label={localizedLabel}
      >
        <Block>
          <h4>{localizedLabel}</h4>
          <ChipWrapper>
            {result.type == 'SCHEMA' && (
              <TypeChip $isSchema>{result.type}</TypeChip>
            )}
            {result.type != 'SCHEMA' && <TypeChip>{result.type}</TypeChip>}
          </ChipWrapper>
          <Paragraph>{localizedDescription}</Paragraph>
          {chips.map((chip) => (
            <ChipWrapper key={chip}>
              <MetadataChip>{chip}</MetadataChip>
            </ChipWrapper>
          ))}
        </Block>
      </StyledRouterLink>
    </Link>
  );
}
