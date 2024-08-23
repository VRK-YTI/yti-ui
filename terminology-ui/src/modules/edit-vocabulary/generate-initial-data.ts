import {
  Terminology,
  TerminologyType,
} from '@app/common/interfaces/interfaces-v2';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

export default function generateInitialData(
  lang: string,
  data?: Terminology
): NewTerminologyInfo | undefined {
  if (!data) {
    return undefined;
  }

  const languages =
    data.languages?.map((l) => {
      const description = '';
      const title = '';

      const labelText = l;

      return {
        title,
        description,
        uniqueItemId: l,
        selected: true,
        labelText,
      } as LanguageBlockType;
    }) ?? [];

  const infoDomains =
    data.groups?.map((group) => {
      const label = getLanguageVersion({
        data: group.label,
        lang,
      });

      return {
        checked: false,
        groupId: group.identifier,
        labelText: label,
        name: label,
        uniqueItemId: group.id,
      };
    }) ?? [];

  const contributors =
    data.organizations?.map((org) => {
      const label = getLanguageVersion({
        data: org.label,
        lang,
      });

      return {
        organizationId: org.id,
        labelText: label,
        name: label,
        uniqueItemId: org.id,
      };
    }) ?? [];

  const uriParts = data.uri.split('/');
  const prefix = uriParts
    .map((part, idx) => {
      if (uriParts[idx - 1] === 'terminology') {
        return part;
      }
    })
    .filter((p) => p)[0];

  const obj: NewTerminologyInfo = {
    contact: data.contact ?? '',
    languages: languages,
    infoDomains: infoDomains,
    prefix: [prefix ?? '', true],
    status: data.status ?? 'DRAFT',
    type: data.type ?? TerminologyType.TERMINOLOGICAL_VOCABULARY,
    contributors: contributors,
  };

  return obj;
}
