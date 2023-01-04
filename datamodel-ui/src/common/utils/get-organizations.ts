import { Organizations } from '../interfaces/organizations.interface';
import { getPropertyLanguageVersion } from './get-language-version';

export default function getOrganizations(
  organizationsData?: Organizations,
  lang?: string
) {
  if (!organizationsData) {
    return [];
  }

  return organizationsData['@graph'].map((org) => {
    const id = org['@id'].replaceAll('urn:uuid:', '');
    return {
      id: id,
      label: getPropertyLanguageVersion({
        data: org.prefLabel,
        lang: lang ?? 'fi',
      }),
    };
  });
}
