import { AssociationFormType } from '@app/common/interfaces/association-form.interface';
import { AttributeFormType } from '@app/common/interfaces/attribute-form.interface';
import { Resource } from '@app/common/interfaces/resource.interface';

export function resourceToResourceFormType(
  data: Resource
): AssociationFormType | AttributeFormType {
  /*
   *  TODO:
   *  equivalentResource, domain and range are
   *  different in ResourceFormType and Resource
   */

  return {
    label: data.label,
    editorialNote: data.editorialNote,
    concept: data.subject,
    status: 'DRAFT',
    equivalentResource: [],
    subResourceOf: data.subResourceOf,
    identifier: data.identifier,
    note: data.note,
    type: data.type,
    domain: undefined,
    range: undefined,
  };
}
