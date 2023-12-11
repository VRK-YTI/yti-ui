import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import { NextRouter, useRouter } from 'next/router';

// UrlState is used for storing and mutating the query, search parameters and pagination
// This is modeled after the common-ui implementation, and should at some point be checked for
// faulty and unnecessary code

export interface UrlState {
  q: string;
  domain: string;
  organization: string[];
  state: string[];
  type: string[];
  format: string[];
  isReferenced: string[];
  sourceSchema: string[];
  targetSchema: string[];
  page: number;
  lang: string;
}

export const initialUrlState: UrlState = {
  q: '',
  domain: 'personal',
  organization: [],
  state: [],
  type: [],
  format: [],
  isReferenced: [],
  sourceSchema: [],
  targetSchema: [],
  page: 1,
  lang: '',
};

export function isInitial(state: UrlState, name: keyof UrlState) {
  return isEqual(
    sortBy(asArray(state[name])),
    sortBy(asArray(initialUrlState[name]))
  );
}

interface UseURLStateResult {
  urlState: UrlState;
  updateUrlState: (state: UrlState) => void;
  patchUrlState: (patch: Partial<UrlState>) => void;
  resetUrlState: () => void;
}

export default function useUrlState(): UseURLStateResult {
  const router = useRouter();

  const urlState: Required<UrlState> = {
    q: asString(router.query.q, initialUrlState.q),
    domain: asString(router.query.domain, initialUrlState.domain),
    organization: asStringArray(
      router.query.organization,
      initialUrlState.organization
    ),
    state: asStringArray(router.query.state, initialUrlState.state),
    type: asStringArray(router.query.type, initialUrlState.type),
    format: asStringArray(router.query.format, initialUrlState.format),
    isReferenced: asStringArray(
      router.query.isReferenced,
      initialUrlState.isReferenced
    ),
    sourceSchema: asStringArray(
      router.query.sourceSchema,
      initialUrlState.sourceSchema
    ),
    targetSchema: asStringArray(
      router.query.targetSchema,
      initialUrlState.targetSchema
    ),
    page: asNumber(router.query.page, initialUrlState.page),
    lang: asString(router.query.lang, initialUrlState.lang),
  };

  return {
    urlState,
    updateUrlState: (state) => updateURLState(router, state),
    patchUrlState: (patch) => updateURLState(router, { ...urlState, ...patch }),
    resetUrlState: () => updateURLState(router),
  };
}

function updateURLState(router: NextRouter, urlState?: UrlState): void {
  const {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    q,
    domain,
    organization,
    state,
    type,
    format,
    isReferenced,
    sourceSchema,
    targetSchema,
    page,
    lang,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...otherQueryParameters
  } = router.query;

  router.push(
    {
      pathname: router.pathname,
      query: {
        ...otherQueryParameters,
        ...buildUrlStatePatch({
          ...{
            ...initialUrlState,
          },
          ...urlState,
        }),
      },
    },
    undefined,
    { shallow: true }
  );
}

function buildUrlStatePatch(urlState: UrlState): Partial<UrlState> {
  const patch: Partial<UrlState> = {};

  if (!isInitial(urlState, 'q')) patch.q = urlState.q;
  if (!isInitial(urlState, 'domain')) patch.domain = urlState.domain;
  if (!isInitial(urlState, 'organization'))
    patch.organization = urlState.organization;
  if (!isInitial(urlState, 'state')) patch.state = urlState.state;
  if (!isInitial(urlState, 'type')) patch.type = urlState.type;
  if (!isInitial(urlState, 'format')) patch.format = urlState.format;
  if (!isInitial(urlState, 'isReferenced'))
    patch.isReferenced = urlState.isReferenced;
  if (!isInitial(urlState, 'sourceSchema'))
    patch.sourceSchema = urlState.sourceSchema;
  if (!isInitial(urlState, 'targetSchema'))
    patch.targetSchema = urlState.targetSchema;
  if (!isInitial(urlState, 'page')) patch.page = urlState.page;
  if (!isInitial(urlState, 'lang')) patch.lang = urlState.lang;
  return patch;
}

type QueryParamValue = string | string[] | undefined;

export function asString(
  value: QueryParamValue,
  defaultValue = '',
  delimiter = ''
): string {
  if (Array.isArray(value)) {
    value = value.join(delimiter);
  }

  return value ?? defaultValue;
}

export function asStringArray(
  value: QueryParamValue,
  defaultValue: string[] = []
): string[] {
  if (!Array.isArray(value)) {
    value = [value ?? ''];
  }

  value = value.filter(Boolean);
  return value.length > 0 ? value : defaultValue;
}

export function asNumber(value: QueryParamValue, defaultValue = 0): number {
  if (Array.isArray(value)) {
    value = value.filter(Boolean)[0];
  }

  if (!value) {
    return defaultValue;
  }

  const parsed = parseInt(value);

  return !isNaN(parsed) ? parsed : defaultValue;
}

export function asArray(
  value: string | number | string[] | number[]
): (string | number)[] {
  return Array.isArray(value) ? value : [value];
}
