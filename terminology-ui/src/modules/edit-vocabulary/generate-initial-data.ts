import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';
import { VocabularyInfoDTO } from '@app/common/interfaces/vocabulary.interface';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';

export default function generateInitialData(
  lang: string,
  data?: VocabularyInfoDTO
): NewTerminologyInfo | undefined {
  if (!data) {
    return undefined;
  }

  const languages =
    data.properties.language?.map((l) => {
      const description =
        data.properties.description?.find((d) => d.lang === l.value)?.value ??
        '';
      const title =
        data.properties.prefLabel?.find((p) => p.lang === l.value)?.value ?? '';

      const labelText = l.value;

      return {
        title,
        description,
        uniqueItemId: l.value,
        selected: true,
        labelText,
      } as LanguageBlockType;
    }) ?? [];

  const infoDomains =
    data.references.inGroup?.map((group) => {
      const label = getPropertyValue({
        property: group.properties.prefLabel,
        language: lang,
      });

      return {
        checked: false,
        groupId: group.type.graph.id,
        labelText: label,
        name: label,
        uniqueItemId: group.id,
      };
    }) ?? [];

  const contributors =
    data.references.contributor?.map((org) => {
      const label = getPropertyValue({
        property: org.properties.prefLabel,
        language: lang,
      });

      return {
        organizationId: org.type.graph.id,
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
    contact: data.properties.contact?.[0].value ?? '',
    languages: languages,
    infoDomains: infoDomains,
    prefix: [prefix ?? '', true],
    status: data.properties.status?.[0].value ?? 'DRAFT',
    type:
      data.properties.terminologyType?.[0].value ?? 'TERMINOLOGICAL_VOCABULARY',
    contributors: contributors,
  };

  return obj;
}
