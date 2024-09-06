import {
  TerminologyInfo,
  TerminologyType,
} from '@app/common/interfaces/interfaces-v2';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';
import { TerminologyForm } from '../new-terminology/info-manual';

export default function generateInitialData(
  lang: string,
  data?: TerminologyInfo
): TerminologyForm | undefined {
  if (!data) {
    return undefined;
  }

  const languages =
    data.languages?.map((l) => {
      const description = data.description[l];
      const title = data.label[l];

      const labelText = l;

      return {
        title,
        description,
        uniqueItemId: l,
        selected: true,
        labelText,
      } as LanguageBlockType;
    }) ?? [];

  const groups =
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
        uniqueItemId: group.identifier,
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

  const obj: TerminologyForm = {
    contact: data.contact ?? '',
    languages: languages,
    groups: groups,
    prefix: [data.prefix ?? '', true],
    status: data.status ?? 'DRAFT',
    type: data.graphType ?? TerminologyType.TERMINOLOGICAL_VOCABULARY,
    organizations: contributors,
  };

  return obj;
}
