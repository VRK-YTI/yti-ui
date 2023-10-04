import {
  CreateCrosswalkMockupType,
  Crosswalk,
  CrosswalkFormMockupType,
  CrosswalkFormType,
} from '@app/common/interfaces/crosswalk.interface';

// here we are creating crosswalk payload by converting the form data to crosswalk type

export default function generatePayload(
  data: CrosswalkFormMockupType
): CreateCrosswalkMockupType {
  return {
    description: data.description,
    name: data.name,
    sourceSchema: data.sourceSchema,
    targetSchema: data.targetSchema,
  };
}
