import { User } from '../interfaces/user.interface';
import { VocabularyInfoDTO } from '../interfaces/vocabulary.interface';

const editRoles = ['ADMIN'];

export default function hasRights(user: User, target?: VocabularyInfoDTO) {
  let hasRights = false;

  target?.references.contributor?.forEach((c) => {
    Object.keys(user.rolesInOrganizations).forEach((k) => {
      if (
        c.id === k &&
        user.rolesInOrganizations[k].some((role) => editRoles.includes(role))
      ) {
        hasRights = true;
      }
    });
  });

  return hasRights;
}
