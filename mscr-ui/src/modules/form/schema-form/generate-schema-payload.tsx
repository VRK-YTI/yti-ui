/* eslint-disable */
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import { Schema, SchemaFormType } from '@app/common/interfaces/schema.interface';
import { Organization } from '@app/common/interfaces/organizations.interface';

// here we can create the schema payload

export default function generateSchemaPayload(
  data: SchemaFormType,
  groupContent: boolean,
  pid?: string,
  user?: MscrUser,
  isRevision?: boolean
): Partial<Schema> {
  const organizations: Organization[] = [];
  if (user && groupContent && pid) {
    const ownerOrg = user?.organizations.find((x) => x.id == pid);
    if (ownerOrg) organizations.push(ownerOrg);
  }

  const payload = {
    namespace: 'http://test.com',
    description: data.languages
      .filter((l: { description: string }) => l.description !== '')
      .reduce(
        (obj: any, l: { uniqueItemId: any; description: any }) => ({
          ...obj,
          [l.uniqueItemId]: l.description,
        }),
        {}
      ),
    label: data.languages
      .filter((l: { title: string }) => l.title !== '')
      .reduce(
        (obj: any, l: { uniqueItemId: any; title: any }) => ({
          ...obj,
          [l.uniqueItemId]: l.title,
        }),
        {}
      ),
    languages: data.languages
      .filter((l: { title: string }) => l.title !== '')
      .map((l: { uniqueItemId: any }) => l.uniqueItemId),
    organizations: organizations.map((o: { id: any }) => o.id),
    status: 'DRAFT',
    format: data.format,
    state: data.state,
    versionLabel: data.versionLabel ?? '1',
  };

  if (isRevision) {
    const { namespace, organizations, ...revisionPayload} = payload;
    return revisionPayload;
  }

  return payload;
}
