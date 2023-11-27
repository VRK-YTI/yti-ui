import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { NewModel } from '@app/common/interfaces/new-model.interface';
import { ADMIN_EMAIL, SUOMI_FI_NAMESPACE } from '@app/common/utils/get-value';

export default function generatePayload(data: ModelFormType): NewModel {
  return {
    id: `${SUOMI_FI_NAMESPACE}${data.prefix}/`,
    description: data.languages
      .filter((l) => l.description !== '')
      .reduce(
        (obj, l) => ({
          ...obj,
          [l.uniqueItemId]: l.description,
        }),
        {}
      ),
    label: data.languages.reduce(
      (obj, l) => ({
        ...obj,
        [l.uniqueItemId]: l.title,
      }),
      {}
    ),
    groups: data.serviceCategories.map((s) => s.uniqueItemId),
    languages: data.languages.map((l) => l.uniqueItemId),
    organizations: data.organizations.map((o) => o.uniqueItemId),
    prefix: data.prefix,
    type: data.type.toUpperCase(),
    contact: data.contact !== '' ? data.contact : ADMIN_EMAIL,
  };
}
