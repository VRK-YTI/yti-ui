import {MscrSearchResult, PatchedResult, ResultInfo} from '@app/common/interfaces/search.interface';
import {StaticChip} from 'suomifi-ui-components';
import {schemaApi} from '@app/common/components/schema/schema.slice';
import {crosswalkApi} from '@app/common/components/crosswalk/crosswalk.slice';


export default function SearchResult({ hit }: { hit: MscrSearchResult }) {

  const result = hit._source;
  let patchedResult: PatchedResult;
  if (result.type == 'SCHEMA') {
    const { data: schema } = schemaApi.useGetSchemaQuery(result.id);
    patchedResult = {
      ...result,
      description: schema?.description ?? {}
    };
  } else {
    const { data: crosswalk } = crosswalkApi.useGetCrosswalkQuery(result.id);
    patchedResult = {
      ...result,
      description: crosswalk?.description ?? {}
    };
  }

  return (
    <div>
      <h4>This is a search result of type {result.type} with id {result.id}</h4>
      {/* ToDo: Conditional icon here, depending on type. Where to find the icon?! */}
      <p>Where are names?? Here are some descriptions:</p>
      {patchedResult && Object.keys(patchedResult.description).map((key) => <p key={key}>{patchedResult.description[key]}</p>)}
      {Object.keys(result.label).map((key) => <StaticChip key={key}>{result.label[key]}</StaticChip>)}
    </div>
  );
}
