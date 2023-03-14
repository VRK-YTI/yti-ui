import { MultiSelectData } from 'suomifi-ui-components';
import {
  DataVocabulary,
  LangObject,
  ModelType,
  ReferenceData,
  Terminology,
} from '../interfaces/model.interface';
import { Organization } from '../interfaces/organizations.interface';
import { ServiceCategory } from '../interfaces/service-categories.interface';
import { Status } from '../interfaces/status.interface';
import { Type } from '../interfaces/type.interface';
import { getLanguageVersion } from './get-language-version';

export function getDataVocabulariesInfo(
  data?: ModelType
): DataVocabulary[] | undefined {
  if (!data) {
    return;
  }

  return [...data.externalNamespaces, ...data.internalNamespaces];
}

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
  return data?.contact ?? 'yhteentoimivuus@dvv.fi';
}

export function getDocumentation(data?: ModelType): string {
  return '';
}

export function getGroup(data?: ModelType, lang?: string): string[] {
  return data?.groups ?? [];
}

export function getOrganizations(
  data?: ModelType,
  organizations?: Organization[],
  lang?: string
): string[] {
  if (!data) {
    return [];
  }

  if (!organizations) {
    return data.organizations;
  }

  return data.organizations.map((id) =>
    getLanguageVersion({
      data: organizations.find((org) => org.id === id)?.label,
      lang: lang ?? 'fi',
    })
  );
}

export function getOrganizationsWithId(
  data?: ModelType,
  organizations?: Organization[],
  lang?: string
): MultiSelectData[] {
  if (!data) {
    return [];
  }

  if (!organizations) {
    return data.organizations.map((org) => ({
      labelText: org,
      uniqueItemId: org,
    }));
  }

  return data.organizations.map((id) => ({
    labelText: getLanguageVersion({
      data: organizations.find((org) => org.id === id)?.label,
      lang: lang ?? 'fi',
    }),
    uniqueItemId: id,
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

export function getIsPartOf(
  data?: ModelType,
  serviceGroups?: ServiceCategory[],
  lang?: string
): string[] {
  if (!data || !data.groups) {
    return [];
  }

  if (!serviceGroups) {
    return data.groups;
  }

  return data.groups
    .map((id) =>
      getLanguageVersion({
        data: serviceGroups.find((group) => group.identifier === id)?.label,
        lang: lang ?? 'fi',
      })
    )
    .sort((a, b) => (a > b ? 1 : -1));
}

export function getIsPartOfWithId(
  data?: ModelType,
  serviceGroups?: ServiceCategory[],
  lang?: string
): MultiSelectData[] {
  if (!data || !data.groups) {
    return [];
  }

  if (!serviceGroups) {
    return data.groups.map((group) => ({
      labelText: group,
      uniqueItemId: group,
    }));
  }

  return data.groups.map((id) => ({
    labelText: getLanguageVersion({
      data: serviceGroups.find((group) => group.identifier === id)?.label,
      lang: lang ?? 'fi',
    }),
    uniqueItemId: id,
  }));
}

export function getLanguages(data?: ModelType): string[] {
  return data?.languages ?? [];
}

export function getUri(data?: ModelType): string {
  return `http://uri.suomi.fi/datamodel/ns/${data?.prefix}`;
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

export function getDataVocabularies(
  data?: ModelType,
  lang?: string
): {
  title: string;
  url: string;
}[] {
  const dataVocabularies = getDataVocabulariesInfo(data);

  if (!dataVocabularies) {
    return [];
  }

  return dataVocabularies.map((t) => ({
    title: '',
    url: t.id,
  }));
}
