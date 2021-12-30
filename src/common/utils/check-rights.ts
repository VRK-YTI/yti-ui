import User from '../interfaces/user-interface';
import { VocabularyInfoDTO } from '../interfaces/vocabulary.interface';

export default function checkRights(loginInfo: User, data: VocabularyInfoDTO) {
  let hasRights = false;

  data?.references.contributor?.forEach(c => {
    Object.keys(loginInfo.rolesInOrganizations).forEach(k => {
      if (c.id === k && loginInfo.rolesInOrganizations[k].includes('ADMIN')) {
        hasRights = true;
      }
    });
  });

  return hasRights;
}
