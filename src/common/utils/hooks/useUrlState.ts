import _ from 'lodash';
import { NextRouter, useRouter } from 'next/router';

export interface UrlState {
  q: string;
  domain: string[];
  organization: string;
  status: string[];
  type: string;
  page: number;
  lang: string;
}

export const initialUrlState: UrlState = {
  q: '',
  domain: [],
  organization: '',
  status: [],
  type: 'concept',
  page: 1,
  lang: '',
};

export function isInitial(state: UrlState, name: keyof UrlState) {
  return _.isEqual(
    _.sortBy(asArray(state[name])),
    _.sortBy(asArray(initialUrlState[name]))
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
    domain: asStringArray(router.query.domain, initialUrlState.domain),
    organization: asString(
      router.query.organization,
      initialUrlState.organization
    ),
    status: asStringArray(router.query.status, initialUrlState.status),
    type: asString(router.query.type, initialUrlState.type),
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

function updateURLState(router: NextRouter, state?: UrlState): void {
  const {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    q,
    domain,
    organization,
    status,
    type,
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
        ...buildUrlStatePatch({ ...initialUrlState, ...state }),
      },
    },
    undefined,
    { shallow: true }
  );
}

function buildUrlStatePatch(state: UrlState): Partial<UrlState> {
  const patch: Partial<UrlState> = {};

  if (!isInitial(state, 'q')) patch.q = state.q;
  if (!isInitial(state, 'domain')) patch.domain = state.domain;
  if (!isInitial(state, 'organization'))
    patch.organization = state.organization;
  if (!isInitial(state, 'status')) patch.status = state.status;
  if (!isInitial(state, 'type')) patch.type = state.type;
  if (!isInitial(state, 'page')) patch.page = state.page;
  if (!isInitial(state, 'lang')) patch.lang = state.lang;
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
