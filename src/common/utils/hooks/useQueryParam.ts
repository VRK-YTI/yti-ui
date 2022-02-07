import { NextRouter, useRouter } from 'next/router';

export const RESET_PAGINATION = true;

type callbackFn = (value?: string, resetPagination?: boolean) => Promise<boolean>;

export default function useQueryParam(
  name: string,
  defaultValue: string,
  delimiter?: string
): [string, callbackFn];

export default function useQueryParam(
  name: string,
  defaultValue: undefined,
  delimiter?: string
): [string | undefined, callbackFn];

export default function useQueryParam(
  name: string,
  defaultValue?: string,
  delimiter?: string,
): [string | undefined, callbackFn] {
  const router = useRouter();
  const result = mapQueryParam(router?.query[name] ?? defaultValue, delimiter);

  return [
    result,
    (value?: string, resetPagination: boolean= false) => updateQueryParam({
      name,
      value,
      delimiter,
      resetPagination,
      router
    })
  ];
}

export function updateQueryParam({
  name,
  value,
  delimiter,
  resetPagination = false,
  router
}: {
  name: string;
  value?: string;
  delimiter?: string;
  resetPagination?: boolean;
  router: NextRouter;
}) {
  const queryParams = { ...router.query };

  if (value) {
    queryParams[name] = delimiter ? value.split(delimiter) : value;
  } else {
    delete queryParams[name];
  }

  if (resetPagination) {
    delete queryParams.page;
  }

  return router.push({
    pathname: router.pathname,
    query: queryParams,
  }, undefined, { shallow: true });
}

export function mapQueryParam(value: string | string[], delimiter?: string): string;
export function mapQueryParam(value?: string | string[], delimiter?: string): string | undefined;

export function mapQueryParam(
  value?: string | string[],
  delimiter: string = ''
): string | undefined {
  return value && Array.isArray(value) ? value.join(delimiter) : value;
}
