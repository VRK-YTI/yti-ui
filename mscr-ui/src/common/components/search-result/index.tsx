import {
  MscrSearchResult,
  PatchedResult,
  ResultInfo,
} from '@app/common/interfaces/search.interface';
import { Block, StaticChip } from 'suomifi-ui-components';
import { schemaApi } from '@app/common/components/schema/schema.slice';
import { crosswalkApi } from '@app/common/components/crosswalk/crosswalk.slice';
import { IconMerge, IconFileGeneric } from 'suomifi-icons';
import {
  ResultIconWrapper,
  ResultTextWrapper,
  ChipWrapper,
} from '@app/common/components/search-result/search-result.styles';

export default function SearchResult({ hit }: { hit: MscrSearchResult }) {
  const result = hit._source;
  let patchedResult: PatchedResult;
  let icon;
  if (result.type == 'SCHEMA') {
    icon = <IconFileGeneric />;
    const { data: schema } = schemaApi.useGetSchemaQuery(result.id);
    patchedResult = {
      ...result,
      description: schema?.description ?? {},
    };
  } else {
    icon = <IconMerge />;
    const { data: crosswalk } = crosswalkApi.useGetCrosswalkQuery(result.id);
    patchedResult = {
      ...result,
      description: crosswalk?.description ?? {},
    };
  }

  return (
    <Block>
      <ResultIconWrapper>{icon}</ResultIconWrapper>
      <ResultTextWrapper>
        <h4>
          This is a search result of type {result.type} with id {result.id}
        </h4>
        <p>Where are names?? Here's a placeholder for a description</p>
        {/* patchedResult && Object.keys(patchedResult.description).map((key) => <p key={key}>{patchedResult.description[key]}</p>) */}
        {Object.keys(result.label).map((key) => (
          <ChipWrapper key={key}>
            <StaticChip>{result.label[key]}</StaticChip>
          </ChipWrapper>
        ))}
      </ResultTextWrapper>
    </Block>
  );
}
