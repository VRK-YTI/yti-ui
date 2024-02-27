import { Organization } from '../interfaces/organizations.interface';
import { getLanguageVersion } from './get-language-version';

export default function getOrganizations(
  organizationsData?: Organization[],
  lang?: string
) {
  if (!organizationsData) {
    return [];
  }

  return organizationsData.map((org) => {
    const id = org.id.replaceAll('urn:uuid:', '');
    return {
      id: id,
      label: getLanguageVersion({
        data: org.label,
        lang: lang ?? 'fi',
        appendLocale: true,
      }),
    };
  });
}
