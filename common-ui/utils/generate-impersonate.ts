import { FakeableUser } from '../interfaces/fakeable-user.interface';

export default function generateFakeableUsers(
  language: string,
  fakeableUsers?: FakeableUser[] | null
): FakeableUser[] {
  if (!fakeableUsers || fakeableUsers === null || fakeableUsers.length < 1) {
    return [];
  }

  return fakeableUsers.map((user) => {
    if (typeof user.displayName !== 'undefined') {
      return {
        ...user,
        impersonate: generateImpersonate(user.email, language),
      };
    }

    return {
      ...user,
      displayName: `${user.firstName} ${user.lastName}`,
      impersonate: generateImpersonate(user.email, language),
    };
  });
}

function generateImpersonate(email: string, language: string): () => string {
  return () =>
    (window.location.href = `/api/auth/fake-login?fake.login.mail=${encodeURIComponent(
      email
    )}&target=/${language ?? 'fi'}`);
}
