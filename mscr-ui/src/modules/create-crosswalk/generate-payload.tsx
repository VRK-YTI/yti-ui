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
    format: data.format,
    description: data.description,
    label: data.label,
    languages: data.languages,
    organizations: data.organizations,
    status: data.status,
    state: data.status,
    sourceSchema: data.sourceSchema,
    targetSchema: data.targetSchema,
    versionLabel: data.versionLabel,
  };
}
