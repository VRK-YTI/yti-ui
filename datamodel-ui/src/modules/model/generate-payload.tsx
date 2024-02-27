import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import {
  ModelType,
  ModelUpdatePayload,
  VersionedModelUpdatePayload,
} from '@app/common/interfaces/model.interface';
import { ADMIN_EMAIL } from '@app/common/utils/get-value';

export function generatePayloadVersionedUpdate(
  data: ModelFormType | ModelType
): VersionedModelUpdatePayload {
  if ('description' in data) {
    return {
      label: data.label,
      description: data.description,
      organizations: data.organizations.map((o) => o.id) ?? [],
      groups: data.groups.map((g) => g.identifier) ?? [],
      documentation: data.documentation ?? {},
      contact: data.contact !== '' ? data.contact : '',
      links: data.links,
      status: data.status,
    };
  } else {
    return {
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
      organizations: data.organizations.map((o) => o.uniqueItemId),
      groups: data.serviceCategories.map((s) => s.uniqueItemId),
      documentation: data.documentation ?? {},
      contact: data.contact !== '' ? data.contact : '',
      links: data.links,
      status: data.status,
    };
  }
}

export default function generatePayloadUpdate(
  data: ModelFormType | ModelType
): ModelUpdatePayload {
  if ('description' in data) {
    return {
      label: data.label,
      description: data.description,
      languages: data.languages,
      organizations: data.organizations.map((o) => o.id) ?? [],
      groups: data.groups.map((g) => g.identifier) ?? [],
      internalNamespaces: data.internalNamespaces.map((ns) => ns.namespace),
      externalNamespaces: data.externalNamespaces,
      terminologies: data.terminologies.map((t) => t.uri) ?? [],
      codeLists: data.codeLists.map((c) => c.id) ?? [],
      documentation: data.documentation ?? {},
      contact: data.contact !== '' ? data.contact : '',
      links: data.links,
    };
  } else {
    return {
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
      internalNamespaces: data.internalNamespaces.map((ns) => ns.namespace),
      externalNamespaces: data.externalNamespaces,
      terminologies: data.terminologies.map((t) => t.uri),
      codeLists: data.codeLists.map((c) => c.id),
      documentation: data.documentation ?? {},
      contact: data.contact !== '' ? data.contact : ADMIN_EMAIL,
      links: data.links
        ? data.links.map((l) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, uri, ...data } = l;
            const validUri =
              uri.startsWith('http://') || uri.startsWith('https://')
                ? uri
                : `https://${uri}`;
            return {
              ...data,
              uri: validUri,
            };
          })
        : [],
    };
  }
}
