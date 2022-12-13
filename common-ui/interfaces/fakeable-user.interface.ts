export interface FakeableUser {
  email: string;
  displayName: string;
  id: string;
  impersonate: () => void;
}
