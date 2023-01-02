// OBSOLETE
import useSWR from 'swr';
import { User } from 'yti-common-ui/interfaces/user.interface';

export default function useUser({
  redirectTo = '',
  redirectIfFound = false,
  initialData = undefined,
}: {
  redirectTo?: string;
  redirectIfFound?: boolean;
  initialData?: User;
} = {}) {
  const { data: user, mutate: mutateUser } = useSWR<User>(
    '/api/auth/user',
    (url) => fetch(url).then((r) => r.json()),
    initialData === null ? {} : { fallbackData: initialData }
  );
  return { user, mutateUser };
}
