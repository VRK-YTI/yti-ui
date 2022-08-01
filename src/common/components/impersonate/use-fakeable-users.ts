import axios from 'axios';
import useSWR from 'swr';
import { useTranslation } from 'next-i18next';

export interface UseFakeableUsersResult {
  id: string;
  email: string;
  displayName: string;
  impersonate: () => void;
}

export default function useFakeableUsers(): UseFakeableUsersResult[] {
  const { data } = useSWR<{ id: string; email: string; displayName: string }[]>(
    '/terminology-api/api/v1/frontend/fakeableUsers',
    (url) => axios.get(url).then((r) => r.data),
    {}
  );
  const { i18n } = useTranslation();

  return (
    data?.map(({ id, email, displayName }) => ({
      id,
      email,
      displayName,
      impersonate: () =>
        (window.location.href = `/api/auth/fake-login?fake.login.mail=${encodeURIComponent(
          email
        )}&target=/${i18n.language}`),
    })) ?? []
  );
}
