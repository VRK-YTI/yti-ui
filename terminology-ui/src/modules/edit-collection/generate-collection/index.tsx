import { LocalizedValue } from '@app/common/interfaces/interfaces-v2';
import { CollectionFormData } from '../edit-collection.types';

export default function generateCollection(
  formData: CollectionFormData,
  isEdit: boolean
) {
  // remove empty values
  const description = Object.keys(formData.description).reduce(
    (description, lang) => {
      if (formData.description[lang]) {
        description[lang] = formData.description[lang];
      }
      return description;
    },
    {} as LocalizedValue
  );

  const payload = Object.assign(
    {},
    {
      ...formData,
      description,
      members: formData.members.map((member) => member.identifier),
    }
  );

  if (isEdit) {
    Object.assign(payload, { identifier: null });
  }

  return payload;
}
