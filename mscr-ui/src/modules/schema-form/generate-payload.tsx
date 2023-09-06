/* eslint-disable */
import { SchemaFormType } from '@app/common/interfaces/schema.interface';

// here we can create the schema payload

export default function generatePayload(data: SchemaFormType): SchemaFormType {
  const SUOMI_FI_NAMESPACE = 'http://uri.suomi.fi/datamodel/ns/';

  return {
    // id will be pid , during post no id
    description: data.languages
      .filter((l: { description: string }) => l.description !== '')
      .reduce(
        (obj: any, l: { uniqueItemId: any; description: any }) => ({
          ...obj,
          [l.uniqueItemId]: l.description,
        }),
        {}
      ),
    label: data.languages
      .filter((l: { title: string }) => l.title !== '')
      .reduce(
        (obj: any, l: { uniqueItemId: any; title: any }) => ({
          ...obj,
          [l.uniqueItemId]: l.title,
        }),
        {}
      ),
    languages: data.languages
      .filter((l: { title: string }) => l.title !== '')
      .map((l: { uniqueItemId: any }) => l.uniqueItemId),
    organizations: data.organizations.map(
      (o: { uniqueItemId: any }) => o.uniqueItemId
    ),
    status: 'DRAFT',
    format: 'JSONSCHEMA',
  };
}
