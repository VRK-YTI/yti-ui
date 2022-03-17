import { User } from '../interfaces/user.interface';
import { VocabularyInfoDTO } from '../interfaces/vocabulary.interface';
import { Organization } from '../interfaces/organization.interface';
import hasRights from './check-rights';

const createMockUser = (rolesInOrganizations: {
  [key: string]: string[];
}): User => ({
  anonymous: false,
  email: 'admin@admin.fi',
  firstName: 'Admin',
  lastName: 'Admin',
  id: '',
  superuser: true,
  newlyCreated: false,
  rolesInOrganizations: rolesInOrganizations,
  organizationsInRole: {},
  enabled: true,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  username: 'Adming',
  authorities: [],
  hasToken: false,
  tokenRole: '',
  containerUri: '',
});

const createMockData = (
  contributors: { id: string; label: string }[]
): VocabularyInfoDTO =>
  ({
    references: {
      contributor: contributors.map(
        (x) =>
          ({
            id: x.id,
            properties: {
              prefLabel: [
                {
                  lang: 'fi',
                  value: x.label,
                  regex: x.label,
                },
              ],
            },
          } as Organization)
      ),
    },
  } as VocabularyInfoDTO);

describe('check-rights', () => {
  it('should have rights', () => {
    const user = createMockUser({ foo: ['SOME_OTHER_ROLES', 'ADMIN'] });
    const data = createMockData([{ id: 'foo', label: 'bar' }]);

    const rights = hasRights(user, data);
    expect(rights).toBe(true);
  });

  it('should not have rights', () => {
    const user = createMockUser({ foo: ['SOME_OTHER_ROLE'] });
    const data = createMockData([{ id: 'foo', label: 'bar' }]);

    const rights = hasRights(user, data);
    expect(rights).toBe(false);
  });

  it('should work with no data', () => {
    const user = createMockUser({ foo: ['ADMIN'] });

    const rights = hasRights(user);
    expect(rights).toBe(false);
  });
});
