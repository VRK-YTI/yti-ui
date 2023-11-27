import { MscrSearchResult } from '@app/common/interfaces/search.interface';
import { Block, StaticChip } from 'suomifi-ui-components';
import { IconMerge, IconFileGeneric } from 'suomifi-icons';
import {
  ResultIconWrapper,
  ResultTextWrapper,
  ChipWrapper,
} from '@app/common/components/search-result/search-result.styles';
import { Schema } from '@app/common/interfaces/schema.interface';
import { useTranslation } from 'next-i18next';
import router from 'next/router';
import { getLanguageVersion } from '@app/common/utils/get-language-version';

export default function SearchResult({ hit }: { hit: MscrSearchResult }) {
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
  if (result.type == 'SCHEMA') {
    icon = <IconFileGeneric />;

  } else {
    icon = <IconMerge />;
  }

  return (
    <Block>
      <ResultIconWrapper>{icon}</ResultIconWrapper>
      <ResultTextWrapper>
        <h4>
          {getLanguageVersion({ data: displayResult.label, lang, appendLocale: true })}
        </h4>
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
