import { FormType } from '@app/common/utils/hooks/use-initial-form';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import { ModalType } from '@app/modules/form/index';
import { Organization } from '@app/common/interfaces/organizations.interface';
import { Type, Visibility } from '@app/common/interfaces/search.interface';
import { State } from '@app/common/interfaces/state.interface';
import { Format } from '@app/common/interfaces/format.interface';
import { Metadata } from '@app/common/interfaces/metadata.interface';

export default function generatePayload(
  data: FormType,
  contentType: Type,
  user: MscrUser,
  modalType: ModalType,
  organizationPid?: string
): Partial<Metadata> {
  const organizations: Organization[] = [];
  if (user && organizationPid && organizationPid !== '') {
    const ownerOrg = user?.organizations.find((x) => x.id == organizationPid);
    if (ownerOrg) organizations.push(ownerOrg);
  }
  const payload = {
    description: data.languages
      .filter((l: { description: string }) => l.description !== '')
      .reduce(
        (
          obj: { [lang: string]: string },
          l: { uniqueItemId: string; description: string }
        ) => ({
          ...obj,
          [l.uniqueItemId]: l.description,
        }),
        {}
      ),
    label: data.languages
      .filter((l: { title: string }) => l.title !== '')
      .reduce(
        (
          obj: { [lang: string]: string },
          l: { uniqueItemId: string; title: string }
        ) => ({
          ...obj,
          [l.uniqueItemId]: l.title,
        }),
        {}
      ),
    languages: data.languages
      .filter((l: { title: string }) => l.title !== '')
      .map((l: { uniqueItemId: string }) => l.uniqueItemId),
    organizations: organizations.map((o: { id: string }) => o.id),
    status: 'DRAFT',
    format: data.format,
    state: data.state,
    versionLabel: data.versionLabel,
    visibility:
      data.state !== State.Draft ? Visibility.Public : Visibility.Private,
    namespace: 'http://test.com', // Schema
    sourceSchema: data.sourceSchema, // Crosswalk
    targetSchema: data.targetSchema, // Crosswalk
  };

  const { sourceSchema, targetSchema, ...schemaPayload } = payload;
  const { namespace, ...crosswalkPayload } = payload;

  if (modalType == ModalType.RevisionFull) {
    if (contentType == Type.Schema) {
      const { namespace, organizations, ...revisionPayload } = schemaPayload;
      return revisionPayload;
    } else if (contentType == Type.Crosswalk) {
      const { organizations, ...revisionPayload } = crosswalkPayload;
      return revisionPayload;
    }
  } else if (modalType == ModalType.RevisionMscr) {
    if (contentType == Type.Schema) {
      const { namespace, organizations, format, ...revisionPayload } =
        schemaPayload;
      return revisionPayload;
    } else if (contentType == Type.Crosswalk) {
      const { organizations, format, ...revisionPayload } = crosswalkPayload;
      return revisionPayload;
    }
  } else if (
    modalType == ModalType.RegisterNewFull ||
    modalType == ModalType.RegisterNewMscr
  ) {
    if (contentType == Type.Schema) {
      return schemaPayload;
    } else if (contentType == Type.Crosswalk) {
      return crosswalkPayload;
    }
  }

  const { format, state, visibility, ...mscrCopyPayload } = schemaPayload;
  return {
    ...mscrCopyPayload,
    format: Format.Mscr,
    state: State.Draft,
    visibility: Visibility.Private,
  };
}
