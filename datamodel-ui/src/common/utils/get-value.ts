import {
  BaseInfo,
  Group,
  LangObject,
  Link,
  Model,
  Organization,
} from '../interfaces/model.interface';
import { Status } from '../interfaces/status.interface';
import { getPropertyLanguageVersion } from './get-language-version';

export function getBaseInfo(data?: Model): BaseInfo | undefined {
  if (!data) {
    return;
  }

  const target = data['@graph'].find(
    (g) => '@type' in g && Array.isArray(g['@type'])
  );

  if (target) {
    return target as BaseInfo;
  }

  return;
}

function getGroupInfo(data?: Model): Group[] | undefined {
  if (!data) {
    return;
  }

  const target = data['@graph'].filter(
    (g) => '@type' in g && !Array.isArray(g['@type']) && 'label' in g
  );

  if (target.length > 0) {
    return target as Group[];
  }

  return;
}

function getOrganizationInfo(data?: Model): Organization[] | undefined {
  if (!data) {
    return;
  }

  const target = data['@graph'].filter(
    (g) => '@type' in g && !Array.isArray(g['@type']) && 'prefLabel' in g
  );

  if (target.length > 0) {
    return target as Organization[];
  }

  return;
}

function getLinkInfo(data?: Model): Link[] | undefined {
  if (!data) {
    return;
  }

  const target = data['@graph'].filter(
    (g) => !('type' in g) && 'homepage' in g
  );

  if (target.length > 0) {
    return target as Link[];
  }

  return;
}

export function getTitle(data?: Model, lang?: string): string {
  if (!data) {
    return '';
  }

  const target = getBaseInfo(data);

  if (!target) {
    return '';
  }

  const labels =
    'label' in target && Array.isArray(target['@type'])
      ? target.label
      : undefined;

  if (!labels || (Array.isArray(labels) && labels.length < 1)) {
    return '';
  }

  return getPropertyLanguageVersion({
    data: labels,
    lang: lang ?? 'fi',
    appendLocale: true,
  });
}

export function getTitles(data?: Model): LangObject[] {
  const target = getBaseInfo(data);

  if (!target) {
    return [];
  }

  const labels =
    'label' in target && Array.isArray(target['@type'])
      ? target.label
      : undefined;

  if (!labels) {
    return [];
  }

  return Array.isArray(labels) ? labels : [labels];
}

export function getType(data?: Model): string {
  const target = getBaseInfo(data);

  if (!target) {
    return '';
  }

  if (target['@type'].includes('dcap:DCAP')) {
    return 'profile';
  } else {
    return 'library-variant';
  }
}

export function getStatus(data?: Model): Status {
  const target = getBaseInfo(data);

  if (!target) {
    return 'DRAFT';
  }

  return target.versionInfo ?? 'DRAFT';
}

export function getCreated(data?: Model): string {
  const target = getBaseInfo(data);

  if (!target) {
    return '';
  }

  return target.created;
}

export function getModified(data?: Model): string {
  const target = getBaseInfo(data);

  if (!target) {
    return '';
  }

  return target.modified;
}

export function getComment(data?: Model, lang?: string): string {
  const target = getBaseInfo(data);

  if (!target) {
    return '';
  }

  return getPropertyLanguageVersion({
    data: target.comment,
    lang: lang ?? 'fi',
    appendLocale: true,
  });
}

export function getComments(data?: Model): LangObject[] {
  const target = getBaseInfo(data);

  if (!target || !target.comment) {
    return [];
  }

  return target.comment;
}

export function getContact(data?: Model, lang?: string): string {
  const target = getBaseInfo(data);

  if (!target || !target.contact) {
    return '';
  }

  return getPropertyLanguageVersion({
    data: target.contact,
    lang: lang ?? 'fi',
  });
}

export function getDocumentation(data?: Model): string {
  const target = getBaseInfo(data);

  if (!target) {
    return '';
  }

  return target.documentation ? target.documentation['@value'] : '';
}

export function getGroup(data?: Model, lang?: string): string[] {
  const target = getGroupInfo(data);

  if (!target) {
    return [];
  }

  return target.map((t) =>
    getPropertyLanguageVersion({
      data: t.label,
      lang: lang ?? 'fi',
      appendLocale: true,
    })
  );
}

export function getOrganization(data?: Model, lang?: string): string[] {
  const target = getOrganizationInfo(data);

  if (!target) {
    return [];
  }

  return target.map((t) =>
    getPropertyLanguageVersion({
      data: t.prefLabel,
      lang: lang ?? 'fi',
      appendLocale: true,
    })
  );
}

export function getLink(
  data?: Model,
  lang?: string
): {
  description: string;
  title: string;
  url: string;
}[] {
  const target = getLinkInfo(data);

  if (!target) {
    return [];
  }

  return target.map((t) => ({
    description: getPropertyLanguageVersion({
      data: t.description,
      lang: lang ?? 'fi',
      appendLocale: true,
    }),
    title: getPropertyLanguageVersion({
      data: t.title,
      lang: lang ?? 'fi',
      appendLocale: true,
    }),
    url: t.homepage,
  }));
}

export function getIsPartOf(data?: Model, lang?: string): string[] {
  const target = getBaseInfo(data);
  const groups = getGroupInfo(data);

  if (!target || typeof groups === 'undefined') {
    return [];
  }

  if (typeof target.isPartOf === 'string') {
    return [target.isPartOf];
  }

  return target.isPartOf.map((partOf) =>
    getPropertyLanguageVersion({
      data: groups.find((graph) => graph['@id'] === partOf)?.label,
      lang: lang ?? 'fi',
    })
  );
}

export function getBaseModelPrefix(data?: Model): string {
  const target = getBaseInfo(data);

  if (!target || !target.preferredXMLNamespacePrefix) {
    return '';
  }

  return target.preferredXMLNamespacePrefix;
}

export function getLanguages(data?: Model): string[] {
  const target = getBaseInfo(data);

  if (typeof target === 'undefined' || !target['dcterms:language']) {
    return [];
  }

  return target['dcterms:language']['@list'];
}

export function getUri(data?: Model): string {
  const target = getBaseInfo(data);

  if (!target) {
    return '';
  }

  return target['@id'];
}
