import { TerminologyForm } from './info-manual';
import { Terminology } from '@app/common/interfaces/interfaces-v2';

export default function generateTerminologyPayload({
  data,
  update,
}: {
  data: TerminologyForm;
  update?: boolean;
}) {
  const initial = {
    label: {},
    description: {},
    languages: [] as string[],
  } as Terminology;

  const postData = data.languages.reduce((terminology, lang) => {
    const langCode = lang.uniqueItemId;
    terminology.languages.push(langCode);
    terminology.label[langCode] = lang.title;
    if (lang.description) {
      terminology.description[langCode] = lang.description;
    }
    return terminology;
  }, initial);

  Object.assign(postData, {
    contact: data.contact,
    ...(!update && {
      prefix: data.prefix[0],
    }),
    status: data.status ?? 'DRAFT',
    groups: data.groups.map((g) => g.uniqueItemId),
    organizations: data.organizations.map((o) => o.uniqueItemId),
    graphType: data.type,
  });

  return postData;
}
