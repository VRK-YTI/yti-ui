import { Organization } from '../interfaces/organizations.interface';

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
      label: org.label[lang ?? 'fi'],
      //label:"Test Org"
    };
  });
}
