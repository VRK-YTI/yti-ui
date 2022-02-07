import { NextRouter, useRouter } from 'next/router';

export default function useQueryParam(name: string, delimiter: string = ''): [string | undefined, (value?: string) => Promise<boolean>] {
  const router = useRouter();
  const value = router?.query[name];
  const result = value && Array.isArray(value) ? value.join(delimiter) : value;

  return [
    result,
    (value?: string) => updateQueryParam({ name, value, router })
  ];
}

export function updateQueryParam({ name, value, router }: { name: string, value?: string, router: NextRouter }) {
  const queryParams = { ...router.query };

  if (value) {
    queryParams[name] = value;
  } else {
    delete queryParams[name];
  }

  // Redirects back to front of the results
  queryParams['page'] = '1';

  return router.push({
    pathname: router.pathname,
    query: queryParams,
  }, undefined, { shallow: true });
}
