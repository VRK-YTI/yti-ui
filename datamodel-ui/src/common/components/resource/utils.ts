import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { UriData } from '@app/common/interfaces/uri.interface';

export interface LibraryResourcePutType {
  label: {
    [key: string]: string;
  };
  identifier?: string;
  uri?: string;
  subject?: string;
  note?: {
    [key: string]: string;
  };
  editorialNote?: string;
  subResourceOf?: string[];
  equivalentResource?: string[];
  domain?: string;
  range?: string;
}

export interface ApplicationProfileResourcePutType {
  label: {
    [key: string]: string;
  };
  identifier?: string;
  uri?: string;
  subject?: string;
  note?: {
    [key: string]: string;
  };
  editorialNote?: string;
  path?: string;
  classType?: string;
  type?: ResourceType.ASSOCIATION | ResourceType.ATTRIBUTE;
  dataType?: string;
  allowedValues?: string[];
  defaultValue?: string;
  hasValue?: string;
  maxLength?: number;
  minLength?: number;
  maxCount?: number;
  minCount?: number;
  codeList?: string;
}

export const DEFAULT_ATTRIBUTE_SUBPROPERTY: UriData = {
  uri: 'http://www.w3.org/2002/07/owl#topDataProperty',
  curie: 'owl:topDataProperty',
  label: { en: 'topDataProperty' },
};

export const DEFAULT_ASSOCIATION_SUBPROPERTY: UriData = {
  uri: 'http://www.w3.org/2002/07/owl#topObjectProperty',
  curie: 'owl:topObjectProperty',
  label: { en: 'topObjectProperty' },
};

export function convertToPayload(
  data: ResourceFormType,
  isEdit: boolean,
  applicationProfile?: boolean
): LibraryResourcePutType | ApplicationProfileResourcePutType | {} {
  const removeKeys: string[] = isEdit
    ? ['identifier', 'type', 'concept', 'uri']
    : applicationProfile
    ? ['concept', 'uri']
    : ['concept', 'type', 'uri'];

  const ret = Object.fromEntries(
    Object.entries(data)
      .filter((e) => {
        if (removeKeys.includes(e[0])) {
          return false;
        }

        if (e[1] === undefined || e[1] === null || e[1] === '') {
          return false;
        }

        if (Array.isArray(e[1]) && e[1].length < 1) {
          return false;
        }

        if (typeof e[1] === 'object' && Object.keys(e[1]).length < 1) {
          return false;
        }

        return true;
      })
      .map((e) => {
        if (
          e[0] === 'range' ||
          e[0] === 'domain' ||
          e[0] === 'classType' ||
          e[0] === 'path' ||
          e[0] === 'dataType'
        ) {
          return [e[0], e[1].uri];
        }

        if (e[0] === 'subResourceOf' || e[0] === 'equivalentResource') {
          return [
            e[0],
            e[1]
              .map((r: UriData) => r.uri)
              .filter(
                (r: string) =>
                  ![
                    DEFAULT_ASSOCIATION_SUBPROPERTY.uri,
                    DEFAULT_ATTRIBUTE_SUBPROPERTY.uri,
                  ].includes(r)
              ),
          ];
        }

        if (e[0] === 'codeLists' && e[1].length > 0) {
          return [
            e[0],
            e[1].map(
              (codeList: { label: { [key: string]: string }; id: string }) =>
                codeList.id
            ),
          ];
        }

        if (e[0] === 'allowedValues' && e[1].length > 0) {
          return [
            e[0],
            e[1].map((value: { label: string; id: string }) => value.label),
          ];
        }

        return e;
      })
  );

  // Remove unnecessary info from payload
  // these come from GET request of the resource when editing
  delete ret.contributor;
  delete ret.creator;
  delete ret.created;
  delete ret.modifier;
  delete ret.modified;
  delete ret.contact;
  delete ret.status;

  if (!data.concept) {
    delete ret.subject;
    return ret;
  }

  return {
    ...ret,
    subject: data.concept.conceptURI,
  };
}

export function pathForResourceType(type: ResourceType) {
  return type === ResourceType.ATTRIBUTE ? '/attribute' : '/association';
}
