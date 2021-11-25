import axios from 'axios';
import useSWR from 'swr';

export default function useFakeableUsers() {
  const { data } = useSWR<{id: string, email: string, displayName: string}[]>(
    '/terminology-api/api/v1/frontend/fakeableUsers',
    (url) => axios.get(url).then(r => r.data),
    {}
  );

  return data;
}
