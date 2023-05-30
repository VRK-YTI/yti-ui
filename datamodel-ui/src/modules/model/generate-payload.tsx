import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { ModelUpdatePayload } from '@app/common/interfaces/model.interface';

export default function generatePayload(
  data: ModelFormType
): ModelUpdatePayload {
  return {
    status: data.status ?? 'DRAFT',
    label: data.languages
      .filter((l) => l.selected)
      .reduce(
        (obj, l) => ({
          ...obj,
          [l.uniqueItemId]: l.title,
        }),
        {}
      ),
    description: data.languages
      .filter((l) => l.selected && l.description && l.description !== '')
      .reduce(
        (obj, l) => ({
          ...obj,
          [l.uniqueItemId]: l.description,
        }),
        {}
      ),
    languages: data.languages
      .filter((l) => l.selected)
      .map((l) => l.uniqueItemId),
    organizations: data.organizations.map((o) => o.uniqueItemId),
    groups: data.serviceCategories.map((s) => s.uniqueItemId),
    internalNamespaces: data.internalNamespaces,
    externalNamespaces: data.externalNamespaces,
    terminologies: data.terminologies.map((t) => t.uri),
    codeLists: data.codeLists.map((c) => c.id),
    contact: data.contact !== '' ? data.contact : 'yhteentoimivuus@dvv.fi',
  };
}
