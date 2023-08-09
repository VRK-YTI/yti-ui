import { ResourceFormType } from '@app/common/interfaces/resource-form.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Status } from '@app/common/interfaces/status.interface';

export interface LibraryResourcePutType {
  label: {
    [key: string]: string;
  };
  identifier?: string;
  subject?: string;
  note?: {
    [key: string]: string;
  };
  editorialNote?: string;
  status: Status;
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
  subject?: string;
  note?: {
    [key: string]: string;
  };
  editorialNote?: string;
  status: Status;
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

export function convertToPayload(
  data: ResourceFormType,
  isEdit: boolean,
  applicationProfile?: boolean
): LibraryResourcePutType | ApplicationProfileResourcePutType | {} {
  const removeKeys: string[] = isEdit
    ? ['identifier', 'type', 'concept']
    : applicationProfile
    ? ['concept']
    : ['concept', 'type'];

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
        if (e[0] === 'range' || e[0] === 'domain' || e[0] === 'dataType') {
          return [e[0], e[1].id];
        }

        if (e[0] === 'subResourceOf' || e[0] === 'equivalentResource') {
          return [
            e[0],
            e[1]
              .map((r: { label: string; uri: string }) => r.uri)
              .filter(
                (r: string) =>
                  [
                    'owl:topDataProperty',
                    'owl:TopObjectProperty',
                    'owl:topObjectProperty',
                  ].includes(r) === false
              ),
          ];
        }

        if (e[0] === 'path' && typeof e[1] !== 'string') {
          return [e[0], e[1].uri];
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

        return e;
      })
  );

  if (!data.concept) {
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
