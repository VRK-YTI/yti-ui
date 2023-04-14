import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';

export function internalClassToClassForm(
  data: InternalClass,
  languages: string[]
): ClassFormType {
  const label = languages.reduce((acc, lang) => ({ ...acc, [lang]: '' }), {});

  return {
    editorialNote: '',
    equivalentClass: [],
    identifier: '',
    label: label,
    inheritedAttributes: [],
    note: {},
    ownAttributes: [],
    subClassOf: [
      {
        label:
          data.id.split('/').pop()?.replace('#', ':') ??
          `${data.isDefinedBy.split('/').pop()}:${data.identifier}`,
        identifier: `${data.isDefinedBy}/${data.identifier}`,
        attributes: ['Attribuutti #1', 'Attribuutti #2'],
      },
    ],
    status: 'DRAFT',
  };
}
