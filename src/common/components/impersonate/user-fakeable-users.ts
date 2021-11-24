import useSWR from 'swr';

export default function useFakeableUsers() {
  const { data } = useSWR<{id: string, email: string, displayName: string}[]>(
    '/terminology-api/api/v1/frontend/fakeableUsers',
    (url) => fetch(url).then(r => r.json()),
    {}
  );

  return data;
}
