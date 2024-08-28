export const NAMESPACE_ROOT = 'https://iri.suomi.fi/terminology/';

export function getNamespace(terminologyId: string) {
  return `${NAMESPACE_ROOT}${terminologyId}/`;
}
