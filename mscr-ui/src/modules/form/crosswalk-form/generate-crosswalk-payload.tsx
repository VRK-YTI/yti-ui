import {
  Crosswalk,
  CrosswalkFormType,
} from '@app/common/interfaces/crosswalk.interface';
import { Visibility } from '@app/common/interfaces/search.interface';
import { State } from '@app/common/interfaces/state.interface';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import { Organization } from '@app/common/interfaces/organizations.interface';

// here we are creating crosswalk payload by converting the form data to crosswalk type

export default function generateCrosswalkPayload(
  data: CrosswalkFormType,
  groupContent: boolean,
  pid?: string,
  user?: MscrUser
): Partial<Crosswalk> {
  const organizations: Organization[] = [];
  if (user && groupContent && pid) {
    const ownerOrg = user?.organizations.find((x) => x.id == pid);
    if (ownerOrg) organizations.push(ownerOrg);
  }
  return {
    format: data.format,
    description: data.languages
      .filter((l) => l.description !== '')
      .reduce(
        (obj, l) => ({
          ...obj,
          [l.uniqueItemId]: l.description,
        }),
        {}
      ),
    label: data.languages
      .filter((l) => l.title !== '')
      .reduce(
        (obj, l) => ({
          ...obj,
          [l.uniqueItemId]: l.title,
        }),
        {}
      ),
    languages: data.languages
      .filter((l) => l.title !== '')
      .map((l) => l.uniqueItemId),
    status: 'VALID',
    state: data.state,
    sourceSchema: data.sourceSchema,
    targetSchema: data.targetSchema,
    versionLabel: data.versionLabel ?? '1',
    visibility:
      data.state !== State.Draft ? Visibility.Public : Visibility.Private,
    organizations: organizations.map((o: { id: any }) => o.id),
  };
}
