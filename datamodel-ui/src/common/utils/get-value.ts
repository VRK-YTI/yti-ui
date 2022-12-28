import {
  BaseInfo,
  Group,
  Link,
  Model,
  Organization,
} from '../interfaces/model.interface';
import { Status } from '../interfaces/status.interface';
import { getPropertyLanguageVersion } from './get-language-version';

function getBaseInfo(data?: Model): BaseInfo | undefined {
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

export function getContact(data?: Model): string {
  const target = getBaseInfo(data);

  if (!target) {
    return '';
  }

  return target.contact ? target.contact['@value'] : '';
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
