export function createSearchRegex(search: string) {
  return new RegExp('(' + sanitizeRegex(search) + ')', 'gi');
}

function sanitizeRegex(term: string) {
  return term && term.toString().replace(/[\\\^$*+?.()|{}\[\]]/g, '\\$&');
}
