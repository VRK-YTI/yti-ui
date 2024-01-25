import {
  Crosswalk,
  CrosswalkFormType,
} from '@app/common/interfaces/crosswalk.interface';

// here we are creating crosswalk payload by converting the form data to crosswalk type

export default function generateCrosswalkPayload(
  data: CrosswalkFormType
): Crosswalk {
  return {
    format: data.format,
    description: data.languages
      .filter((l) => l.description !== '')
      .reduce(
        (obj, l) => ({
          ...obj,
          [l.uniqueItemId]: l.description,
        }),
        {}
      ),
    label: data.languages
      .filter((l) => l.title !== '')
      .reduce(
        (obj, l) => ({
          ...obj,
          [l.uniqueItemId]: l.title,
        }),
        {}
      ),
    languages: data.languages
      .filter((l) => l.title !== '')
      .map((l) => l.uniqueItemId),
    status: 'VALID',
    state: data.state,
    sourceSchema: data.sourceSchema,
    targetSchema: data.targetSchema,
    versionLabel: '1',
  };
}
