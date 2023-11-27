import { MultiSelectData } from 'suomifi-ui-components';
import {
  Group,
  LangObject,
  ModelType,
  ReferenceData,
} from '../interfaces/model.interface';
import { Status } from '../interfaces/status.interface';
import { Type } from '../interfaces/type.interface';
import { getLanguageVersion } from './get-language-version';

function getReferenceDataInfo(data?: ModelType): ReferenceData[] {
  if (!data) {
    return [];
  }

  return [];
}

function getLangObject(data: { [key: string]: string }) {
  return Object.keys(data).map((lang: string) => {
    return {
      lang,
      value: data[lang],
    };
  });
}

export const SUOMI_FI_NAMESPACE = 'https://iri.suomi.fi/model/';
export const ADMIN_EMAIL = 'yhteentoimivuus@dvv.fi';

export function getTitle(data?: ModelType, lang?: string): string {
  if (!data) {
    return '';
  }

  return getLanguageVersion({
    data: data.label,
    lang: lang ?? 'fi',
    appendLocale: true,
  });
}

export function getTitles(data?: ModelType): LangObject[] {
  if (!data) {
    return [];
  }

  return getLangObject(data.label);
}

export function getType(data?: ModelType): Type {
  if (!data) {
    return 'PROFILE';
  }

  return data.type;
}

export function getStatus(data?: ModelType): Status {
  if (!data) {
    return 'DRAFT';
  }

  return data.status ?? 'DRAFT';
}

export function getBaseModelPrefix(data?: ModelType) {
  return data?.prefix;
}

export function getCreated(data?: ModelType): string {
  return data?.created ?? '';
}

export function getModified(data?: ModelType): string {
  return data?.modified ?? '';
}

export function getComment(data?: ModelType, lang?: string): string {
  if (!data) {
    return '';
  }

  return getLanguageVersion({
    data: data.description,
    lang: lang ?? 'fi',
    appendLocale: true,
  });
}

export function getComments(data?: ModelType): LangObject[] {
  if (!data || !data.description) {
    return [];
  }

  return getLangObject(data.description);
}

export function getContact(data?: ModelType): string {
  return data?.contact ?? ADMIN_EMAIL;
}

export function getDocumentation(data?: ModelType): string {
  return '';
}

export function getGroup(data?: ModelType, lang?: string): Group[] {
  return data?.groups ?? [];
}

export function getOrganizations(data: ModelType, lang?: string): string[] {
  if (!data || !data.organizations) {
    return [];
  }

  return data.organizations.map((org) => {
    return getLanguageVersion({
      data: org.label,
      lang: lang ?? 'fi',
    });
  });
}

export function getOrganizationsWithId(
  data?: ModelType,
  lang?: string
): MultiSelectData[] {
  if (!data || !data.organizations) {
    return [];
  }

  return data.organizations.map((org) => ({
    labelText: getLanguageVersion({
      data: org.label,
      lang: lang ?? 'fi',
    }),
    uniqueItemId: org.id,
  }));
}

export function getLink(
  data?: ModelType,
  lang?: string
): {
  description: string;
  title: string;
  url: string;
}[] {
  return [];
}

export function getIsPartOf(data?: ModelType, lang?: string): string[] {
  if (!data || !data.groups) {
    return [];
  }

  return data.groups
    .map((group) =>
      getLanguageVersion({
        data: group.label,
        lang: lang ?? 'fi',
      })
    )
    .sort((a, b) => (a > b ? 1 : -1));
}

export function getIsPartOfWithId(
  data?: ModelType,
  lang?: string
): MultiSelectData[] {
  if (!data || !data.groups) {
    return [];
  }

  return data.groups.map((group) => ({
    labelText: getLanguageVersion({ data: group.label, lang: lang ?? 'fi' }),
    uniqueItemId: group.identifier,
  }));
}

export function getLanguages(data?: ModelType): string[] {
  return data?.languages ?? [];
}

export function getPrefixFromURI(namespace: string): string {
  return namespace.split('/').filter(Boolean).pop()?.replace('#', '') ?? '';
}

export function getTerminology(
  data?: ModelType,
  lang?: string
): {
  label: string;
  url: string;
}[] {
  if (!data) {
    return [];
  }

  return data.terminologies?.map((terminology) => ({
    label: terminology.label[lang ?? 'fi'],
    url: terminology.uri,
  }));
}

export function getReferenceData(
  data?: ModelType,
  lang?: string
): {
  description: string;
  title: string;
  url: string;
}[] {
  const referenceData = getReferenceDataInfo(data);

  return referenceData?.map((ref) => {
    return {
      description: '',
      title: '',
      url: '',
    };
  });
}
