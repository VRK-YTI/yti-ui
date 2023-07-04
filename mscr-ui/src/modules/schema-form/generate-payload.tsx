import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { NewModel } from '@app/common/interfaces/new-model.interface';

// here we can create the schema payload

export default function generatePayload(data: ModelFormType): NewModel {
  const SUOMI_FI_NAMESPACE = 'http://uri.suomi.fi/datamodel/ns/';

  return {
    id: `${SUOMI_FI_NAMESPACE}${data.prefix}`,
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
    groups: data.serviceCategories.map((s) => s.uniqueItemId),
    languages: data.languages
      .filter((l) => l.title !== '')
      .map((l) => l.uniqueItemId),
    organizations: data.organizations.map((o) => o.uniqueItemId),
    prefix: data.prefix,
    status: 'DRAFT',
    type: data.type.toUpperCase(),
  };
}
